<?php
/**
 * CivicResolve Secure File Upload Processor
 * Enforces strict MIME inspection, file size checks, and unguessable file naming.
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/response.php';

function handleComplaintImageUpload(string $field = 'image'): ?string {
    if (!isset($_FILES[$field]) || $_FILES[$field]['error'] === UPLOAD_ERR_NO_FILE) {
        return null;
    }

    $file = $_FILES[$field];

    if ($file['error'] !== UPLOAD_ERR_OK) {
        $uploadErrors = [
            UPLOAD_ERR_INI_SIZE   => 'The uploaded image exceeds the server upload_max_filesize directive.',
            UPLOAD_ERR_FORM_SIZE  => 'The uploaded image exceeds the MAX_FILE_SIZE directive in the form.',
            UPLOAD_ERR_PARTIAL    => 'The image was only partially uploaded.',
            UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder on server.',
            UPLOAD_ERR_CANT_WRITE => 'Failed to write image to disk.',
            UPLOAD_ERR_EXTENSION  => 'A server extension stopped the file upload.'
        ];
        $msg = $uploadErrors[$file['error']] ?? 'An error occurred during image upload.';
        jsonError($msg, 400);
    }

    $config = getDbConfig();
    $maxBytes = $config['upload']['max_bytes'] ?? (5 * 1024 * 1024);
    $allowedMimes = $config['upload']['allowed_mimes'] ?? [
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/webp' => 'webp'
    ];
    $uploadDir = $config['upload']['upload_dir'] ?? (__DIR__ . '/../uploads/complaints/');

    // 1. Validate file size
    if ($file['size'] > $maxBytes) {
        $mb = round($maxBytes / (1024 * 1024));
        jsonError("Image file size exceeds the allowed limit of {$mb}MB.", 400);
    }

    // 2. Validate MIME type using finfo (do not trust client-supplied mime or extension)
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $detectedMime = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    if (!array_key_exists($detectedMime, $allowedMimes)) {
        jsonError('Invalid image format. Only JPG, PNG, and WebP images are permitted.', 400);
    }

    // 3. Verify image integrity with getimagesize
    $imgInfo = @getimagesize($file['tmp_name']);
    if ($imgInfo === false) {
        jsonError('Corrupted or invalid image file detected.', 400);
    }

    // 4. Ensure destination directory exists
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    // 5. Generate secure, unguessable filename
    $extension = $allowedMimes[$detectedMime];
    $filename = sprintf(
        'complaint_%s_%s.%s',
        date('Ymd_His'),
        bin2hex(random_bytes(8)),
        $extension
    );

    $destinationPath = rtrim($uploadDir, '/\\') . DIRECTORY_SEPARATOR . $filename;

    if (!move_uploaded_file($file['tmp_name'], $destinationPath)) {
        jsonError('Failed to save uploaded image. Server write permission error.', 500);
    }

    // Return sanitized relative web path for database storage (no absolute server paths)
    return 'uploads/complaints/' . $filename;
}
