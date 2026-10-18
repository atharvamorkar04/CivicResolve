import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import PortalNavbar from '../../components/common/PortalNavbar'
import StatusBadge from '../../components/common/StatusBadge'
import EmptyState from '../../components/common/EmptyState'
import LocationViewMap from '../../components/common/LocationViewMap'
import { api, type Complaint } from '../../api/client'

function ComplaintsDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [complaint, setComplaint] = useState<Complaint | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [forbidden, setForbidden] = useState(false)

  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const loadDetails = async () => {
      setIsLoading(true)
      setErrorMessage(null)
      setForbidden(false)
      try {
        const data = await api.complaints.getDetails(id)
        setComplaint(data)
        if (data.citizen_rating) {
          setRating(data.citizen_rating)
        }
        if (data.citizen_feedback) {
          setFeedback(data.citizen_feedback)
          setFeedbackNotice('Your citizen satisfaction rating is recorded in the database.')
        }
      } catch (err: any) {
        if (err.status === 403) {
          setForbidden(true)
        } else {
          setErrorMessage(err.message || 'Unable to retrieve complaint record from database.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadDetails()
  }, [id])

  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false)

  const handleFeedbackSubmit = async () => {
    if (rating === 0) {
      setFeedbackNotice('Please select a star rating between 1 and 5.')
      return
    }

    if (!complaint) return

    setIsSubmittingFeedback(true)
    setFeedbackNotice(null)
    try {
      await api.complaints.submitFeedback({
        complaint_id: complaint.complaint_id,
        rating,
        feedback: feedback.trim(),
      })
      setFeedbackNotice('Thank you! Your citizen satisfaction rating has been saved to the database.')
      const refreshed = await api.complaints.getDetails(complaint.complaint_id)
      setComplaint(refreshed)
    } catch (err: any) {
      setFeedbackNotice(err.message || 'Failed to submit feedback to the database.')
    } finally {
      setIsSubmittingFeedback(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <PortalNavbar role="citizen" />

      <main className="flex-1 mx-auto max-w-6xl w-full px-4 sm:px-6 py-8 animate-fade-in">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <button
            type="button"
            onClick={() => navigate('/my-complaints')}
            className="hover:text-blue-700 transition"
          >
            My Complaints
          </button>
          <span>/</span>
          <span className="font-semibold text-slate-800">
            Complaint #{id || 'Record'}
          </span>
        </div>

        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent mb-3" />
            <p className="text-xs font-semibold">Retrieving verified ticket from database...</p>
          </div>
        ) : forbidden ? (
          <div className="rounded-2xl border border-rose-200 bg-white p-8 sm:p-12 shadow-sm">
            <EmptyState
              icon="🔒"
              title="Access Restricted"
              description="Server-side security verification failed: You do not have permission to access another citizen's complaint."
              actionLabel="Return to My Complaints"
              onAction={() => navigate('/my-complaints')}
            />
          </div>
        ) : errorMessage || !complaint ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm">
            <EmptyState
              icon="🔍"
              title={`Complaint #${id || ''} Not Found`}
              description={errorMessage || 'This ticket record does not exist in the municipal database.'}
              actionLabel="Return to Complaints"
              onAction={() => navigate('/my-complaints')}
              secondaryActionLabel="Submit a New Issue"
              onSecondaryAction={() => navigate('/report-issue')}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-sm font-bold text-blue-700">
                    #{complaint.complaint_id}
                  </span>
                  <StatusBadge status={complaint.status} />
                  {complaint.priority === 'Urgent' && (
                    <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">
                      ⚠️ URGENT
                    </span>
                  )}
                  <span className="text-xs text-slate-400">
                    Submitted on {new Date(complaint.created_at).toLocaleString()}
                  </span>
                </div>
                <h1 className="mt-2 text-xl sm:text-2xl font-extrabold text-slate-900">
                  {complaint.title}
                </h1>
              </div>

              <button
                type="button"
                onClick={() => navigate('/my-complaints')}
                className="self-start sm:self-auto rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                ← Back to List
              </button>
            </div>

            {/* Two Column Layout */}
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Left Column: Details & Evidence */}
              <div className="lg:col-span-7 space-y-6">
                {/* Description Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                    Complaint Overview
                  </h2>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {complaint.description}
                  </p>

                  <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400">Category</span>
                      <p className="font-bold text-slate-800 mt-0.5">{complaint.category_name || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Subcategory</span>
                      <p className="font-bold text-slate-800 mt-0.5">{complaint.subcategory_name || 'General'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Reported Address</span>
                      <p className="font-bold text-slate-800 mt-0.5">{complaint.address || 'Manual location not specified'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Assigned Department</span>
                      <p className="font-bold text-blue-700 mt-0.5">{complaint.department_name || 'Pending Allocation'}</p>
                    </div>
                    {complaint.latitude && complaint.longitude && (
                      <div className="sm:col-span-2">
                        <span className="text-slate-400">GPS Coordinates</span>
                        <p className="font-mono text-xs font-semibold text-slate-800 mt-0.5">
                          Latitude: {complaint.latitude}°, Longitude: {complaint.longitude}°
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location Map Card */}
                {complaint.latitude && complaint.longitude && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center justify-between">
                      <span>Geographic Defect Location</span>
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

                {/* Evidence & Remarks Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                    Administrative Directives & Evidence
                  </h2>

                  {complaint.admin_remarks ? (
                    <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-xs sm:text-sm text-slate-700 leading-relaxed mb-4">
                      <strong className="block text-blue-900 font-semibold mb-1">Official Directive:</strong>
                      {complaint.admin_remarks}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic mb-4">
                      No administrative remarks logged yet. Updates will appear once the ticket is reviewed by municipal staff.
                    </p>
                  )}

                  {/* Before / After Photo Comparison */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                      Visual Evidence Comparison
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Before: Initial Defect */}
                      <div className="space-y-1.5">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                          <span className="h-2 w-2 rounded-full bg-rose-500" />
                          Before (Reported Defect)
                        </span>
                        {complaint.image_path ? (
                          <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                            <img
                              src={`/${complaint.image_path}`}
                              alt="Before repair defect"
                              className="w-full h-44 object-cover bg-slate-900/5 hover:scale-105 transition duration-300"
                            />
                          </div>
                        ) : (
                          <div className="h-44 rounded-xl border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-xs text-slate-400">
                            No initial photo attached
                          </div>
                        )}
                      </div>

                      {/* After: Completed Resolution */}
                      <div className="space-y-1.5">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                          <span className={`h-2 w-2 rounded-full ${complaint.status === 'Resolved' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          After (Resolution Evidence)
                        </span>
                        {complaint.resolution_image_path ? (
                          <div className="rounded-xl border border-emerald-200 overflow-hidden bg-emerald-50/30">
                            <img
                              src={`/${complaint.resolution_image_path}`}
                              alt="After repair verification"
                              className="w-full h-44 object-cover bg-slate-900/5 hover:scale-105 transition duration-300"
                            />
                          </div>
                        ) : complaint.status === 'Resolved' ? (
                          <div className="h-44 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/40 flex flex-col items-center justify-center text-xs text-emerald-700 p-4 text-center">
                            <span className="text-2xl mb-1">✅</span>
                            <span className="font-semibold">Repair Completed</span>
                            <span className="text-[10px] text-emerald-600 mt-0.5">Field crew resolved ticket with inspection remarks</span>
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
                </div>
              </div>

              {/* Right Column: Timeline & Citizen Rating */}
              <div className="lg:col-span-5 space-y-6">
                {/* Real Milestone Timeline from complaint_updates */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                    Audit Status Timeline
                  </h2>

                  {complaint.history && complaint.history.length > 0 ? (
                    <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                      {complaint.history.map((step) => (
                        <div key={step.update_id} className="relative flex items-start gap-3">
                          <div className="absolute -left-6 mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-700 ring-4 ring-white" />
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">
                                {step.new_status}
                              </span>
                              {step.actor_role && (
                                <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-semibold text-slate-600 uppercase">
                                  {step.actor_role}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 font-mono">
                              {new Date(step.created_at).toLocaleString()}
                            </p>
                            {step.remarks && (
                              <p className="mt-1 text-xs text-slate-600 bg-slate-50 rounded-lg p-2 border border-slate-100">
                                {step.remarks}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No transition milestones recorded.</p>
                  )}
                </div>

                {/* Rating & Feedback Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Citizen Satisfaction Feedback
                  </h2>
                  <p className="text-xs text-slate-500 mb-4">
                    Rate the resolution speed and responsiveness of municipal personnel.
                  </p>

                  <div className="flex items-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`text-2xl transition ${
                          star <= rating ? 'text-amber-400 scale-110' : 'text-slate-300 hover:text-amber-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="text-xs font-semibold text-slate-600 ml-2">
                      {rating > 0 ? `${rating} / 5 Stars` : 'Tap to rate'}
                    </span>
                  </div>

                  <textarea
                    rows={3}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Enter your feedback on the work quality..."
                    className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 resize-none mb-3"
                  />

                  {feedbackNotice && (
                    <div className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 p-2.5 text-xs text-emerald-800">
                      {feedbackNotice}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleFeedbackSubmit}
                    disabled={isSubmittingFeedback}
                    className="w-full rounded-xl bg-blue-700 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-800 transition active:scale-[0.99] disabled:opacity-50"
                  >
                    {isSubmittingFeedback
                      ? 'Saving to Database...'
                      : complaint?.citizen_rating
                      ? 'Update Satisfaction Feedback'
                      : 'Submit Feedback'}
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

export default ComplaintsDetails