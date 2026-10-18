<?php
/**
 * CivicResolve Administrator Complaint Triage & Status Update
 * POST /api/admin/update_complaint.php
 * Handles approval, rejection, department assignment, remarks, and priority updates.
 */

declare(strict_types=1);

require_once __DIR__ . '/../helpers/response.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    jsonError('Method not allowed. Use POST.', 405);
}

$admin = requireRole('admin');
$pdo = getDbConnection();

$data = getRequestData();

$complaintIdParam = $data['complaint_id'] ?? null;
if (empty($complaintIdParam) || !is_numeric($complaintIdParam)) {
    jsonError('A valid complaint_id is required.', 400);
}

$complaintId = (int)$complaintIdParam;

// Retrieve current complaint
$stmt = $pdo->prepare('
    SELECT complaint_id, status, department_id, priority, admin_remarks 
    FROM complaints 
    WHERE complaint_id = :id 
    LIMIT 1
');
$stmt->execute(['id' => $complaintId]);
$current = $stmt->fetch();

if (!$current) {
    jsonError('Complaint not found.', 404);
}

// Enforce terminal status lock: Resolved or Rejected complaints are permanently closed
if (in_array($current['status'], ['Resolved', 'Rejected'], true)) {
    jsonError("This complaint is {$current['status']} and permanently closed. Further modifications are prohibited.", 422);
}

$previousStatus = $current['status'];
$newStatus      = isset($data['status']) && in_array($data['status'], ['Pending', 'Approved', 'In Progress', 'Resolved', 'Rejected'], true)
                    ? $data['status']
                    : $previousStatus;

$departmentId = isset($data['department_id']) && $data['department_id'] !== ''
                    ? (int)$data['department_id']
                    : $current['department_id'];

$priority = isset($data['priority']) && in_array($data['priority'], ['Standard', 'Urgent'], true)
                ? $data['priority']
                : $current['priority'];

$remarks = isset($data['admin_remarks']) ? trim((string)$data['admin_remarks']) : null;

// Validate department if supplied
if (!empty($departmentId) && $departmentId !== $current['department_id']) {
    $deptCheck = $pdo->prepare('SELECT department_id, name FROM departments WHERE department_id = :id AND is_active = 1 LIMIT 1');
    $deptCheck->execute(['id' => $departmentId]);
    $deptRow = $deptCheck->fetch();
    if (!$deptRow) {
        jsonError('Specified department is invalid or inactive.', 422);
    }
}

// Check if any change is being made
$statusChanged = ($newStatus !== $previousStatus);
$deptChanged   = ((int)$departmentId !== (int)$current['department_id']);
$remarksAdded  = (!empty($remarks) && $remarks !== $current['admin_remarks']);
$prioChanged   = ($priority !== $current['priority']);

if (!$statusChanged && !$deptChanged && !$remarksAdded && !$prioChanged) {
    jsonSuccess($current, 'No changes were detected.');
}

try {
    $pdo->beginTransaction();

    // 1. Update complaints table
    $updateStmt = $pdo->prepare('
        UPDATE complaints 
        SET status = :status,
            department_id = :dept_id,
            priority = :priority,
            admin_remarks = COALESCE(:remarks, admin_remarks),
            updated_at = CURRENT_TIMESTAMP
        WHERE complaint_id = :id
    ');

    $updateStmt->execute([
        'status'   => $newStatus,
        'dept_id'  => $departmentId,
        'priority' => $priority,
        'remarks'  => $remarks,
        'id'       => $complaintId
    ]);

    // 2. Formulate audit log remarks
    $logRemarks = $remarks;
    if (empty($logRemarks)) {
        if ($statusChanged && $deptChanged) {
            $logRemarks = "Status changed from {$previousStatus} to {$newStatus} and assigned to department ID {$departmentId}.";
        } elseif ($statusChanged) {
            $logRemarks = "Status updated from {$previousStatus} to {$newStatus} by Administrator.";
        } elseif ($deptChanged) {
            $logRemarks = "Assigned to department ID {$departmentId} by Administrator.";
        } else {
            $logRemarks = "Complaint updated by Administrator.";
        }
    }

    // 3. Insert audit log into complaint_updates
    $historyStmt = $pdo->prepare('
        INSERT INTO complaint_updates (
            complaint_id, user_id, previous_status, new_status, remarks
        ) VALUES (
            :complaint_id, :user_id, :prev_status, :new_status, :remarks
        )
    ');

    $historyStmt->execute([
        'complaint_id' => $complaintId,
        'user_id'      => $admin['user_id'],
        'prev_status'  => $previousStatus,
        'new_status'   => $newStatus,
        'remarks'      => $logRemarks
    ]);

    $pdo->commit();

    // Fetch updated complaint
    $fresh = $pdo->prepare('
        SELECT c.*, d.name AS department_name 
        FROM complaints c 
        LEFT JOIN departments d ON c.department_id = d.department_id 
        WHERE c.complaint_id = :id
    ');
    $fresh->execute(['id' => $complaintId]);

    jsonSuccess($fresh->fetch(), 'Complaint successfully updated by Administrator.');

} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('Admin update complaint error: ' . $e->getMessage());
    jsonError('Failed to update complaint due to server error.', 500);
}
