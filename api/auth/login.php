<?php
/**
 * CivicResolve User Login Handler
 * POST /api/auth/login.php
 */

declare(strict_types=1);

require_once __DIR__ . '/../helpers/response.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    jsonError('Method not allowed. Use POST.', 405);
}

$data = getRequestData();

$email    = trim(strtolower((string)($data['email'] ?? '')));
$password = (string)($data['password'] ?? '');

$errors = [];
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'A valid email address is required.';
}
if (empty($password)) {
    $errors['password'] = 'Password is required.';
}

if (!empty($errors)) {
    jsonError('Validation failed. Please enter your credentials.', 422, $errors);
}

$pdo = getDbConnection();

try {
    $stmt = $pdo->prepare('
        SELECT u.user_id, u.name, u.email, u.password_hash, u.phone, u.role, u.department_id, d.name AS department_name 
        FROM users u
        LEFT JOIN departments d ON u.department_id = d.department_id
        WHERE u.email = :email 
        LIMIT 1
    ');
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch();

    if (!$user) {
        // Return generic message to prevent email enumeration
        jsonError('Invalid email or password.', 401);
    }

    // Plain-text comparison (with backward-compatibility to convert old bcrypt hashes to plain text on login)
    $passwordMatches = false;

    if ($password === $user['password_hash']) {
        $passwordMatches = true;
    } elseif (password_verify($password, $user['password_hash'])) {
        // Converted old bcrypt hash to plain text in database
        $passwordMatches = true;
        $updateStmt = $pdo->prepare('UPDATE users SET password_hash = :plain WHERE user_id = :id');
        $updateStmt->execute(['plain' => $password, 'id' => $user['user_id']]);
    }

    if (!$passwordMatches) {
        jsonError('Invalid email or password.', 401);
    }

    // Prevent session fixation
    session_regenerate_id(true);

    $_SESSION['user'] = [
        'user_id'       => (int)$user['user_id'],
        'name'          => $user['name'],
        'email'         => $user['email'],
        'role'          => $user['role'],
        'department_id'   => $user['department_id'] !== null ? (int)$user['department_id'] : null,
        'department_name' => $user['department_name'] ?? null,
        'phone'           => $user['phone']
    ];

    jsonSuccess([
        'user' => $_SESSION['user'],
        'csrf_token' => $_SESSION['csrf_token']
    ], 'Authentication successful.');

} catch (PDOException $e) {
    error_log('Login DB error: ' . $e->getMessage());
    jsonError('An unexpected server error occurred during authentication.', 500);
}
