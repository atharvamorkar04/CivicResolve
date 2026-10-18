<?php
/**
 * CivicResolve Category & Subcategory Catalog Provider
 * GET /api/categories/index.php
 * Supports ?parent_id=<id> or ?include_subcategories=1
 */

declare(strict_types=1);

require_once __DIR__ . '/../helpers/response.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    jsonError('Method not allowed. Use GET.', 405);
}

$pdo = getDbConnection();

$parentIdParam = $_GET['parent_id'] ?? null;
$includeSubcategories = !empty($_GET['include_subcategories']);

try {
    if ($parentIdParam !== null && $parentIdParam !== '') {
        $parentId = (int)$parentIdParam;
        $stmt = $pdo->prepare('
            SELECT category_id, name, parent_category_id, description, is_active
            FROM complaint_categories
            WHERE parent_category_id = :parent_id AND is_active = 1
            ORDER BY name ASC
        ');
        $stmt->execute(['parent_id' => $parentId]);
        $subcategories = $stmt->fetchAll();

        jsonSuccess($subcategories, 'Subcategories retrieved successfully.');
    }

    if ($includeSubcategories) {
        // Fetch full hierarchical tree
        $stmt = $pdo->query('
            SELECT category_id, name, parent_category_id, description, is_active
            FROM complaint_categories
            WHERE is_active = 1
            ORDER BY parent_category_id ASC, name ASC
        ');
        $all = $stmt->fetchAll();

        $tree = [];
        $subMap = [];

        foreach ($all as $item) {
            if ($item['parent_category_id'] === null) {
                $item['subcategories'] = [];
                $tree[$item['category_id']] = $item;
            } else {
                $subMap[$item['parent_category_id']][] = $item;
            }
        }

        foreach ($subMap as $parentId => $subs) {
            if (isset($tree[$parentId])) {
                $tree[$parentId]['subcategories'] = $subs;
            }
        }

        jsonSuccess(array_values($tree), 'Category hierarchy retrieved successfully.');
    }

    // Default: Return top-level categories
    $stmt = $pdo->query('
        SELECT category_id, name, parent_category_id, description, is_active
        FROM complaint_categories
        WHERE parent_category_id IS NULL AND is_active = 1
        ORDER BY category_id ASC
    ');
    $categories = $stmt->fetchAll();

    jsonSuccess($categories, 'Primary categories retrieved successfully.');

} catch (PDOException $e) {
    error_log('Category fetch error: ' . $e->getMessage());
    jsonError('Failed to retrieve categories.', 500);
}
