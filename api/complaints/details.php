<?php
/**
 * CivicResolve Authorized Complaint Details & Status History
 * GET /api/complaints/details.php?id=<complaint_id>
 */

declare(strict_types=1);

require_once __DIR__ . '/../helpers/response.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    jsonError('Method not allowed. Use GET.', 405);
}

$user = requireAuth();
$complaintIdParam = $_GET['id'] ?? $_GET['complaint_id'] ?? null;

if (empty($complaintIdParam) || !is_numeric($complaintIdParam)) {
    jsonError('Valid complaint ID is required.', 400);
}

$complaintId = (int)$complaintIdParam;
$pdo = getDbConnection();

try {
    // 1. Fetch complaint record
    $stmt = $pdo->prepare('
        SELECT 
            c.*,
            cat.name AS category_name,
            sub.name AS subcategory_name,
            d.name AS department_name,
            d.code AS department_code,
            u.name AS citizen_name,
            u.email AS citizen_email,
            u.phone AS citizen_phone
        FROM complaints c
        LEFT JOIN complaint_categories cat ON c.category_id = cat.category_id
        LEFT JOIN complaint_categories sub ON c.subcategory_id = sub.category_id
        LEFT JOIN departments d ON c.department_id = d.department_id
        LEFT JOIN users u ON c.user_id = u.user_id
        WHERE c.complaint_id = :complaint_id
        LIMIT 1
    ');
    $stmt->execute(['complaint_id' => $complaintId]);
    $complaint = $stmt->fetch();

    if (!$complaint) {
        jsonError('Complaint not found.', 404);
    }

    // 2. Strict Server-Side Ownership & Role Authorization Check
    if ($user['role'] === 'citizen') {
        if ((int)$complaint['user_id'] !== (int)$user['user_id']) {
            jsonError('Forbidden. You do not have permission to view another citizen\'s complaint.', 403);
        }
    } elseif ($user['role'] === 'department') {
        if ((int)$complaint['department_id'] !== (int)$user['department_id']) {
            jsonError('Forbidden. This complaint is not assigned to your department.', 403);
        }
    }
    // Admins have universal view permission

    // 3. Retrieve audit trail history from complaint_updates
    $historyStmt = $pdo->prepare('
        SELECT 
            u.update_id,
            u.complaint_id,
            u.user_id,
            u.previous_status,
            u.new_status,
            u.remarks,
            u.created_at,
            usr.name AS actor_name,
            usr.role AS actor_role
        FROM complaint_updates u
        LEFT JOIN users usr ON u.user_id = usr.user_id
        WHERE u.complaint_id = :complaint_id
        ORDER BY u.created_at ASC, u.update_id ASC
    ');
    $historyStmt->execute(['complaint_id' => $complaintId]);
    $history = $historyStmt->fetchAll();

    $complaint['history'] = $history;

    jsonSuccess($complaint, 'Complaint details retrieved successfully.');

} catch (PDOException $e) {
    error_log('Complaint details error: ' . $e->getMessage());
    jsonError('Failed to fetch complaint details.', 500);
}
