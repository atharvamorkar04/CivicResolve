import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PortalNavbar from '../../components/common/PortalNavbar'
import StatusBadge from '../../components/common/StatusBadge'
import EmptyState from '../../components/common/EmptyState'
import ConfirmModal from '../../components/common/ConfirmModal'

interface AdminComplaintData {
  id?: string
  title: string
  category: string
  citizen: string
  email: string
  contact: string
  date: string
  department: string
  status: 'Submitted' | 'Assigned' | 'In Progress' | 'Resolved' | 'Rejected'
  description: string
  location: string
  priority?: string
  photoUrl?: string
}

const DEPARTMENTS = [
  'Road & Infrastructure',
  'Water Supply',
  'Electrical & Street Lighting',
  'Sanitation & Solid Waste',
  'Drainage & Sewage',
  'Parks & Public Gardens',
  'Public Safety & Health',
]

function AdminComplaintDetails() {
  const navigate = useNavigate()
  const { id } = useParams()

  // Empty state pending PHP/MySQL database connection.
  const [complaint] = useState<AdminComplaintData | null>(null)

  const [selectedDept, setSelectedDept] = useState('Road & Infrastructure')
  const [selectedStatus, setSelectedStatus] = useState<
    'Submitted' | 'Assigned' | 'In Progress' | 'Resolved' | 'Rejected'
  >('Assigned')
  const [adminRemark, setAdminRemark] = useState('')
  const [notice, setNotice] = useState<string | null>(null)

  // Confirmation modal state for consequential action (rejection)
  const [showRejectModal, setShowRejectModal] = useState(false)

  const handleSaveTriage = () => {
    setNotice(
      `Triage changes recorded in interface evaluation mode! Reassigned to ${selectedDept} with status "${selectedStatus}". PHP & MySQL synchronization scheduled for Phase 4.`
    )
  }

  const handleConfirmReject = () => {
    setShowRejectModal(false)
    setSelectedStatus('Rejected')
    setNotice(
      'Complaint marked as Rejected/Invalid. Consequential action logged; database persistence scheduled for Phase 4.'
    )
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

        {!complaint ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm">
            <EmptyState
              icon="🔍"
              title={`Complaint Record #${id || ''} Awaiting Database`}
              description="This complaint record is pending database synchronization. In Phase 4, the PHP REST API will retrieve the complete report from the MySQL database along with citizen details and photo evidence."
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
                    #{id}
                  </span>
                  <StatusBadge status={complaint.status} />
                  <span className="text-xs text-slate-400">
                    Received on {complaint.date}
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
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {complaint.description}
                  </p>

                  <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400">Category</span>
                      <p className="font-bold text-slate-800 mt-0.5">{complaint.category}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Location</span>
                      <p className="font-bold text-slate-800 mt-0.5">{complaint.location}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Reporting Citizen</span>
                      <p className="font-bold text-slate-800 mt-0.5">{complaint.citizen}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Contact Email</span>
                      <p className="font-bold text-slate-800 mt-0.5">{complaint.email}</p>
                    </div>
                  </div>
                </div>

                {/* Evidence Photo */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                    Visual Evidence Attached
                  </h2>
                  <div className="h-44 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-xs text-slate-400">
                    {complaint.photoUrl ? 'Attached Photo Evidence' : 'No Photo Uploaded by Citizen'}
                  </div>
                </div>
              </div>

              {/* Right Column: Triage & Allocation Panel */}
              <div className="lg:col-span-5 space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Administrative Action Panel
                  </h2>

                  {/* Department Assignment */}
                  <div>
                    <label htmlFor="dept-alloc" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Assign to Municipal Department
                    </label>
                    <select
                      id="dept-alloc"
                      value={selectedDept}
                      onChange={(e) => setSelectedDept(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                    >
                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status update */}
                  <div>
                    <label htmlFor="status-alloc" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Verification Status
                    </label>
                    <select
                      id="status-alloc"
                      value={selectedStatus}
                      onChange={(e) =>
                        setSelectedStatus(
                          e.target.value as
                            | 'Submitted'
                            | 'Assigned'
                            | 'In Progress'
                            | 'Resolved'
                            | 'Rejected'
                        )
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                    >
                      <option value="Submitted">Submitted (Under Review)</option>
                      <option value="Assigned">Assigned to Department</option>
                      <option value="In Progress">In Progress (Field Work)</option>
                      <option value="Resolved">Resolved (Completed)</option>
                      <option value="Rejected">Rejected (Out of Scope / Duplicate)</option>
                    </select>
                  </div>

                  {/* Admin remark */}
                  <div>
                    <label htmlFor="admin-remarks" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Internal Triage Remarks
                    </label>
                    <textarea
                      id="admin-remarks"
                      rows={3}
                      value={adminRemark}
                      onChange={(e) => setAdminRemark(e.target.value)}
                      placeholder="Add directives for the department supervisor..."
                      className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-800 outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100 resize-none"
                    />
                  </div>

                  {/* Save button */}
                  <button
                    type="button"
                    onClick={handleSaveTriage}
                    className="w-full rounded-xl bg-purple-700 py-3 text-xs font-bold text-white shadow-sm hover:bg-purple-800 transition active:scale-[0.99]"
                  >
                    Save & Route to Department
                  </button>

                  {/* Consequential action: Reject */}
                  <div className="pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowRejectModal(true)}
                      className="w-full rounded-xl border border-rose-200 bg-rose-50 py-2.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition"
                    >
                      ⚠️ Invalidate / Reject Complaint
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Confirmation Modal for Consequential Action */}
      <ConfirmModal
        isOpen={showRejectModal}
        title="Confirm Complaint Invalidation"
        message="Are you sure you want to mark this complaint as Rejected? This action will close the ticket, notify the reporting citizen with your remarks, and remove it from active department queues."
        confirmText="Confirm Rejection"
        cancelText="Keep Ticket Active"
        isDestructive={true}
        onConfirm={handleConfirmReject}
        onCancel={() => setShowRejectModal(false)}
      />
    </div>
  )
}

export default AdminComplaintDetails