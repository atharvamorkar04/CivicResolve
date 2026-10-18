<?php
/**
 * CivicResolve Department Assigned Complaints Retrieval
 * GET /api/department/complaints.php
 */

declare(strict_types=1);

require_once __DIR__ . '/../helpers/response.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    jsonError('Method not allowed. Use GET.', 405);
}

$user = requireRole(['department', 'admin']);
$pdo = getDbConnection();

$deptId = $user['department_id'];

// If an admin accesses this endpoint, allow passing ?department_id=
if ($user['role'] === 'admin' && !empty($_GET['department_id'])) {
    $deptId = (int)$_GET['department_id'];
}

if (empty($deptId)) {
    jsonError('No municipal department assigned to this user.', 400);
}

$statusFilter = $_GET['status'] ?? null;

try {
    // 1. Department metrics
    $metricsStmt = $pdo->prepare('
        SELECT 
            COUNT(*) AS total,
            SUM(status = "Approved") AS pending_action,
            SUM(status = "In Progress") AS in_progress,
            SUM(status = "Resolved") AS resolved
        FROM complaints
        WHERE department_id = :dept_id
    ');
    $metricsStmt->execute(['dept_id' => $deptId]);
    $stats = $metricsStmt->fetch();

    // 2. Assigned complaints
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
            u.name AS citizen_name,
            u.email AS citizen_email,
            u.phone AS citizen_phone
        FROM complaints c
        LEFT JOIN complaint_categories cat ON c.category_id = cat.category_id
        LEFT JOIN complaint_categories sub ON c.subcategory_id = sub.category_id
        LEFT JOIN users u ON c.user_id = u.user_id
        WHERE c.department_id = :dept_id
    ';

    $params = ['dept_id' => $deptId];

    if (!empty($statusFilter) && in_array($statusFilter, ['Pending', 'Approved', 'In Progress', 'Resolved', 'Rejected'], true)) {
        $sql .= ' AND c.status = :status';
        $params['status'] = $statusFilter;
    }

    $sql .= ' ORDER BY c.created_at DESC';

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $complaints = $stmt->fetchAll();

    // Department info
    $deptStmt = $pdo->prepare('SELECT name, code FROM departments WHERE department_id = :id LIMIT 1');
    $deptStmt->execute(['id' => $deptId]);
    $deptInfo = $deptStmt->fetch();

    jsonSuccess([
        'department_id'   => $deptId,
        'department_name' => $deptInfo['name'] ?? null,
        'department_code' => $deptInfo['code'] ?? null,
        'metrics' => [
            'total'          => (int)($stats['total'] ?? 0),
            'pending_action' => (int)($stats['pending_action'] ?? 0),
            'in_progress'    => (int)($stats['in_progress'] ?? 0),
            'resolved'       => (int)($stats['resolved'] ?? 0)
        ],
        'complaints' => $complaints
    ], 'Department complaints retrieved successfully.');

} catch (PDOException $e) {
    error_log('Department complaints fetch error: ' . $e->getMessage());
    jsonError('Failed to fetch department complaints.', 500);
}
