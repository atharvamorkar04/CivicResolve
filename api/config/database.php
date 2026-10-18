<?php
/**
 * CivicResolve Database Connection Singleton
 * Uses PDO with strict prepared statement execution.
 */

declare(strict_types=1);

function getDbConfig(): array {
    $configFile = __DIR__ . '/config.php';
    if (!file_exists($configFile)) {
        $configFile = __DIR__ . '/config.example.php';
    }
    return require $configFile;
}

function getDbConnection(): PDO {
    static $pdo = null;

    if ($pdo !== null) {
        return $pdo;
    }

    $config = getDbConfig();
    $db = $config['db'];

    $dsn = sprintf(
        'mysql:host=%s;port=%d;dbname=%s;charset=%s',
        $db['host'],
        $db['port'] ?? 3306,
        $db['dbname'],
        $db['charset'] ?? 'utf8mb4'
    );

    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    try {
        $pdo = new PDO($dsn, $db['username'], $db['password'], $options);
        return $pdo;
    } catch (PDOException $e) {
        // Log real error on server log, never expose credentials or details to client
        error_log('Database connection error: ' . $e->getMessage());
        http_response_code(500);
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode([
            'success' => false,
            'message' => 'Unable to connect to the database service. Please verify server configuration.'
        ]);
        exit;
    }
}
