import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PortalNavbar from '../../components/common/PortalNavbar'
import StatusBadge from '../../components/common/StatusBadge'
import EmptyState from '../../components/common/EmptyState'
import ConfirmModal from '../../components/common/ConfirmModal'
import LocationViewMap from '../../components/common/LocationViewMap'
import { api, type Complaint, type Department } from '../../api/client'

function AdminComplaintDetails() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [complaint, setComplaint] = useState<Complaint | null>(null)
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const [selectedDeptId, setSelectedDeptId] = useState<number | ''>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('Approved')
  const [selectedPriority, setSelectedPriority] = useState<'Standard' | 'Urgent'>('Standard')
  const [adminRemark, setAdminRemark] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [showRejectModal, setShowRejectModal] = useState(false)

  const loadData = async () => {
    if (!id) return
    setIsLoading(true)
    setFetchError(null)
    try {
      const [comp, depts] = await Promise.all([
        api.complaints.getDetails(id),
        api.departments.get(),
      ])
      setComplaint(comp)
      setDepartments(depts)
      setSelectedDeptId(comp.department_id || (depts[0]?.department_id || ''))
      setSelectedStatus(comp.status)
      setSelectedPriority(comp.priority)
      setAdminRemark(comp.admin_remarks || '')
    } catch (err: any) {
      setFetchError(err.message || 'Failed to retrieve complaint from database.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [id])

  const handleSaveTriage = async (overrideStatus?: string) => {
    if (!complaint) return
    setIsSaving(true)
    setNotice(null)

    const statusToSave = overrideStatus || selectedStatus

    try {
      const updated = await api.admin.updateComplaint({
        complaint_id: complaint.complaint_id,
        status: statusToSave,
        department_id: selectedDeptId !== '' ? Number(selectedDeptId) : undefined,
        priority: selectedPriority,
        admin_remarks: adminRemark.trim() || undefined,
      })

      setComplaint(updated)
      setSelectedStatus(updated.status)
      setNotice(`Complaint #${complaint.complaint_id} updated successfully. Status set to "${statusToSave}".`)
      await loadData() // Refresh full history
    } catch (err: any) {
      setNotice(`Error: ${err.message || 'Failed to update complaint.'}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleConfirmReject = async () => {
    setShowRejectModal(false)
    await handleSaveTriage('Rejected')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <PortalNavbar role="admin" userName="Municipal Administrator" userSubtitle="Triage Officer" />

      <main className="flex-1 mx-auto max-w-6xl w-full px-4 sm:px-6 py-8 animate-fade-in">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <button
            type="button"
            onClick={() => navigate('/admin/complaints')}
            className="hover:text-purple-700 transition"
          >
            Complaints Queue
          </button>
          <span>/</span>
          <span className="font-semibold text-slate-800">
            Review Record #{id || 'Record'}
          </span>
        </div>

        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-600 border-t-transparent mb-3" />
            <p className="text-xs font-semibold">Retrieving complaint dossier from MySQL...</p>
          </div>
        ) : fetchError || !complaint ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm">
            <EmptyState
              icon="🔍"
              title={`Complaint Record #${id || ''} Not Found`}
              description={fetchError || 'This complaint record does not exist in the municipal database.'}
              actionLabel="Return to Complaints Queue"
              onAction={() => navigate('/admin/complaints')}
              secondaryActionLabel="Open Admin Dashboard"
              onSecondaryAction={() => navigate('/admin/dashboard')}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-sm font-bold text-purple-700">
                    #{complaint.complaint_id}
                  </span>
                  <StatusBadge status={complaint.status} />
                  {complaint.priority === 'Urgent' && (
                    <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">
                      ⚠️ URGENT PRIORITY
                    </span>
                  )}
                  <span className="text-xs text-slate-400">
                    Received on {new Date(complaint.created_at).toLocaleString()}
                  </span>
                </div>
                <h1 className="mt-2 text-xl sm:text-2xl font-extrabold text-slate-900">
                  {complaint.title}
                </h1>
              </div>

              <button
                type="button"
                onClick={() => navigate('/admin/complaints')}
                className="self-start sm:self-auto rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                ← Back to Queue
              </button>
            </div>

            {notice && (
              <div className="rounded-2xl border border-purple-200 bg-purple-50 p-4 text-xs sm:text-sm text-purple-900 animate-fade-in">
                <strong>Administrative Update:</strong> {notice}
              </div>
            )}

            {/* Content Grid */}
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Left Column: Complaint & Citizen Details */}
              <div className="lg:col-span-7 space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                    Incident Description
                  </h2>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {complaint.description}
                  </p>

                  <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400">Category</span>
                      <p className="font-bold text-slate-800 mt-0.5">{complaint.category_name}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Subcategory</span>
                      <p className="font-bold text-slate-800 mt-0.5">{complaint.subcategory_name || 'General'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Location Address</span>
                      <p className="font-bold text-slate-800 mt-0.5">{complaint.address || 'Address unlisted'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Reporting Citizen</span>
                      <p className="font-bold text-slate-800 mt-0.5">{complaint.citizen_name || 'Resident'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Contact Email</span>
                      <p className="font-bold text-slate-800 mt-0.5">{complaint.citizen_email || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Contact Phone</span>
                      <p className="font-bold text-slate-800 mt-0.5">{complaint.citizen_phone || 'N/A'}</p>
                    </div>
                    {complaint.latitude && complaint.longitude && (
                      <div className="sm:col-span-2">
                        <span className="text-slate-400">GPS Coordinates</span>
                        <p className="font-mono text-xs font-semibold text-slate-800 mt-0.5">
                          {complaint.latitude}°, {complaint.longitude}°
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location Map Card */}
                {complaint.latitude && complaint.longitude && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center justify-between">
                      <span>Defect Geographic Location</span>
                      <span className="text-[11px] font-mono text-slate-500 font-normal">
                        {complaint.latitude}°, {complaint.longitude}°
                      </span>
                    </h2>
                    <LocationViewMap
                      latitude={complaint.latitude}
                      longitude={complaint.longitude}
                      address={complaint.address}
                      title={complaint.title}
                      pinColor="#dc2626"
                    />
                  </div>
                )}

                {/* Evidence Comparison Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                    Visual Evidence Comparison
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Before Image */}
                    <div className="space-y-1.5">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                        <span className="h-2 w-2 rounded-full bg-rose-500" />
                        Before (Reported Defect)
                      </span>
                      {complaint.image_path ? (
                        <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                          <img
                            src={`/${complaint.image_path}`}
                            alt="Citizen submitted defect"
                            className="w-full h-44 object-cover bg-slate-900/5 hover:scale-105 transition duration-300"
                          />
                        </div>
                      ) : (
                        <div className="h-44 rounded-xl border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-xs text-slate-400">
                          No initial photo attached
                        </div>
                      )}
                    </div>

                    {/* After Image */}
                    <div className="space-y-1.5">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                        <span className={`h-2 w-2 rounded-full ${complaint.status === 'Resolved' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        After (Resolution Evidence)
                      </span>
                      {complaint.resolution_image_path ? (
                        <div className="rounded-xl border border-emerald-200 overflow-hidden bg-emerald-50/30">
                          <img
                            src={`/${complaint.resolution_image_path}`}
                            alt="After repair resolution verification"
                            className="w-full h-44 object-cover bg-slate-900/5 hover:scale-105 transition duration-300"
                          />
                        </div>
                      ) : complaint.status === 'Resolved' ? (
                        <div className="h-44 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/40 flex flex-col items-center justify-center text-xs text-emerald-700 p-4 text-center">
                          <span className="text-2xl mb-1">✅</span>
                          <span className="font-semibold">Work Marked as Resolved</span>
                          <span className="text-[10px] text-emerald-600 mt-0.5">Field officer closed ticket with inspection remarks</span>
                        </div>
                      ) : (
                        <div className="h-44 rounded-xl border border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-xs text-slate-400 p-4 text-center">
                          <span>⏳ Resolution photo pending</span>
                          <span className="text-[10px] text-slate-400 mt-1">Uploaded by field crew once repair is completed</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Citizen Satisfaction Feedback */}
                {complaint.citizen_rating && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-6 shadow-sm">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Citizen Satisfaction Feedback</span>
                      <span className="text-amber-500 text-sm font-bold tracking-widest">
                        {'★'.repeat(complaint.citizen_rating)}{'☆'.repeat(5 - complaint.citizen_rating)}
                      </span>
                    </h2>
                    <p className="text-xs font-semibold text-amber-900 mb-2">
                      {complaint.citizen_rating} / 5 Stars Rating
                    </p>
                    {complaint.citizen_feedback && (
                      <p className="text-xs text-slate-700 italic bg-white/80 p-3 rounded-xl border border-amber-200/50">
                        "{complaint.citizen_feedback}"
                      </p>
                    )}
                  </div>
                )}

                {/* Audit Timeline */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                    Audit Transition Trail
                  </h2>
                  {complaint.history && complaint.history.length > 0 ? (
                    <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                      {complaint.history.map((h) => (
                        <div key={h.update_id} className="relative flex items-start gap-3">
                          <div className="absolute -left-6 mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-700 ring-4 ring-white" />
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">{h.new_status}</span>
                              <span className="text-[10px] bg-slate-100 rounded px-1.5 py-0.5 text-slate-600 uppercase font-semibold">
                                {h.actor_role} ({h.actor_name})
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400">{new Date(h.created_at).toLocaleString()}</p>
                            {h.remarks && (
                              <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 mt-1">
                                {h.remarks}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No historical updates recorded.</p>
                  )}
                </div>
              </div>

              {/* Right Column: Triage & Allocation Panel */}
              <div className="lg:col-span-5 space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Administrative Action Panel
                    </h2>
                    {(complaint.status === 'Resolved' || complaint.status === 'Rejected') && (
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 border border-slate-200">
                        🔒 LOCKED
                      </span>
                    )}
                  </div>

                  {/* Lock Notice if Resolved or Rejected */}
                  {(complaint.status === 'Resolved' || complaint.status === 'Rejected') && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800 flex items-start gap-2.5">
                      <span className="text-base">🔒</span>
                      <div>
                        <p className="font-bold">Complaint is {complaint.status}</p>
                        <p className="text-[11px] text-emerald-700 mt-0.5">
                          This complaint has reached its final state and is permanently closed. Administrative triage modifications are locked.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Department Assignment */}
                  <div>
                    <label htmlFor="dept-alloc" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Assign to Municipal Department
                    </label>
                    <select
                      id="dept-alloc"
                      disabled={complaint.status === 'Resolved' || complaint.status === 'Rejected' || isSaving}
                      value={selectedDeptId}
                      onChange={(e) => setSelectedDeptId(e.target.value ? Number(e.target.value) : '')}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100 disabled:bg-slate-100 disabled:text-slate-500"
                    >
                      <option value="">-- Choose Municipal Department --</option>
                      {departments.map((d) => (
                        <option key={d.department_id} value={d.department_id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status update */}
                  <div>
                    <label htmlFor="status-alloc" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Operational Status
                    </label>
                    <select
                      id="status-alloc"
                      disabled={complaint.status === 'Resolved' || complaint.status === 'Rejected' || isSaving}
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100 disabled:bg-slate-100 disabled:text-slate-500"
                    >
                      <option value="Pending">Pending (Under Review)</option>
                      <option value="Approved">Approved (Routed to Dept)</option>
                      <option value="In Progress">In Progress (Field Deployment)</option>
                      <option value="Resolved">Resolved (Completed)</option>
                      <option value="Rejected">Rejected (Out of Scope / Duplicate)</option>
                    </select>
                  </div>

                  {/* Priority Setting */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Urgency Level
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        disabled={complaint.status === 'Resolved' || complaint.status === 'Rejected' || isSaving}
                        onClick={() => setSelectedPriority('Standard')}
                        className={`py-2 px-3 text-xs font-semibold rounded-lg border transition disabled:opacity-50 ${
                          selectedPriority === 'Standard'
                            ? 'bg-purple-50 border-purple-600 text-purple-700 ring-1 ring-purple-600'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        Standard
                      </button>
                      <button
                        type="button"
                        disabled={complaint.status === 'Resolved' || complaint.status === 'Rejected' || isSaving}
                        onClick={() => setSelectedPriority('Urgent')}
                        className={`py-2 px-3 text-xs font-semibold rounded-lg border transition disabled:opacity-50 ${
                          selectedPriority === 'Urgent'
                            ? 'bg-rose-50 border-rose-600 text-rose-700 ring-1 ring-rose-600'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        ⚠️ Urgent
                      </button>
                    </div>
                  </div>

                  {/* Admin remark */}
                  <div>
                    <label htmlFor="admin-remarks" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Administrative Directives / Notes
                    </label>
                    <textarea
                      id="admin-remarks"
                      rows={3}
                      disabled={complaint.status === 'Resolved' || complaint.status === 'Rejected' || isSaving}
                      value={adminRemark}
                      onChange={(e) => setAdminRemark(e.target.value)}
                      placeholder="Add directives for the department supervisor..."
                      className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-800 outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100 resize-none disabled:bg-slate-100 disabled:text-slate-500"
                    />
                  </div>

                  {/* Save button */}
                  <button
                    type="button"
                    disabled={complaint.status === 'Resolved' || complaint.status === 'Rejected' || isSaving}
                    onClick={() => handleSaveTriage()}
                    className="w-full rounded-xl bg-purple-700 py-3 text-xs font-bold text-white shadow-sm hover:bg-purple-800 transition active:scale-[0.99] disabled:opacity-40"
                  >
                    {isSaving
                      ? 'Saving Changes to Database...'
                      : complaint.status === 'Resolved' || complaint.status === 'Rejected'
                      ? 'Action Locked (Case Closed)'
                      : 'Save & Route Complaint'}
                  </button>

                  {/* Reject action */}
                  {complaint.status !== 'Resolved' && complaint.status !== 'Rejected' && (
                    <div className="pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => setShowRejectModal(true)}
                        className="w-full rounded-xl border border-rose-200 bg-rose-50 py-2.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition disabled:opacity-50"
                      >
                        ⚠️ Invalidate / Reject Complaint
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Confirmation Modal for Invalidation */}
      <ConfirmModal
        isOpen={showRejectModal}
        title="Confirm Complaint Invalidation"
        message="Are you sure you want to mark this complaint as Rejected? This action will set the status to Rejected in the database and record your remarks in the audit trail."
        confirmText="Confirm Rejection"
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={handleConfirmReject}
        onCancel={() => setShowRejectModal(false)}
      />
    </div>
  )
}

export default AdminComplaintDetails