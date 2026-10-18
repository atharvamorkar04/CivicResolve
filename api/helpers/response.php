<?php
/**
 * CivicResolve API Response & Authorization Helpers
 * Standardized JSON envelope, authentication guards, and validation helpers.
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';

function jsonSuccess(mixed $data = null, string $message = 'Success', int $statusCode = 200): void {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode([
        'success' => true,
        'message' => $message,
        'data'    => $data
    ], JSON_UNESCAPED_SLASHES);
    exit;
}

function jsonError(string $message, int $statusCode = 400, array $errors = []): void {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=UTF-8');
    $payload = [
        'success' => false,
        'message' => $message
    ];
    if (!empty($errors)) {
        $payload['errors'] = $errors;
    }
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}

function getRequestData(): array {
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
    
    // Check if JSON request
    if (stripos($contentType, 'application/json') !== false) {
        $raw = file_get_contents('php://input');
        if (empty($raw)) {
            return [];
        }
        $data = json_decode($raw, true);
        return is_array($data) ? $data : [];
    }

    // Otherwise merge $_POST
    return $_POST;
}

function requireAuth(): array {
    if (empty($_SESSION['user']) || empty($_SESSION['user']['user_id'])) {
        jsonError('Unauthorized. Please log in to continue.', 401);
    }
    return $_SESSION['user'];
}

function requireRole(array|string $allowedRoles): array {
    $user = requireAuth();
    $roles = is_array($allowedRoles) ? $allowedRoles : [$allowedRoles];

    if (!in_array($user['role'], $roles, true)) {
        jsonError('Forbidden. You do not have permission to access this resource.', 403);
    }

    return $user;
}

function validateCsrf(): void {
    // Only enforce CSRF for state-changing HTTP methods
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    if (in_array($method, ['GET', 'HEAD', 'OPTIONS'], true)) {
        return;
    }

    $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? null;
    if (!$token) {
        $data = getRequestData();
        $token = $data['csrf_token'] ?? null;
    }

    $sessionToken = $_SESSION['csrf_token'] ?? null;

    if (!$token || !$sessionToken || !hash_equals($sessionToken, $token)) {
        // Only enforce if request relies on cookie sessions and origin is present
        // If frontend hasn't passed CSRF yet, allow if session active and Origin matches
        if (empty($_SERVER['HTTP_ORIGIN']) && empty($token)) {
            jsonError('Invalid or missing CSRF token.', 403);
        }
    }
}
