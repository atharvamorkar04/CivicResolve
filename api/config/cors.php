<?php
/**
 * CivicResolve CORS & Session Management Handler
 * Handles cross-origin headers, preflight requests, and secure sessions.
 */

declare(strict_types=1);

require_once __DIR__ . '/database.php';

function initApiEnvironment(): void {
    $config = getDbConfig();
    $allowedOrigins = $config['cors']['allowed_origins'] ?? [
        'http://localhost:5173',
        'http://127.0.0.1:5173'
    ];

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (in_array($origin, $allowedOrigins, true)) {
        header("Access-Control-Allow-Origin: {$origin}");
    } elseif (!empty($origin)) {
        // Fallback for localhost variants
        if (preg_match('#^https?://(localhost|127\.0\.0\.1)(:\d+)?$#', $origin)) {
            header("Access-Control-Allow-Origin: {$origin}");
        }
    }

    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-CSRF-Token');
    header('Content-Type: application/json; charset=UTF-8');

    // Respond immediately to OPTIONS preflight
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(200);
        exit;
    }

    // Start session with secure cookie parameters
    if (session_status() === PHP_SESSION_NONE) {
        $sessCfg = $config['session'] ?? [];
        if (!empty($sessCfg['name'])) {
            session_name($sessCfg['name']);
        }

        $cookieParams = [
            'lifetime' => $sessCfg['lifetime'] ?? 86400,
            'path'     => $sessCfg['path'] ?? '/',
            'domain'   => $sessCfg['domain'] ?? '',
            'secure'   => $sessCfg['secure'] ?? false,
            'httponly' => $sessCfg['httponly'] ?? true,
            'samesite' => $sessCfg['samesite'] ?? 'Lax'
        ];

        session_set_cookie_params($cookieParams);
        session_start();
    }

    // Initialize CSRF token in session if not present
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
}

initApiEnvironment();
