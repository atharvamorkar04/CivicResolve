<?php
/**
 * CivicResolve Active Session Inspector
 * GET /api/auth/me.php
 */

declare(strict_types=1);

require_once __DIR__ . '/../helpers/response.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    jsonError('Method not allowed. Use GET.', 405);
}

$user = requireAuth();

// Fetch fresh details from database
$pdo = getDbConnection();
try {
    $stmt = $pdo->prepare('
        SELECT u.user_id, u.name, u.email, u.phone, u.role, u.department_id, d.name AS department_name
        FROM users u
        LEFT JOIN departments d ON u.department_id = d.department_id
        WHERE u.user_id = :id
        LIMIT 1
    ');
    $stmt->execute(['id' => $user['user_id']]);
    $freshUser = $stmt->fetch();

    if (!$freshUser) {
        // Account might have been removed
        $_SESSION = [];
        session_destroy();
        jsonError('User account not found. Please log in again.', 401);
    }

    // Refresh session cache
    $_SESSION['user'] = [
        'user_id'         => (int)$freshUser['user_id'],
        'name'            => $freshUser['name'],
        'email'           => $freshUser['email'],
        'role'            => $freshUser['role'],
        'department_id'   => $freshUser['department_id'] !== null ? (int)$freshUser['department_id'] : null,
        'department_name' => $freshUser['department_name'],
        'phone'           => $freshUser['phone']
    ];

    jsonSuccess([
        'user'       => $_SESSION['user'],
        'csrf_token' => $_SESSION['csrf_token']
    ], 'Active session verified.');

} catch (PDOException $e) {
    error_log('Me session check error: ' . $e->getMessage());
    jsonError('Unable to verify user session.', 500);
}
