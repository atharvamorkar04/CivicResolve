function MyComplaints() {

  // ============================================================
  // BACKEND TODO: FETCH COMPLAINTS FROM FLASK API
  // ============================================================
  //
  // Currently complaints are static demo data.
  //
  // Replace this array with data received from the backend.
  //
  // Suggested API:
  // GET /api/citizen/complaints
  //
  // IMPORTANT:
  // Backend should identify the logged-in citizen from
  // authentication/session/token.
  //
  // Do NOT send citizen_id from frontend and trust it directly.
  // Flask should determine which citizen is logged in.
  //
  // Backend should return ONLY complaints belonging to
  // the authenticated citizen.
  //
  // Suggested response:
  //
  // [
  //   {
  //     id: "CC-1024",
  //     title: "Road Maintenance Issue",
  //     category: "Road & Transport",
  //     date: "02 October 2026",
  //     status: "In Progress"
  //   }
  // ]
  //
  // Database table:
  // complaints
  //
  // Important relationship:
  // complaints.citizen_id
  //        ↓
  // users.user_id
  //
  // This relationship allows every citizen to see
  // only their own complaints.

  const complaints = [
    {
      id: 'CC-1024',
      title: 'Road Maintenance Issue',
      category: 'Road & Transport',
      date: '02 October 2026',
      status: 'In Progress',
      statusStyle: 'bg-blue-50 text-blue-700',
    },
    {
      id: 'CC-1018',
      title: 'Street Light Not Working',
      category: 'Electrical & Street Lights',
      date: '28 September 2026',
      status: 'Pending',
      statusStyle: 'bg-amber-50 text-amber-700',
    },
    {
      id: 'CC-1009',
      title: 'Garbage Not Collected',
      category: 'Garbage & Cleaning',
      date: '20 September 2026',
      status: 'Resolved',
      statusStyle: 'bg-emerald-50 text-emerald-700',
    },
  ]

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
              My Complaints
            </p>
          </div>

          <button
            onClick={() => window.location.href = '/dashboard'}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back to Dashboard
          </button>

        </div>
      </header>

      {/* Page Content */}
      <section className="mx-auto max-w-7xl px-6 py-10">

        {/* Heading */}
        <div className="mb-8">
          <p className="text-sm font-medium text-blue-700">
            Complaint Management
          </p>

          <h2 className="mt-1 text-3xl font-bold text-slate-900">
            My Complaints
          </h2>

          <p className="mt-2 text-slate-500">
            View and track all the civic issues you have reported.
          </p>
        </div>

        {/* Complaint List */}
        <div className="space-y-5">

          {complaints.map((complaint) => (
            <div
              key={complaint.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >

              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                {/* Complaint Information */}
                <div>

                  <div className="flex flex-wrap items-center gap-3">

                    <span className="text-sm font-semibold text-blue-700">
                      {complaint.id}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${complaint.statusStyle}`}
                    >
                      {complaint.status}
                    </span>

                  </div>

                  <h3 className="mt-3 text-lg font-bold text-slate-900">
                    {complaint.title}
                  </h3>

                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-500">

                    <span>
                      Category: {complaint.category}
                    </span>

                    <span>
                      Submitted: {complaint.date}
                    </span>

                  </div>

                </div>

                {/* View Details */}
                <button
                  onClick={() => window.location.href = `/complaint/${complaint.id}`}
                  className="self-start rounded-lg border border-blue-200 bg-blue-50 px-5 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 lg:self-auto"
                >
                  View Details →
                </button>

                {/* BACKEND TODO:
                    This button sends the complaint ID through the URL.

                    Example:
                    /complaint/CC-1024

                    ComplaintDetails page should use this ID to request
                    the complete complaint information from Flask.

                    Suggested API:
                    GET /api/citizen/complaints/:id

                    Backend must verify that the complaint belongs
                    to the logged-in citizen.

                    A citizen must NOT be able to open another
                    citizen's complaint by manually changing the ID.
                */}

              </div>

            </div>
          ))}

        </div>

        {/* BACKEND TODO:
            When API integration is added, handle these states:

            1. Loading:
               "Loading your complaints..."

            2. Success:
               Display complaints returned by Flask.

            3. No complaints:
               "You have not reported any complaints yet."

            4. API error:
               "Unable to load complaints. Please try again."

            The frontend should not assume that there will
            always be 3 complaints.
        */}

        {/* Empty / Information Note */}
        <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-5">

          <p className="text-sm font-semibold text-blue-800">
            Track Your Complaints
          </p>

          <p className="mt-1 text-sm leading-6 text-blue-700">
            You can open any complaint to view its complete status,
            department updates and resolution details.
          </p>

          {/* BACKEND TODO:
              Complaint details should be loaded from the database.

              The details page can show:
              - Complaint ID
              - Title
              - Category
              - Subcategory
              - Description
              - Location
              - Complaint photo
              - Assigned department
              - Current status
              - Status timeline
              - Department remarks
              - Admin remarks
              - Resolution information
              - Resolution photo
              - Submitted date
              - Updated date

              Suggested API:
              GET /api/citizen/complaints/:id
          */}

        </div>

      </section>

    </main>
  )
}

export default MyComplaints