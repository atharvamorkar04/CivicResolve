<?php
/**
 * CivicResolve CSRF Token Provider
 * GET /api/auth/csrf.php
 */

declare(strict_types=1);

require_once __DIR__ . '/../helpers/response.php';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    jsonError('Method not allowed. Use GET.', 405);
}

jsonSuccess([
    'csrf_token' => $_SESSION['csrf_token'] ?? ''
], 'CSRF token retrieved');
