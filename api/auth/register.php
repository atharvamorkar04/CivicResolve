<?php
/**
 * CivicResolve Citizen Registration Handler
 * POST /api/auth/register.php
 */

declare(strict_types=1);

require_once __DIR__ . '/../helpers/response.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    jsonError('Method not allowed. Use POST.', 405);
}

$data = getRequestData();

$name     = trim((string)($data['name'] ?? $data['full_name'] ?? ''));
$email    = trim(strtolower((string)($data['email'] ?? '')));
$password = (string)($data['password'] ?? '');
$phone    = isset($data['phone']) ? trim((string)$data['phone']) : null;

// Server-side validation
$errors = [];

if (empty($name) || mb_strlen($name) < 2 || mb_strlen($name) > 100) {
    $errors['name'] = 'Full name must be between 2 and 100 characters.';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 100) {
    $errors['email'] = 'A valid email address is required (maximum 100 characters).';
}

if (empty($password) || mb_strlen($password) < 8) {
    $errors['password'] = 'Password must be at least 8 characters long.';
}

if (!empty($phone) && (mb_strlen($phone) < 7 || mb_strlen($phone) > 20)) {
    $errors['phone'] = 'Phone number must be between 7 and 20 characters if provided.';
}

if (!empty($errors)) {
    jsonError('Validation failed. Please correct the highlighted errors.', 422, $errors);
}

$pdo = getDbConnection();

// Check for duplicate email
try {
    $stmt = $pdo->prepare('SELECT user_id FROM users WHERE email = :email LIMIT 1');
    $stmt->execute(['email' => $email]);
    if ($stmt->fetch()) {
        jsonError('This email address is already registered. Please log in.', 409);
    }

    // Store plain-text password directly as requested
    $passwordHash = $password;

    $insert = $pdo->prepare('
        INSERT INTO users (name, email, password_hash, phone, role, department_id)
        VALUES (:name, :email, :password_hash, :phone, :role, NULL)
    ');

    $insert->execute([
        'name'          => $name,
        'email'         => $email,
        'password_hash' => $passwordHash,
        'phone'         => !empty($phone) ? $phone : null,
        'role'          => 'citizen'
    ]);

    $newUserId = (int)$pdo->lastInsertId();

    // Automatically initialize authenticated session for smooth onboarding
    session_regenerate_id(true);
    $_SESSION['user'] = [
        'user_id'       => $newUserId,
        'name'          => $name,
        'email'         => $email,
        'role'          => 'citizen',
        'department_id' => null,
        'phone'         => $phone
    ];

    jsonSuccess([
        'user' => [
            'user_id'       => $newUserId,
            'name'          => $name,
            'email'         => $email,
            'role'          => 'citizen',
            'department_id' => null,
            'phone'         => $phone
        ],
        'csrf_token' => $_SESSION['csrf_token']
    ], 'Account registered successfully.', 201);

} catch (PDOException $e) {
    error_log('Registration DB error: ' . $e->getMessage());
    jsonError('An unexpected server error occurred during registration. Please try again later.', 500);
}
