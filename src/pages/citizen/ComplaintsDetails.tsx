import { useParams } from 'react-router-dom'
import { useState } from 'react'

function ComplaintsDetails() {
  const { id } = useParams()

  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // ============================================================
  // BACKEND TODO: FETCH COMPLAINT DETAILS
  // ============================================================
  //
  // Currently complaint information is static demo data.
  //
  // Replace this object with data received from Flask backend.
  //
  // Suggested API:
  // GET /api/citizen/complaints/:id
  //
  // Example:
  // GET /api/citizen/complaints/CC-1024
  //
  // Backend should:
  // 1. Read complaint ID from the URL.
  // 2. Identify the logged-in citizen.
  // 3. Find the complaint in MySQL.
  // 4. Verify that the complaint belongs to that citizen.
  // 5. Return complete complaint details.
  //
  // IMPORTANT:
  // A citizen must NOT be allowed to view another citizen's
  // complaint by manually changing the complaint ID in the URL.
  //
  // Suggested database relationship:
  //
  // users.user_id
  //      ↓
  // complaints.citizen_id
  //
  // Suggested response fields:
  // complaint_id
  // title
  // category
  // subcategory
  // description
  // location
  // department
  // status
  // created_at
  // updated_at
  // resolution_info

  const complaint = {
    id: id || 'CC-1024',
    title: 'Road Maintenance Issue',
    category: 'Road & Transport',
    subcategory: 'Potholes',
    date: '02 October 2026',
    department: 'Road Department',
    location: 'Main Road, City Area',
    description:
      'Multiple potholes have been reported on the road causing inconvenience and safety issues for citizens.',
    status: 'In Progress',
  }

  // ============================================================
  // BACKEND TODO: COMPLAINT STATUS TIMELINE
  // ============================================================
  //
  // Currently timeline data is static demo data.
  //
  // Replace this with status-history records fetched from Flask.
  //
  // Suggested API:
  // GET /api/citizen/complaints/:id/timeline
  //
  // Suggested database table:
  //
  // complaint_status_history
  // --------------------------------
  // history_id
  // complaint_id
  // status
  // remarks
  // changed_by
  // changed_at
  // --------------------------------
  //
  // Every important status change should create a new
  // history record instead of overwriting the previous one.
  //
  // Example:
  //
  // Submitted
  //     ↓
  // Verified
  //     ↓
  // Assigned
  //     ↓
  // In Progress
  //     ↓
  // Resolved
  //
  // This allows the citizen to see the complete journey
  // of their complaint.

  const timeline = [
    {
      title: 'Complaint Submitted',
      date: '02 October 2026',
      time: '10:30 AM',
      description: 'Your complaint has been successfully submitted.',
      completed: true,
    },
    {
      title: 'Complaint Verified',
      date: '02 October 2026',
      time: '02:15 PM',
      description: 'The complaint has been verified by the administration.',
      completed: true,
    },
    {
      title: 'Assigned to Department',
      date: '03 October 2026',
      time: '11:00 AM',
      description: 'Complaint assigned to the Road Department.',
      completed: true,
    },
    {
      title: 'In Progress',
      date: '04 October 2026',
      time: '09:45 AM',
      description: 'Department has started working on the reported issue.',
      completed: true,
    },
    {
      title: 'Resolved',
      date: 'Pending',
      time: '',
      description: 'The complaint will be marked resolved after completion.',
      completed: false,
    },
  ]

  // ============================================================
  // BACKEND TODO: CITIZEN FEEDBACK / RATING
  // ============================================================
  //
  // Currently feedback is only stored in React state.
  //
  // After backend integration, submit feedback to Flask.
  //
  // Suggested API:
  // POST /api/citizen/complaints/:id/feedback
  //
  // Suggested request:
  // {
  //   rating: 5,
  //   feedback: "Issue was resolved quickly."
  // }
  //
  // Backend should:
  // 1. Verify logged-in citizen.
  // 2. Verify complaint belongs to that citizen.
  // 3. Check complaint status is Resolved.
  // 4. Validate rating between 1 and 5.
  // 5. Save feedback in MySQL.
  //
  // Suggested database table:
  //
  // complaint_feedback
  // --------------------------------
  // feedback_id
  // complaint_id
  // citizen_id
  // rating
  // feedback
  // created_at
  // --------------------------------
  //
  // Ideally allow one feedback record per complaint.
  //
  // Admin Analytics can later use this table to calculate
  // average citizen satisfaction ratings.

  const handleFeedbackSubmit = () => {
    if (rating === 0 || feedback.trim() === '') {
      return
    }

    // BACKEND TODO:
    // Replace the local state update with an API request.
    //
    // Suggested API:
    // POST /api/citizen/complaints/:id/feedback
    //
    // Send:
    // {
    //   rating,
    //   feedback: feedback.trim()
    // }
    //
    // Show success message only after the backend confirms
    // that the feedback was successfully saved.

    setSubmitted(true)
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-blue-700">
              CivicResolve
            </h1>

            <p className="text-xs text-slate-500">
              Complaint Details
            </p>
          </div>

          <button
            onClick={() => window.location.href = '/my-complaints'}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back to Complaints
          </button>

        </div>
      </header>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-6 py-10">

        {/* Heading */}
        <div className="mb-8">

          <p className="text-sm font-medium text-blue-700">
            Complaint #{complaint.id}
          </p>

          <h2 className="mt-1 text-3xl font-bold text-slate-900">
            {complaint.title}
          </h2>

          <div className="mt-3 flex flex-wrap items-center gap-3">

            <span className="rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700">
              {complaint.status}
            </span>

            <span className="text-sm text-slate-500">
              Submitted on {complaint.date}
            </span>

          </div>

          {/* BACKEND TODO:
              Complaint ID and current status should come
              from the backend response.

              The frontend should not calculate or modify
              the official complaint status.

              Status must be controlled by authorized
              Admin/Department users through the backend.
          */}

        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Left Content */}
          <div className="lg:col-span-2">

            {/* Complaint Information */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

              <h3 className="text-lg font-bold text-slate-900">
                Complaint Information
              </h3>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Category
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {complaint.category}
                  </p>

                  {/* BACKEND TODO:
                      Load category from complaints.category
                      in MySQL.
                  */}

                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Subcategory
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {complaint.subcategory}
                  </p>

                  {/* BACKEND TODO:
                      Load subcategory from the complaint record.
                  */}

                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Department
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {complaint.department}
                  </p>

                  {/* BACKEND TODO:
                      Department should come from the complaint's
                      department relationship.

                      Example:
                      complaints.department_id
                              ↓
                      departments.department_id
                  */}

                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Location
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {complaint.location}
                  </p>

                  {/* BACKEND TODO:
                      Load location from the complaint database record.

                      Future map integration may additionally
                      provide latitude and longitude.
                  */}

                </div>

              </div>

              <div className="mt-7 border-t border-slate-100 pt-6">

                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Description
                </p>

                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {complaint.description}
                </p>

                {/* BACKEND TODO:
                    Load full complaint description from MySQL.
                */}

              </div>

            </div>

            {/* Location */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

              <h3 className="text-lg font-bold text-slate-900">
                Complaint Location
              </h3>

              <div className="mt-5 flex h-56 items-center justify-center rounded-xl border border-dashed border-blue-200 bg-blue-50">

                <div className="text-center">

                  <div className="text-4xl">
                    📍
                  </div>

                  <p className="mt-2 font-semibold text-blue-800">
                    {complaint.location}
                  </p>

                  <p className="mt-1 text-sm text-blue-600">
                    Interactive map will be integrated later
                  </p>

                </div>

              </div>

              {/* BACKEND TODO:
                  Map integration is intentionally postponed.

                  Later the backend can return:
                  latitude
                  longitude

                  Suggested fields:
                  complaints.latitude
                  complaints.longitude

                  Frontend can use these values when map
                  integration is added.
              */}

            </div>

            {/* Photos */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

              <h3 className="text-lg font-bold text-slate-900">
                Complaint Photos
              </h3>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">

                <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50">

                  <div className="text-center">

                    <div className="text-3xl">
                      📷
                    </div>

                    <p className="mt-2 text-sm font-medium text-slate-500">
                      Before Photo
                    </p>

                  </div>

                </div>

                <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50">

                  <div className="text-center">

                    <div className="text-3xl">
                      🛠️
                    </div>

                    <p className="mt-2 text-sm font-medium text-slate-500">
                      Resolution Photo
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Available after resolution
                    </p>

                  </div>

                </div>

              </div>

              {/* BACKEND TODO:
                  Photos should be loaded from backend/storage.

                  Suggested API:
                  GET /api/citizen/complaints/:id/photos

                  Suggested database table:
                  complaint_photos
                  --------------------------------
                  photo_id
                  complaint_id
                  photo_type
                  file_path
                  uploaded_by
                  uploaded_at
                  --------------------------------

                  photo_type examples:
                  "complaint"
                  "resolution"

                  Backend should return a secure file URL/path.

                  Do not store large image files directly
                  inside the complaints table.
              */}

            </div>

            {/* Feedback */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

              <div>
                <p className="text-sm font-medium text-blue-700">
                  Citizen Feedback
                </p>

                <h3 className="mt-1 text-xl font-bold text-slate-900">
                  Rate Your Complaint Resolution
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Once your complaint is resolved, share your experience
                  and help us improve civic services.
                </p>
              </div>

              {/* BACKEND TODO:
                  Feedback should normally be enabled only when
                  complaint.status = "Resolved".

                  Backend must also enforce this rule because
                  frontend checks can be bypassed.
              */}

              {!submitted ? (
                <>
                  {/* Rating */}
                  <div className="mt-6">

                    <p className="text-sm font-semibold text-slate-700">
                      Your Rating
                    </p>

                    <div className="mt-3 flex gap-2">

                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`text-3xl transition ${
                            star <= rating
                              ? 'text-amber-400'
                              : 'text-slate-300'
                          } hover:scale-105`}
                        >
                          ★
                        </button>
                      ))}

                    </div>

                    {rating > 0 && (
                      <p className="mt-2 text-xs text-slate-500">
                        You selected {rating} out of 5 stars.
                      </p>
                    )}

                  </div>

                  {/* Feedback Text */}
                  <div className="mt-6">

                    <label className="text-sm font-semibold text-slate-700">
                      Your Feedback
                    </label>

                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Tell us about your experience..."
                      rows={4}
                      className="mt-2 w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />

                  </div>

                  {/* Submit */}
                  <button
                    type="button"
                    onClick={handleFeedbackSubmit}
                    disabled={rating === 0 || feedback.trim() === ''}
                    className="mt-5 rounded-lg bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    Submit Feedback
                  </button>

                </>
              ) : (
                <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50 p-5">

                  <p className="font-semibold text-emerald-800">
                    ✓ Thank you for your feedback!
                  </p>

                  <p className="mt-1 text-sm text-emerald-700">
                    Your {rating}-star rating and feedback have been recorded.
                  </p>

                  {/* BACKEND TODO:
                      This success message should be shown only
                      after Flask confirms that the feedback was
                      successfully stored in MySQL.
                  */}

                </div>
              )}

            </div>

          </div>

          {/* Timeline */}
          <div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

              <h3 className="text-lg font-bold text-slate-900">
                Complaint Status
              </h3>

              <div className="mt-7">

                {timeline.map((item, index) => (

                  <div
                    key={item.title}
                    className="relative flex gap-4"
                  >

                    {index !== timeline.length - 1 && (
                      <div
                        className={`absolute left-3 top-7 h-full w-px ${
                          item.completed
                            ? 'bg-blue-200'
                            : 'bg-slate-200'
                        }`}
                      />
                    )}

                    <div
                      className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${
                        item.completed
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-300 bg-white text-slate-400'
                      }`}
                    >
                      {item.completed ? '✓' : ''}
                    </div>

                    <div className="pb-8">

                      <p
                        className={`text-sm font-bold ${
                          item.completed
                            ? 'text-slate-900'
                            : 'text-slate-400'
                        }`}
                      >
                        {item.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {item.date}
                        {item.time && ` • ${item.time}`}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {item.description}
                      </p>

                      {/* BACKEND TODO:
                          Timeline description/remarks should come
                          from complaint_status_history.

                          Example:
                          Admin verifies complaint
                              ↓
                          history record created

                          Department changes status
                              ↓
                          history record created

                          Department adds remark
                              ↓
                          history record created

                          This makes the timeline dynamic and
                          preserves the complete complaint history.
                      */}

                    </div>

                  </div>

                ))}

              </div>

              {/* BACKEND TODO:
                  Timeline should be sorted by changed_at
                  from oldest to newest.

                  Backend should return:
                  status
                  changed_at
                  remarks
                  changed_by role/name

                  Example:
                  {
                    status: "In Progress",
                    changed_at: "...",
                    remarks: "Repair work started.",
                    changed_by: "Road Department"
                  }
              */}

            </div>

          </div>

        </div>

      </section>

    </main>
  )
}

export default ComplaintsDetails