import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const navigate = useNavigate()

  const [showProfile, setShowProfile] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  // ---------------------------------------------------------
  // BACKEND TODO: LOGGED-IN CITIZEN DETAILS
  // ---------------------------------------------------------
  //
  // Currently we read citizen details from localStorage because
  // this frontend is working with demo authentication.
  //
  // After Flask + MySQL integration:
  // - Do NOT use localStorage as the source of user information.
  // - Get the logged-in user's details from the authenticated backend session/token.
  //
  // Suggested API:
  // GET /api/auth/me
  //
  // Example response:
  // {
  //   userId: 101,
  //   fullName: "Citizen Name",
  //   email: "citizen@email.com",
  //   role: "citizen"
  // }
  //
  // Backend must identify the currently logged-in citizen.
  // React should never directly access the MySQL users table.

  // Get registered citizen details
  //
  // FRONTEND DEMO ONLY:
  // This localStorage data is currently used to display the citizen's
  // name and email.
  //
  // BACKEND TODO:
  // Replace this with data returned from GET /api/auth/me.
  const registeredUser = localStorage.getItem('registeredUser')

  let userName = 'Citizen User'
  let userEmail = 'citizen@demo.com'

  if (registeredUser) {
    try {
      const user = JSON.parse(registeredUser)

      if (user.role === 'citizen') {
        userName = user.fullName || userName
        userEmail = user.email || userEmail
      }
    } catch {
      // Use default demo citizen details
      //
      // BACKEND TODO:
      // This fallback will not be required after real authentication
      // and user data are handled by Flask.
    }
  }

  const handleLogout = () => {

    // ---------------------------------------------------------
    // BACKEND TODO: REAL LOGOUT
    // ---------------------------------------------------------
    //
    // Current logout only clears frontend demo information.
    //
    // When Flask authentication is implemented:
    // - Invalidate the backend session/token if required.
    // - Then clear the frontend authentication information.
    //
    // Suggested API:
    // POST /api/auth/logout
    //
    // Backend should make sure the authenticated session/token
    // can no longer be used after logout.

    localStorage.removeItem('userRole')
    localStorage.removeItem('departmentUser')
    setShowProfile(false)
    navigate('/')
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
              Citizen Dashboard
            </p>
          </div>

          <div className="flex items-center gap-3">

            {/* Notifications */}
            <button
              type="button"
              onClick={() => setShowNotifications(true)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              🔔 Notifications
            </button>

            {/* My Profile */}
            <button
              type="button"
              onClick={() => setShowProfile(true)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              👤 My Profile
            </button>

          </div>

        </div>
      </header>

      {/* Dashboard */}
      <section className="mx-auto max-w-7xl px-6 py-10">

        {/* Welcome */}
        <div className="mb-8">
          <p className="text-sm font-medium text-blue-700">
            Welcome 👋
          </p>

          <h2 className="mt-1 text-3xl font-bold text-slate-900">
            Citizen Dashboard
          </h2>

          <p className="mt-2 text-slate-500">
            Report civic issues and track your complaints from one place.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* Total Complaints */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="text-sm text-slate-500">
              Total Complaints
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              12
            </p>

            {/* BACKEND TODO:
                This number is currently static demo data.

                It should come from the database for the logged-in citizen.

                Suggested API:
                GET /api/citizen/dashboard/stats

                Backend should calculate:
                SELECT COUNT(*) FROM complaints
                WHERE citizen_id = logged_in_user_id

                Only the logged-in citizen's complaints should be counted.
            */}

          </div>

          {/* Pending */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="text-sm text-slate-500">
              Pending
            </p>

            <p className="mt-2 text-3xl font-bold text-amber-600">
              4
            </p>

            {/* BACKEND TODO:
                Count complaints belonging to the logged-in citizen
                whose status is pending/submitted/verified according
                to the final backend status design.

                Suggested API:
                GET /api/citizen/dashboard/stats
            */}

          </div>

          {/* In Progress */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="text-sm text-slate-500">
              In Progress
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-700">
              3
            </p>

            {/* BACKEND TODO:
                Count the logged-in citizen's complaints
                where status = "In Progress".

                This value should be calculated from MySQL,
                not hardcoded in React.
            */}

          </div>

          {/* Resolved */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="text-sm text-slate-500">
              Resolved
            </p>

            <p className="mt-2 text-3xl font-bold text-emerald-600">
              5
            </p>

            {/* BACKEND TODO:
                Count the logged-in citizen's complaints
                where status = "Resolved".

                Suggested database table:
                complaints

                Important:
                Always filter using the authenticated citizen_id.
            */}

          </div>

        </div>

        {/* Main Actions */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">

          {/* Report Issue */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
              📍
            </div>

            <h3 className="mt-5 text-xl font-bold">
              Report a Civic Issue
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Report problems such as potholes, garbage, street lights,
              water supply, drainage and other civic issues.
            </p>

            <button
              type="button"
              onClick={() => navigate('/report-issue')}
              className="mt-6 rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white shadow-sm hover:bg-blue-800"
            >
              Report an Issue
            </button>

            {/* BACKEND TODO:
                The Report Issue page will send the complaint to Flask.

                Suggested API:
                POST /api/complaints

                Complaint data may include:
                - category
                - subcategory
                - description
                - location
                - photo
                - citizen_id (backend should get this from authentication)

                Backend should automatically:
                - generate complaint ID
                - set initial status
                - store citizen relationship
                - create status history
                - create notification
            */}

          </div>

          {/* Track Complaints */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-2xl">
              📊
            </div>

            <h3 className="mt-5 text-xl font-bold">
              Track My Complaints
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              View your submitted complaints, current status, updates
              and resolution details.
            </p>

            <button
              type="button"
              onClick={() => navigate('/my-complaints')}
              className="mt-6 rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            >
              View Complaints
            </button>

            {/* BACKEND TODO:
                My Complaints page should fetch complaints
                belonging only to the logged-in citizen.

                Suggested API:
                GET /api/citizen/complaints

                Backend must use the authenticated user's citizen_id.
                Do NOT allow the frontend to request another citizen's
                complaints simply by changing an ID in the URL.
            */}

          </div>

        </div>

        {/* Recent Complaint */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-6 py-5">
            <h3 className="text-lg font-bold">
              Recent Complaint
            </h3>
          </div>

          <div className="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Complaint #CC-1024
              </p>

              <h4 className="mt-1 font-semibold text-slate-900">
                Road Maintenance Issue
              </h4>

              <p className="mt-1 text-sm text-slate-500">
                Submitted on 02 October 2026
              </p>
            </div>

            <div className="flex items-center gap-4">

              <span className="rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700">
                In Progress
              </span>

              <button
                type="button"
                onClick={() => navigate('/complaint/CC-1024')}
                className="text-sm font-semibold text-blue-700 hover:text-blue-800"
              >
                View Details →
              </button>

            </div>

          </div>

          {/* BACKEND TODO:
              This complaint is currently static demo data.

              Backend should return the most recent complaint
              of the logged-in citizen.

              Suggested API:
              GET /api/citizen/dashboard/recent-complaint

              Or the dashboard stats API can return recentComplaint
              together with the statistics.

              Example response:
              {
                id: "CC-1024",
                title: "Road Maintenance Issue",
                status: "In Progress",
                submittedAt: "2026-10-02"
              }

              View Details should then use the real complaint ID:
              navigate(`/complaint/${complaint.id}`)
          */}

        </div>

      </section>

      {/* Notifications Modal */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6">

          <div className="flex w-full max-w-md max-h-[85vh] flex-col rounded-2xl bg-white shadow-2xl">

            {/* Notifications Header */}
            <div className="flex shrink-0 items-start justify-between border-b border-slate-200 p-6">

              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                  🔔
                </div>

                <h2 className="mt-3 text-xl font-bold text-slate-900">
                  Notifications
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Updates related to your complaints
                </p>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowNotifications(false)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close notifications"
              >
                ✕
              </button>

            </div>

            {/* Scrollable Notifications */}
            <div className="min-h-0 flex-1 overflow-y-auto p-6">

              <div className="space-y-3">

                {/* Registered */}
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                  <p className="font-semibold text-slate-900">
                    Your complaint CC-1024 has been registered successfully.
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Just now
                  </p>
                </div>

                {/* Verified */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">
                    Complaint CC-1024 has been verified by the Admin.
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Today
                  </p>
                </div>

                {/* Assigned */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">
                    Complaint CC-1024 has been assigned to Road Department.
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Today
                  </p>
                </div>

                {/* In Progress */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">
                    Complaint CC-1024 is now In Progress.
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Today
                  </p>
                </div>

                {/* Department Remark */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">
                    Department added a remark to complaint CC-1024.
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Today
                  </p>
                </div>

                {/* Department Photo */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">
                    Department uploaded a photo for complaint CC-1024.
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Today
                  </p>
                </div>

                {/* Admin Remark */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">
                    Admin added a remark to complaint CC-1024.
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Today
                  </p>
                </div>

                {/* Resolved */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">
                    Complaint CC-1024 has been resolved.
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Yesterday
                  </p>
                </div>

                {/* BACKEND TODO:
                    These notifications are currently static demo data.

                    They should eventually come from a notifications table
                    in MySQL.

                    Suggested table:
                    notifications
                    --------------------------------
                    notification_id
                    citizen_id
                    complaint_id
                    message
                    type
                    created_at
                    is_read
                    --------------------------------

                    Suggested API:
                    GET /api/citizen/notifications

                    Backend should return notifications only for the
                    authenticated citizen.

                    Example response:
                    [
                      {
                        id: 1,
                        complaintId: "CC-1024",
                        message: "Complaint CC-1024 is now In Progress.",
                        type: "status_update",
                        createdAt: "2026-10-07T10:30:00",
                        isRead: false
                      }
                    ]

                    Important events that should create notifications:
                    - Complaint registered
                    - Complaint verified
                    - Department assigned
                    - Status changed
                    - Department remark added
                    - Photo uploaded
                    - Admin remark added
                    - Complaint resolved
                */}

              </div>

            </div>

          </div>

        </div>
      )}

      {/* My Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-6">

          <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl">

            {/* Profile Header */}
            <div className="flex items-start justify-between">

              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                  👤
                </div>

                <h2 className="mt-4 text-2xl font-bold text-slate-900">
                  My Profile
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your CivicResolve account details
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowProfile(false)}
                className="rounded-lg px-3 py-2 text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close profile"
              >
                ✕
              </button>

            </div>

            {/* User Details */}
            <div className="mt-7 space-y-4">

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Full Name
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {userName}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Registered Email
                </p>

                <p className="mt-1 break-all font-semibold text-slate-900">
                  {userEmail}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Account Type
                </p>

                <p className="mt-1 font-semibold text-blue-700">
                  Citizen
                </p>
              </div>

              {/* BACKEND TODO:
                  Profile information should eventually come from:
                  GET /api/auth/me

                  If the project later supports profile editing,
                  use a separate authenticated API such as:
                  PUT /api/citizen/profile

                  Do not allow citizens to change their role
                  through the frontend.
              */}

            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="mt-7 w-full rounded-lg bg-blue-700 py-3.5 font-semibold text-white shadow-sm hover:bg-blue-800"
            >
              Logout
            </button>

          </div>

        </div>
      )}

    </main>
  )
}

export default Dashboard