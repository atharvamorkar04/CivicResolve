import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PortalNavbar from '../../components/common/PortalNavbar'
import StatusBadge from '../../components/common/StatusBadge'
import EmptyState from '../../components/common/EmptyState'

type ComplaintStatus =
  | 'Submitted'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Rejected'

interface DepartmentComplaint {
  id: string
  title: string
  category: string
  location: string
  description: string
  date: string
  status: ComplaintStatus
  department: string
  citizen: string
  photoUrl?: string
  resolutionRemarks?: string
  resolutionPhotoUrl?: string
}

interface DepartmentUser {
  name: string
  email?: string
}

function DepartmentComplaintDetails() {
  const navigate = useNavigate()
  const { id } = useParams()

  const storedDepartment = localStorage.getItem('departmentUser')
  let departmentUser: DepartmentUser | null = null

  if (storedDepartment) {
    try {
      departmentUser = JSON.parse(storedDepartment)
    } catch {
      localStorage.removeItem('departmentUser')
    }
  }

  // Empty state pending MySQL integration
  const [complaints] = useState<DepartmentComplaint[]>([])
  const complaint = complaints.find((item) => item.id === id) || null

  const isAuthorized =
    complaint && departmentUser && complaint.department === departmentUser.name

  const [status, setStatus] = useState<ComplaintStatus>(
    isAuthorized && complaint ? complaint.status : 'Assigned'
  )
  const [remarks, setRemarks] = useState('')
  const [resolution, setResolution] = useState('')
  const [resolutionPhoto, setResolutionPhoto] = useState<File | null>(null)
  const [resolutionPhotoPreview, setResolutionPhotoPreview] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handlePhotoSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedResolutionPhoto(file)
  }

  const setSelectedResolutionPhoto = (file: File | null) => {
    if (!file) {
      setResolutionPhoto(null)
      setResolutionPhotoPreview(null)
      return
    }

    setResolutionPhoto(file)
    const reader = new FileReader()
    reader.onload = () => {
      setResolutionPhotoPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUpdate = () => {
    setError(null)
    setNotice(null)

    if (status === 'Resolved' && !resolution.trim()) {
      setError('Please provide resolution details and work description before closing the ticket as Resolved.')
      return
    }

    setNotice(
      `Work order status updated to "${status}" in evaluation mode! Real database update and citizen notifications will be executed in Phase 4 via PHP REST API.`
    )
  }

  const deptName = departmentUser?.name || 'Department Officer'

  if (!departmentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg border border-slate-200">
          <div className="text-4xl mb-3">🔐</div>
          <h1 className="text-xl font-bold text-slate-900">Sign In Required</h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            Please sign in to access department work orders and update repair milestones.
          </p>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="mt-6 w-full rounded-xl bg-blue-700 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 transition"
          >
            Go to Department Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <PortalNavbar role="department" userName={deptName} userSubtitle="Work Order Manager" />

      <main className="flex-1 mx-auto max-w-6xl w-full px-4 sm:px-6 py-8 animate-fade-in">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <button
            type="button"
            onClick={() => navigate('/department/dashboard')}
            className="hover:text-emerald-700 transition"
          >
            Work Orders
          </button>
          <span>/</span>
          <span className="font-semibold text-slate-800">
            Order #{id || 'Record'}
          </span>
        </div>

        {!complaint ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm">
            <EmptyState
              icon="🛠️"
              title={`Work Order #${id || ''} Not Loaded`}
              description="This work order is either awaiting database synchronization or is assigned to a different department. In Phase 4, the PHP REST API will authenticate and retrieve assigned complaints directly from MySQL."
              actionLabel="Return to Work Orders Queue"
              onAction={() => navigate('/department/dashboard')}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-sm font-bold text-emerald-700">
                    #{complaint.id}
                  </span>
                  <StatusBadge status={status} />
                  <span className="text-xs text-slate-400">
                    Assigned: {complaint.date}
                  </span>
                </div>
                <h1 className="mt-2 text-xl sm:text-2xl font-extrabold text-slate-900">
                  {complaint.title}
                </h1>
              </div>

              <button
                type="button"
                onClick={() => navigate('/department/dashboard')}
                className="self-start sm:self-auto rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                ← Back to Orders
              </button>
            </div>

            {notice && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs sm:text-sm text-emerald-900 animate-fade-in">
                <strong>Department Update:</strong> {notice}
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs sm:text-sm text-rose-700 animate-fade-in">
                <strong>Attention Required:</strong> {error}
              </div>
            )}

            {/* Main Content Layout */}
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Left Column: Complaint Details & Inspection Photos */}
              <div className="lg:col-span-7 space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                    Defect Information
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
                      <span className="text-slate-400">Site Location</span>
                      <p className="font-bold text-slate-800 mt-0.5">{complaint.location}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Reporting Citizen</span>
                      <p className="font-bold text-slate-800 mt-0.5">{complaint.citizen}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Handling Department</span>
                      <p className="font-bold text-emerald-700 mt-0.5">{complaint.department}</p>
                    </div>
                  </div>
                </div>

                {/* Citizen Photo */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                    Citizen Submission Photo
                  </h2>
                  <div className="h-44 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-xs text-slate-400">
                    {complaint.photoUrl ? 'Citizen Photo Evidence Attached' : 'No Photo Uploaded with Report'}
                  </div>
                </div>
              </div>

              {/* Right Column: Work Order Action Panel */}
              <div className="lg:col-span-5 space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Work Order Resolution Panel
                  </h2>

                  {/* Status update */}
                  <div>
                    <label htmlFor="dept-status" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Update Operational Status *
                    </label>
                    <select
                      id="dept-status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value as ComplaintStatus)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    >
                      <option value="Assigned">Assigned (Received by Team)</option>
                      <option value="In Progress">In Progress (Crews on Site)</option>
                      <option value="Resolved">Resolved (Work Completed)</option>
                    </select>
                  </div>

                  {/* Field remarks */}
                  <div>
                    <label htmlFor="field-remarks" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Field Notes / Progress Remarks
                    </label>
                    <textarea
                      id="field-remarks"
                      rows={3}
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Add inspection notes or expected repair timeline..."
                      className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 resize-none"
                    />
                  </div>

                  {/* Resolution info */}
                  {status === 'Resolved' && (
                    <div className="animate-fade-in space-y-4 pt-2 border-t border-slate-100">
                      <div>
                        <label htmlFor="res-info" className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Resolution Summary * (Required)
                        </label>
                        <textarea
                          id="res-info"
                          rows={3}
                          value={resolution}
                          onChange={(e) => setResolution(e.target.value)}
                          placeholder="Detail the repair actions executed by the field team..."
                          required
                          className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 resize-none"
                        />
                      </div>

                      {/* Resolution Photo Upload */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Attach Completion Proof Photo (Optional)
                        </label>

                        {resolutionPhotoPreview ? (
                          <div className="rounded-xl border border-slate-200 p-3 bg-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={resolutionPhotoPreview}
                                alt="Resolution preview"
                                className="h-12 w-12 rounded object-cover border"
                              />
                              <p className="text-xs font-semibold text-slate-800 truncate max-w-[140px]">
                                {resolutionPhoto?.name}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setSelectedResolutionPhoto(null)}
                              className="text-xs text-rose-600 hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center cursor-pointer hover:bg-slate-100/70 transition">
                            <span className="text-lg mb-1">📷</span>
                            <span className="text-xs text-slate-600 font-medium">Upload After-Repair Proof</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoSelect}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Update button */}
                  <button
                    type="button"
                    onClick={handleUpdate}
                    className="w-full rounded-xl bg-emerald-700 py-3 text-xs font-bold text-white shadow-sm hover:bg-emerald-800 transition active:scale-[0.99]"
                  >
                    Update Work Order Status
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default DepartmentComplaintDetails