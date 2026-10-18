<?php
/**
 * CivicResolve Citizen Feedback & Satisfaction Rating Handler
 * POST /api/complaints/feedback.php
 */

declare(strict_types=1);

require_once __DIR__ . '/../helpers/response.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    jsonError('Method not allowed. Use POST.', 405);
}

$user = requireAuth();
$pdo = getDbConnection();
$data = getRequestData();

$complaintIdParam = $data['complaint_id'] ?? null;
if (empty($complaintIdParam) || !is_numeric($complaintIdParam)) {
    jsonError('A valid complaint_id is required.', 400);
}

$complaintId = (int)$complaintIdParam;
$rating = (int)($data['rating'] ?? 0);
$feedback = trim((string)($data['feedback'] ?? ''));

if ($rating < 1 || $rating > 5) {
    jsonError('Rating must be an integer between 1 and 5 stars.', 422);
}

try {
    // 1. Verify complaint exists and check ownership
    $stmt = $pdo->prepare('
        SELECT complaint_id, user_id, status 
        FROM complaints 
        WHERE complaint_id = :id 
        LIMIT 1
    ');
    $stmt->execute(['id' => $complaintId]);
    $complaint = $stmt->fetch();

    if (!$complaint) {
        jsonError('Complaint not found.', 404);
    }

    if ($user['role'] === 'citizen' && (int)$complaint['user_id'] !== (int)$user['user_id']) {
        jsonError('Forbidden. You may only rate your own complaints.', 403);
    }

    // 2. Check if citizen_rating column exists in complaints table
    $hasRatingCol = false;
    try {
        $colCheck = $pdo->query("SHOW COLUMNS FROM complaints LIKE 'citizen_rating'")->fetch();
        $hasRatingCol = !empty($colCheck);
    } catch (PDOException $e) {
        $hasRatingCol = false;
    }

    if (!$hasRatingCol) {
        jsonError('The citizen_rating column has not been added to complaints yet. Please execute the ALTER TABLE query in phpMyAdmin.', 500);
    }

    // 3. Update feedback in complaints table
    $updateStmt = $pdo->prepare('
        UPDATE complaints 
        SET citizen_rating = :rating,
            citizen_feedback = :feedback,
            updated_at = CURRENT_TIMESTAMP
        WHERE complaint_id = :id
    ');
    $updateStmt->execute([
        'rating'   => $rating,
        'feedback' => !empty($feedback) ? $feedback : null,
        'id'       => $complaintId,
    ]);

    // 4. Log milestone to complaint_updates
    try {
        $logStmt = $pdo->prepare('
            INSERT INTO complaint_updates (complaint_id, user_id, previous_status, new_status, remarks, created_at)
            VALUES (:cid, :uid, :prev, :new, :remarks, CURRENT_TIMESTAMP)
        ');
        $remarksText = "Citizen submitted satisfaction rating: {$rating} / 5 stars.";
        if (!empty($feedback)) {
            $remarksText .= " Citizen Note: \"{$feedback}\"";
        }
        $logStmt->execute([
            'cid'     => $complaintId,
            'uid'     => (int)$user['user_id'],
            'prev'    => $complaint['status'],
            'new'     => $complaint['status'],
            'remarks' => $remarksText,
        ]);
    } catch (PDOException $e) {
        // If audit logging fails, don't break the user response
        error_log('Feedback update log failed: ' . $e->getMessage());
    }

    jsonSuccess([
        'complaint_id'     => $complaintId,
        'citizen_rating'   => $rating,
        'citizen_feedback' => $feedback,
    ], 'Citizen satisfaction feedback recorded successfully.');

} catch (PDOException $e) {
    error_log('Feedback submission DB error: ' . $e->getMessage());
    jsonError('Failed to record feedback due to a database error.', 500);
}
