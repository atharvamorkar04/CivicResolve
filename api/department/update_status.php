<?php
/**
 * CivicResolve Department Status Update Handler
 * POST /api/department/update_status.php
 * Updates assigned complaint status (e.g. In Progress, Resolved) with field remarks.
 */

declare(strict_types=1);

require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/uploader.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    jsonError('Method not allowed. Use POST.', 405);
}

$user = requireRole(['department', 'admin']);
$pdo = getDbConnection();

$data = getRequestData();

$complaintIdParam = $data['complaint_id'] ?? null;
if (empty($complaintIdParam) || !is_numeric($complaintIdParam)) {
    jsonError('A valid complaint_id is required.', 400);
}

$complaintId = (int)$complaintIdParam;
$newStatus   = $data['status'] ?? null;
$remarks     = trim((string)($data['remarks'] ?? ''));

if (empty($newStatus) || !in_array($newStatus, ['In Progress', 'Resolved'], true)) {
    jsonError('Valid status required: "In Progress" or "Resolved".', 422);
}

if (empty($remarks) || mb_strlen($remarks) < 5) {
    jsonError('Official remarks describing action taken are required (minimum 5 characters).', 422);
}

// Fetch complaint and verify department assignment
$stmt = $pdo->prepare('
    SELECT complaint_id, status, department_id 
    FROM complaints 
    WHERE complaint_id = :id 
    LIMIT 1
');
$stmt->execute(['id' => $complaintId]);
$complaint = $stmt->fetch();

if (!$complaint) {
    jsonError('Complaint not found.', 404);
}

if ($complaint['status'] === 'Resolved') {
    jsonError('This complaint has already been resolved and closed.', 422);
}

// Ownership check: If department user, verify it belongs to their department
if ($user['role'] === 'department') {
    if ((int)$complaint['department_id'] !== (int)$user['department_id']) {
        jsonError('Forbidden. This complaint is not assigned to your department.', 403);
    }
}

// Handle optional resolution evidence image upload
$resolutionImagePath = null;
if (isset($_FILES['resolution_image']) && $_FILES['resolution_image']['error'] !== UPLOAD_ERR_NO_FILE) {
    $resolutionImagePath = handleComplaintImageUpload('resolution_image');
} elseif (isset($_FILES['image']) && $_FILES['image']['error'] !== UPLOAD_ERR_NO_FILE) {
    $resolutionImagePath = handleComplaintImageUpload('image');
}

$previousStatus = $complaint['status'];

try {
    $pdo->beginTransaction();

    // 1. Check if resolution_image_path column exists in complaints table
    $hasResolutionCol = false;
    try {
        $colCheck = $pdo->query("SHOW COLUMNS FROM complaints LIKE 'resolution_image_path'")->fetch();
        $hasResolutionCol = !empty($colCheck);
    } catch (PDOException $e) {
        $hasResolutionCol = false;
    }

    if ($hasResolutionCol && $resolutionImagePath) {
        $updateStmt = $pdo->prepare('
            UPDATE complaints 
            SET status = :status,
                resolution_image_path = :res_img,
                updated_at = CURRENT_TIMESTAMP
            WHERE complaint_id = :id
        ');
        $updateStmt->execute([
            'status'  => $newStatus,
            'res_img' => $resolutionImagePath,
            'id'      => $complaintId
        ]);
    } else {
        $updateStmt = $pdo->prepare('
            UPDATE complaints 
            SET status = :status,
                updated_at = CURRENT_TIMESTAMP
            WHERE complaint_id = :id
        ');
        $updateStmt->execute([
            'status' => $newStatus,
            'id'     => $complaintId
        ]);
    }

    // 2. Insert into complaint_updates audit trail
    $historyStmt = $pdo->prepare('
        INSERT INTO complaint_updates (
            complaint_id, user_id, previous_status, new_status, remarks
        ) VALUES (
            :complaint_id, :user_id, :prev_status, :new_status, :remarks
        )
    ');
    $historyStmt->execute([
        'complaint_id' => $complaintId,
        'user_id'      => $user['user_id'],
        'prev_status'  => $previousStatus,
        'new_status'   => $newStatus,
        'remarks'      => $remarks
    ]);

    $pdo->commit();

    jsonSuccess([
        'complaint_id'    => $complaintId,
        'previous_status' => $previousStatus,
        'new_status'      => $newStatus,
        'remarks'         => $remarks,
        'updated_at'      => date('Y-m-d H:i:s')
    ], 'Department complaint status successfully updated.');

} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('Department update status error: ' . $e->getMessage());
    jsonError('Failed to record status update due to server error.', 500);
}
