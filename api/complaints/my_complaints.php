<?php
/**
 * CivicResolve Citizen Personal Complaints Retrieval
 * GET /api/complaints/my_complaints.php
 */

declare(strict_types=1);

require_once __DIR__ . '/../helpers/response.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    jsonError('Method not allowed. Use GET.', 405);
}

$user = requireAuth();
$pdo = getDbConnection();

// Optional filter by status
$statusFilter = $_GET['status'] ?? null;

try {
    $sql = '
        SELECT 
            c.complaint_id,
            c.user_id,
            c.title,
            c.description,
            c.image_path,
            c.latitude,
            c.longitude,
            c.address,
            c.status,
            c.priority,
            c.admin_remarks,
            c.created_at,
            c.updated_at,
            cat.name AS category_name,
            sub.name AS subcategory_name,
            d.name AS department_name,
            d.code AS department_code
        FROM complaints c
        LEFT JOIN complaint_categories cat ON c.category_id = cat.category_id
        LEFT JOIN complaint_categories sub ON c.subcategory_id = sub.category_id
        LEFT JOIN departments d ON c.department_id = d.department_id
        WHERE c.user_id = :user_id
    ';

    $params = ['user_id' => $user['user_id']];

    if (!empty($statusFilter) && in_array($statusFilter, ['Pending', 'Approved', 'In Progress', 'Resolved', 'Rejected'], true)) {
        $sql .= ' AND c.status = :status';
        $params['status'] = $statusFilter;
    }

    $sql .= ' ORDER BY c.created_at DESC';

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $complaints = $stmt->fetchAll();

    jsonSuccess($complaints, 'Personal complaints retrieved successfully.');

} catch (PDOException $e) {
    error_log('My complaints query error: ' . $e->getMessage());
    jsonError('Failed to fetch complaints.', 500);
}
