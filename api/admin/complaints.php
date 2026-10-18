<?php
/**
 * CivicResolve Administrator Complaint Management Overview
 * GET /api/admin/complaints.php
 * Supports filtering by status, department, category, and keyword search
 */

declare(strict_types=1);

require_once __DIR__ . '/../helpers/response.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    jsonError('Method not allowed. Use GET.', 405);
}

// Require admin authorization
requireRole('admin');
$pdo = getDbConnection();

$statusFilter     = $_GET['status'] ?? null;
$deptFilter       = !empty($_GET['department_id']) ? (int)$_GET['department_id'] : null;
$categoryFilter   = !empty($_GET['category_id']) ? (int)$_GET['category_id'] : null;
$search           = trim((string)($_GET['search'] ?? ''));

try {
    // 1. Fetch dashboard metrics for administrators
    $metricsStmt = $pdo->query('
        SELECT 
            COUNT(*) AS total,
            SUM(status = "Pending") AS pending,
            SUM(status = "Approved") AS approved,
            SUM(status = "In Progress") AS in_progress,
            SUM(status = "Resolved") AS resolved,
            SUM(status = "Rejected") AS rejected
        FROM complaints
    ');
    $stats = $metricsStmt->fetch();

    // 2. Build filtered complaint query
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
            c.department_id,
            c.status,
            c.priority,
            c.admin_remarks,
            c.created_at,
            c.updated_at,
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
        WHERE 1 = 1
    ';

    $params = [];

    if (!empty($statusFilter) && in_array($statusFilter, ['Pending', 'Approved', 'In Progress', 'Resolved', 'Rejected'], true)) {
        $sql .= ' AND c.status = :status';
        $params['status'] = $statusFilter;
    }

    if (!empty($deptFilter)) {
        $sql .= ' AND c.department_id = :dept_id';
        $params['dept_id'] = $deptFilter;
    }

    if (!empty($categoryFilter)) {
        $sql .= ' AND c.category_id = :cat_id';
        $params['cat_id'] = $categoryFilter;
    }

    if (!empty($search)) {
        $sql .= ' AND (c.title LIKE :search OR c.description LIKE :search OR c.address LIKE :search OR u.name LIKE :search)';
        $params['search'] = '%' . $search . '%';
    }

    $sql .= ' ORDER BY c.created_at DESC';

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $complaints = $stmt->fetchAll();

    jsonSuccess([
        'metrics' => [
            'total'       => (int)($stats['total'] ?? 0),
            'pending'     => (int)($stats['pending'] ?? 0),
            'approved'    => (int)($stats['approved'] ?? 0),
            'in_progress' => (int)($stats['in_progress'] ?? 0),
            'resolved'    => (int)($stats['resolved'] ?? 0),
            'rejected'    => (int)($stats['rejected'] ?? 0)
        ],
        'complaints' => $complaints
    ], 'Administrative complaints list retrieved successfully.');

} catch (PDOException $e) {
    error_log('Admin complaints fetch error: ' . $e->getMessage());
    jsonError('Failed to fetch complaints list.', 500);
}
