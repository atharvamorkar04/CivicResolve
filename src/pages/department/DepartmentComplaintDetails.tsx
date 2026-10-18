import { useState, useEffect } from 'react'
import type { ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PortalNavbar from '../../components/common/PortalNavbar'
import StatusBadge from '../../components/common/StatusBadge'
import EmptyState from '../../components/common/EmptyState'
import LocationViewMap from '../../components/common/LocationViewMap'
import { useAuth } from '../../context/AuthContext'
import { api, type Complaint } from '../../api/client'

function DepartmentComplaintDetails() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAuth()

  const [complaint, setComplaint] = useState<Complaint | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [forbidden, setForbidden] = useState(false)

  const [newStatus, setNewStatus] = useState<'In Progress' | 'Resolved'>('In Progress')
  const [remarks, setRemarks] = useState('')
  const [resolutionPhoto, setResolutionPhoto] = useState<File | null>(null)
  const [resolutionPreview, setResolutionPreview] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const handlePhotoSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setActionError('Photo size exceeds 5MB limit.')
      return
    }

    setResolutionPhoto(file)
    const reader = new FileReader()
    reader.onload = () => {
      setResolutionPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
    setActionError(null)
  }

  const loadData = async () => {
    if (!id) return
    setIsLoading(true)
    setFetchError(null)
    setForbidden(false)

    try {
      const data = await api.complaints.getDetails(id)
      setComplaint(data)
      setNewStatus(data.status === 'Resolved' ? 'Resolved' : 'In Progress')
    } catch (err: any) {
      if (err.status === 403) {
        setForbidden(true)
      } else {
        setFetchError(err.message || 'Unable to retrieve work order record.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [id])

  const handleUpdate = async () => {
    if (!complaint) return
    setActionError(null)
    setNotice(null)

    if (!remarks.trim() || remarks.trim().length < 5) {
      setActionError('Please provide official field remarks describing actions taken (at least 5 characters).')
      return
    }

    setIsUpdating(true)

    try {
      if (resolutionPhoto) {
        const formData = new FormData()
        formData.append('complaint_id', String(complaint.complaint_id))
        formData.append('status', newStatus)
        formData.append('remarks', remarks.trim())
        formData.append('resolution_image', resolutionPhoto)
        await api.department.updateStatus(formData)
      } else {
        await api.department.updateStatus({
          complaint_id: complaint.complaint_id,
          status: newStatus,
          remarks: remarks.trim(),
        })
      }

      setNotice(`Work order status updated to "${newStatus}" and logged into audit history.`)
      setRemarks('')
      setResolutionPhoto(null)
      setResolutionPreview(null)
      await loadData() // Refresh status and timeline
    } catch (err: any) {
      setActionError(err.message || 'Failed to update work order.')
    } finally {
      setIsUpdating(false)
    }
  }

  const DEPARTMENT_NAMES: Record<number, string> = {
    1: 'Road & Infrastructure',
    2: 'Water Supply & Quality',
    3: 'Electrical & Street Lighting',
    4: 'Solid Waste & Sanitation',
    5: 'Drainage & Sewage',
    6: 'Parks & Public Gardens',
    7: 'Public Safety & Hazards',
  }

  const deptName =
    user?.department_name ||
    (user?.department_id ? DEPARTMENT_NAMES[user.department_id] : null) ||
    'Department Officer'

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

        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent mb-3" />
            <p className="text-xs font-semibold">Retrieving work order details from MySQL...</p>
          </div>
        ) : forbidden ? (
          <div className="rounded-2xl border border-rose-200 bg-white p-8 sm:p-12 shadow-sm">
            <EmptyState
              icon="🔒"
              title="Work Order Not Assigned to Your Department"
              description="Access restricted: This complaint has been routed to a different municipal department."
              actionLabel="Return to My Department Queue"
              onAction={() => navigate('/department/dashboard')}
            />
          </div>
        ) : fetchError || !complaint ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm">
            <EmptyState
              icon="🛠️"
              title={`Work Order #${id || ''} Not Found`}
              description={fetchError || 'This work order does not exist in the municipal database.'}
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
                    #{complaint.complaint_id}
                  </span>
                  <StatusBadge status={complaint.status} />
                  {complaint.priority === 'Urgent' && (
                    <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">
                      ⚠️ URGENT
                    </span>
                  )}
                  <span className="text-xs text-slate-400">
                    Assigned on {new Date(complaint.created_at).toLocaleString()}
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

            {actionError && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs sm:text-sm text-rose-700 animate-fade-in">
                <strong>Attention:</strong> {actionError}
              </div>
            )}

            {/* Main Content Layout */}
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Left Column: Complaint Details & Citizen Evidence */}
              <div className="lg:col-span-7 space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                    Defect Information
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
                      <span className="text-slate-400">Site Location</span>
                      <p className="font-bold text-slate-800 mt-0.5">{complaint.address || 'Address on record'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Reporting Citizen</span>
                      <p className="font-bold text-slate-800 mt-0.5">{complaint.citizen_name || 'Resident'}</p>
                    </div>
                    {complaint.latitude && complaint.longitude && (
                      <div className="sm:col-span-2">
                        <span className="text-slate-400">GPS Pinpoint Coordinates</span>
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
                      <span>Defect Site Coordinates</span>
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
                            alt="Citizen submitted site photo"
                            className="w-full h-44 object-cover bg-slate-900/5 hover:scale-105 transition duration-300"
                          />
                        </div>
                      ) : (
                        <div className="h-44 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-xs text-slate-400">
                          No initial photo uploaded
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
                          <span className="text-[10px] text-emerald-600 mt-0.5">Repairs completed on site by field division</span>
                        </div>
                      ) : (
                        <div className="h-44 rounded-xl border border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-xs text-slate-400 p-4 text-center">
                          <span>⏳ Resolution photo pending</span>
                          <span className="text-[10px] text-slate-400 mt-1">Upload completion photograph when selecting "Resolved"</span>
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
                    Audit Status History
                  </h2>
                  {complaint.history && complaint.history.length > 0 ? (
                    <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                      {complaint.history.map((h) => (
                        <div key={h.update_id} className="relative flex items-start gap-3">
                          <div className="absolute -left-6 mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-700 ring-4 ring-white" />
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

              {/* Right Column: Work Order Action Panel */}
              <div className="lg:col-span-5 space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Work Order Resolution Panel
                    </h2>
                    {complaint.status === 'Resolved' && (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                        ✅ RESOLVED
                      </span>
                    )}
                  </div>

                  {/* Lock Notice if Resolved */}
                  {complaint.status === 'Resolved' && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800 flex items-start gap-2.5">
                      <span className="text-base">🔒</span>
                      <div>
                        <p className="font-bold">Work Order Completed & Resolved</p>
                        <p className="text-[11px] text-emerald-700 mt-0.5">
                          This work order has been marked as Resolved. Field status updates are now finalized and closed.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Status update */}
                  <div>
                    <label htmlFor="dept-status" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Update Operational Status *
                    </label>
                    <select
                      id="dept-status"
                      disabled={complaint.status === 'Resolved' || isUpdating}
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as 'In Progress' | 'Resolved')}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100 disabled:text-slate-500"
                    >
                      <option value="In Progress">In Progress (Field Crews Dispatched)</option>
                      <option value="Resolved">Resolved (Work Completed On-Site)</option>
                    </select>
                  </div>

                  {/* Optional Resolution Photo Upload (Only when Resolved is selected) */}
                  {complaint.status !== 'Resolved' && newStatus === 'Resolved' && (
                    <div className="pt-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Resolution Evidence Photo (After Repair)
                      </label>
                      {resolutionPreview ? (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={resolutionPreview}
                              alt="Resolution preview"
                              className="h-12 w-12 rounded-lg object-cover border border-emerald-200"
                            />
                            <div className="text-left">
                              <span className="text-xs font-bold text-slate-800 block truncate max-w-[150px]">
                                {resolutionPhoto?.name}
                              </span>
                              <span className="text-[10px] text-emerald-700 font-semibold">
                                Ready for upload
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setResolutionPhoto(null)
                              setResolutionPreview(null)
                            }}
                            className="text-xs text-rose-600 hover:underline font-bold px-2 py-1"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center rounded-xl border border-dashed border-emerald-300 bg-emerald-50/40 p-4 hover:bg-emerald-50 cursor-pointer transition">
                          <span className="text-2xl mb-1">📸</span>
                          <span className="text-xs font-semibold text-emerald-800">
                            Attach site completion photograph
                          </span>
                          <span className="text-[10px] text-slate-400 mt-0.5">
                            Permitted: JPG, PNG, WebP (Max 5MB)
                          </span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handlePhotoSelect}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  )}

                  {/* Field remarks */}
                  <div>
                    <label htmlFor="field-remarks" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Field Notes & Actions Taken *
                    </label>
                    <textarea
                      id="field-remarks"
                      rows={4}
                      disabled={complaint.status === 'Resolved' || isUpdating}
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Detail inspection findings, crew deployment, or repairs completed on site..."
                      required
                      className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 resize-none disabled:bg-slate-100 disabled:text-slate-500"
                    />
                    <p className="mt-1 text-[11px] text-slate-400">
                      Logged immutably to the complaint history audit log
                    </p>
                  </div>

                  {/* Update button */}
                  <button
                    type="button"
                    disabled={complaint.status === 'Resolved' || isUpdating}
                    onClick={handleUpdate}
                    className="w-full rounded-xl bg-emerald-700 py-3 text-xs font-bold text-white shadow-sm hover:bg-emerald-800 transition active:scale-[0.99] disabled:opacity-40"
                  >
                    {isUpdating
                      ? 'Saving Update to Database...'
                      : complaint.status === 'Resolved'
                      ? 'Work Order Finalized (Closed)'
                      : 'Record Status Transition'}
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