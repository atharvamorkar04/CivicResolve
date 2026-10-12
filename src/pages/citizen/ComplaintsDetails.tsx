import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import PortalNavbar from '../../components/common/PortalNavbar'
import StatusBadge from '../../components/common/StatusBadge'
import EmptyState from '../../components/common/EmptyState'

interface ComplaintData {
  id: string
  title: string
  category: string
  subcategory: string
  date: string
  department: string
  location: string
  coordinates?: string
  description: string
  status: 'Submitted' | 'Assigned' | 'In Progress' | 'Resolved' | 'Rejected'
  photoUrl?: string
  resolutionPhotoUrl?: string
  officialRemarks?: string
}

interface TimelineItem {
  title: string
  date: string
  time: string
  description: string
  completed: boolean
}

function ComplaintsDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null)

  // Empty state pending PHP/MySQL database connection.
  const [complaint] = useState<ComplaintData | null>(null)
  const [timeline] = useState<TimelineItem[]>([])

  const handleFeedbackSubmit = () => {
    if (rating === 0) {
      setFeedbackNotice('Please select a star rating between 1 and 5.')
      return
    }

    setFeedbackNotice(
      'Feedback recorded in interface evaluation mode! Real feedback persistence will connect to MySQL in Phase 4.'
    )
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

        {!complaint ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm">
            <EmptyState
              icon="🔍"
              title={`Complaint #${id || ''} Not Found`}
              description="This complaint is awaiting database synchronization or does not exist in local records. Once connected to the MySQL database in Phase 4, full status timelines and department notes will be retrieved automatically."
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
                    #{complaint.id}
                  </span>
                  <StatusBadge status={complaint.status} />
                  <span className="text-xs text-slate-400">
                    Logged on {complaint.date}
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
                ← Back
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
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {complaint.description}
                  </p>

                  <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400">Category</span>
                      <p className="font-bold text-slate-800 mt-0.5">{complaint.category}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Subcategory</span>
                      <p className="font-bold text-slate-800 mt-0.5">{complaint.subcategory}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Location</span>
                      <p className="font-bold text-slate-800 mt-0.5">{complaint.location}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Department</span>
                      <p className="font-bold text-blue-700 mt-0.5">{complaint.department}</p>
                    </div>
                  </div>
                </div>

                {/* Evidence & Remarks Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                    Department Remarks & Evidence
                  </h2>

                  {complaint.officialRemarks ? (
                    <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-xs sm:text-sm text-slate-700 leading-relaxed mb-4">
                      <strong className="block text-blue-900 font-semibold mb-1">Field Team Notes:</strong>
                      {complaint.officialRemarks}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic mb-4">
                      No field remarks recorded yet. Updates will appear once the assigned team inspects the site.
                    </p>
                  )}

                  {/* Photo Gallery Placeholder */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
                      <p className="text-xs font-semibold text-slate-600 mb-2">Citizen Submission Photo</p>
                      <div className="h-32 rounded-lg bg-slate-200/70 flex items-center justify-center text-slate-400 text-xs">
                        {complaint.photoUrl ? 'Photo Attached' : 'No Photo Uploaded'}
                      </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
                      <p className="text-xs font-semibold text-slate-600 mb-2">Resolution Proof Photo</p>
                      <div className="h-32 rounded-lg bg-slate-200/70 flex items-center justify-center text-slate-400 text-xs">
                        {complaint.resolutionPhotoUrl ? 'Resolution Photo' : 'Pending Resolution'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Timeline & Citizen Rating */}
              <div className="lg:col-span-5 space-y-6">
                {/* Milestone Stepper */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                    Resolution Timeline
                  </h2>

                  <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {timeline.map((step, idx) => (
                      <div key={idx} className="relative flex items-start gap-3">
                        <div
                          className={`absolute -left-6 mt-1 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-white ${
                            step.completed ? 'bg-blue-700' : 'bg-slate-300'
                          }`}
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{step.title}</p>
                          <p className="text-[11px] text-slate-500">{step.date} {step.time}</p>
                          <p className="mt-0.5 text-xs text-slate-600">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rating & Feedback Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Citizen Satisfaction Feedback
                  </h2>
                  <p className="text-xs text-slate-500 mb-4">
                    Rate the resolution speed and quality once work is marked completed.
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
                    placeholder="Enter your feedback on the repair quality..."
                    className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 resize-none mb-3"
                  />

                  {feedbackNotice && (
                    <div className="mb-3 rounded-lg border border-blue-200 bg-blue-50 p-2.5 text-xs text-blue-800">
                      {feedbackNotice}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleFeedbackSubmit}
                    className="w-full rounded-xl bg-blue-700 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-800 transition active:scale-[0.99]"
                  >
                    Submit Feedback
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