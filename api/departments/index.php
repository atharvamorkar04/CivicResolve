<?php
/**
 * CivicResolve Departments Provider
 * GET /api/departments/index.php
 */

declare(strict_types=1);

require_once __DIR__ . '/../helpers/response.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    jsonError('Method not allowed. Use GET.', 405);
}

$pdo = getDbConnection();

try {
    $stmt = $pdo->query('
        SELECT department_id, name, code, contact_email, description, is_active
        FROM departments
        WHERE is_active = 1
        ORDER BY name ASC
    ');
    $departments = $stmt->fetchAll();

    jsonSuccess($departments, 'Active departments retrieved successfully.');
} catch (PDOException $e) {
    error_log('Department fetch error: ' . $e->getMessage());
    jsonError('Failed to retrieve departments.', 500);
}
