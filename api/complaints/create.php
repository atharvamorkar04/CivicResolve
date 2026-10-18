<?php
/**
 * CivicResolve Complaint Submission Handler
 * POST /api/complaints/create.php
 * Accepts JSON or multipart/form-data with optional photo and geolocation
 */

declare(strict_types=1);

require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/uploader.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    jsonError('Method not allowed. Use POST.', 405);
}

// Ensure user is authenticated citizen or admin testing
$user = requireRole(['citizen', 'admin']);
$pdo = getDbConnection();

$data = getRequestData();

$title         = trim((string)($data['title'] ?? ''));
$description   = trim((string)($data['description'] ?? ''));
$categoryId    = !empty($data['category_id']) ? (int)$data['category_id'] : null;
$subcategoryId = !empty($data['subcategory_id']) ? (int)$data['subcategory_id'] : null;
$address       = isset($data['address']) ? trim((string)$data['address']) : null;
$priority      = isset($data['priority']) && in_array($data['priority'], ['Standard', 'Urgent'], true)
                    ? $data['priority']
                    : 'Standard';

// Location coordinates
$latRaw = $data['latitude'] ?? null;
$lonRaw = $data['longitude'] ?? null;

$latitude  = null;
$longitude = null;

$errors = [];

// Validation: Title & Description
if (empty($title) || mb_strlen($title) < 5 || mb_strlen($title) > 150) {
    $errors['title'] = 'Complaint title must be between 5 and 150 characters.';
}

if (empty($description) || mb_strlen($description) < 10) {
    $errors['description'] = 'Please provide a detailed description (minimum 10 characters).';
}

// Validation: Category
if (empty($categoryId)) {
    $errors['category_id'] = 'Please select a primary category.';
} else {
    // Verify parent category exists and is top-level
    $catCheck = $pdo->prepare('
        SELECT category_id FROM complaint_categories 
        WHERE category_id = :cat_id AND parent_category_id IS NULL AND is_active = 1
        LIMIT 1
    ');
    $catCheck->execute(['cat_id' => $categoryId]);
    if (!$catCheck->fetch()) {
        $errors['category_id'] = 'Selected primary category is invalid or inactive.';
    }
}

// Validation: Subcategory relationship
if (!empty($subcategoryId) && !empty($categoryId)) {
    $subCheck = $pdo->prepare('
        SELECT category_id FROM complaint_categories 
        WHERE category_id = :sub_id AND parent_category_id = :cat_id AND is_active = 1
        LIMIT 1
    ');
    $subCheck->execute(['sub_id' => $subcategoryId, 'cat_id' => $categoryId]);
    if (!$subCheck->fetch()) {
        $errors['subcategory_id'] = 'Selected subcategory does not belong to the chosen primary category.';
    }
}

// Validation: Coordinates
if ($latRaw !== null && $latRaw !== '') {
    if (!is_numeric($latRaw)) {
        $errors['latitude'] = 'Latitude must be a valid numeric coordinate.';
    } else {
        $latFloat = (float)$latRaw;
        if ($latFloat < -90.0 || $latFloat > 90.0) {
            $errors['latitude'] = 'Latitude must be between -90.0 and 90.0 degrees.';
        } else {
            $latitude = number_format($latFloat, 8, '.', '');
        }
    }
}

if ($lonRaw !== null && $lonRaw !== '') {
    if (!is_numeric($lonRaw)) {
        $errors['longitude'] = 'Longitude must be a valid numeric coordinate.';
    } else {
        $lonFloat = (float)$lonRaw;
        if ($lonFloat < -180.0 || $lonFloat > 180.0) {
            $errors['longitude'] = 'Longitude must be between -180.0 and 180.0 degrees.';
        } else {
            $longitude = number_format($lonFloat, 8, '.', '');
        }
    }
}

// Ensure coordinates are supplied in pairs
if (($latitude !== null && $longitude === null) || ($latitude === null && $longitude !== null)) {
    $errors['coordinates'] = 'Both latitude and longitude must be provided together.';
}

if (!empty($errors)) {
    jsonError('Validation failed. Please review the highlighted fields.', 422, $errors);
}

// Process optional photo upload
$imagePath = handleComplaintImageUpload('image');

// Execute complaint creation inside transaction
try {
    $pdo->beginTransaction();

    $insert = $pdo->prepare('
        INSERT INTO complaints (
            user_id, title, description, category_id, subcategory_id,
            image_path, latitude, longitude, address, department_id,
            status, priority, admin_remarks
        ) VALUES (
            :user_id, :title, :description, :category_id, :subcategory_id,
            :image_path, :latitude, :longitude, :address, NULL,
            \'Pending\', :priority, NULL
        )
    ');

    $insert->execute([
        'user_id'        => $user['user_id'],
        'title'          => $title,
        'description'    => $description,
        'category_id'    => $categoryId,
        'subcategory_id' => $subcategoryId,
        'image_path'     => $imagePath,
        'latitude'       => $latitude,
        'longitude'      => $longitude,
        'address'        => !empty($address) ? $address : null,
        'priority'       => $priority
    ]);

    $complaintId = (int)$pdo->lastInsertId();

    // Insert immutable audit history record
    $history = $pdo->prepare('
        INSERT INTO complaint_updates (
            complaint_id, user_id, previous_status, new_status, remarks
        ) VALUES (
            :complaint_id, :user_id, NULL, \'Pending\', :remarks
        )
    ');

    $history->execute([
        'complaint_id' => $complaintId,
        'user_id'      => $user['user_id'],
        'remarks'      => 'Complaint submitted by citizen.'
    ]);

    $pdo->commit();

    jsonSuccess([
        'complaint_id'   => $complaintId,
        'title'          => $title,
        'status'         => 'Pending',
        'priority'       => $priority,
        'image_path'     => $imagePath,
        'created_at'     => date('Y-m-d H:i:s')
    ], 'Complaint submitted successfully.', 201);

} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('Complaint submission error: ' . $e->getMessage());
    jsonError('Failed to record complaint due to a server error. Please try again.', 500);
}
