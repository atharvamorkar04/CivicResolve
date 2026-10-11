import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

/*
  BACKEND / DATABASE NOTE:

  This page currently uses demo complaint data and localStorage
  only because the Flask + MySQL backend is not connected yet.

  FINAL FLOW:

  Department Login
        ↓
  Flask Authentication
        ↓
  Department Dashboard API
        ↓
  MySQL complaints table
        ↓
  Only complaints assigned to logged-in department are returned

  React should NOT connect directly to MySQL.
  React -> Flask API -> MySQL -> Flask API -> React
*/

type ComplaintStatus =
  | 'Submitted'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'

type Complaint = {
  id: string
  title: string
  category: string
  location: string
  status: ComplaintStatus
  date: string
  department: string
}

type DepartmentUser = {
  name: string
  email?: string
}

/*
  DEMO DATA:

  This array is only for frontend demonstration.

  FINAL BACKEND:

  Replace this static array with data received from an API such as:

  GET /api/department/complaints

  The backend must identify the logged-in department from the
  authenticated user/session/token.

  IMPORTANT:
  Do NOT trust department name sent by React for security.

  Backend should determine:
  logged-in user -> department_id -> assigned complaints
*/

const complaints: Complaint[] = [
  {
    id: 'CC-1024',
    title: 'Large pothole on main road',
    category: 'Road / Transport',
    location: 'MG Road',
    status: 'Assigned',
    date: '06 Oct 2026',
    department: 'Road Department',
  },
  {
    id: 'CC-1027',
    title: 'Damaged road near school',
    category: 'Road / Transport',
    location: 'Station Road',
    status: 'In Progress',
    date: '05 Oct 2026',
    department: 'Road Department',
  },
  {
    id: 'CC-1031',
    title: 'Water leakage from pipeline',
    category: 'Water Supply',
    location: 'Shivaji Nagar',
    status: 'Assigned',
    date: '05 Oct 2026',
    department: 'Water Department',
  },
  {
    id: 'CC-1034',
    title: 'Street light not working',
    category: 'Electrical / Street Light',
    location: 'Market Area',
    status: 'Resolved',
    date: '04 Oct 2026',
    department: 'Electrical Department',
  },
  {
    id: 'CC-1038',
    title: 'Garbage accumulation',
    category: 'Garbage / Cleaning',
    location: 'Main Market',
    status: 'In Progress',
    date: '04 Oct 2026',
    department: 'Sanitation Department',
  },
  {
    id: 'CC-1040',
    title: 'Blocked drainage line',
    category: 'Drainage',
    location: 'Nehru Nagar',
    status: 'Assigned',
    date: '03 Oct 2026',
    department: 'Drainage Department',
  },
  {
    id: 'CC-1043',
    title: 'Damaged garden equipment',
    category: 'Parks & Garden',
    location: 'Central Garden',
    status: 'Submitted',
    date: '03 Oct 2026',
    department: 'Parks & Garden Department',
  },
  {
    id: 'CC-1046',
    title: 'Unsafe area near public place',
    category: 'Safety',
    location: 'Bus Stand Area',
    status: 'In Progress',
    date: '02 Oct 2026',
    department: 'Public Safety Department',
  },
]

function getStatusClasses(status: ComplaintStatus) {
  switch (status) {
    case 'Submitted':
      return 'bg-slate-100 text-slate-700'
    case 'Assigned':
      return 'bg-blue-100 text-blue-700'
    case 'In Progress':
      return 'bg-amber-100 text-amber-700'
    case 'Resolved':
      return 'bg-green-100 text-green-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

function DepartmentDashboard() {
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showProfile, setShowProfile] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  /*
    CURRENT DEMO AUTHENTICATION:

    departmentUser is currently stored in localStorage by the
    frontend login system.

    FINAL BACKEND:

    Replace this localStorage logic with authenticated user data.

    Suggested API:
    GET /api/auth/me

    Backend should return:
    {
      user_id,
      name,
      email,
      role,
      department_id,
      department_name
    }

    The backend must verify that role = "department".
  */

  const storedDepartment = localStorage.getItem('departmentUser')

  let departmentUser: DepartmentUser | null = null

  if (storedDepartment) {
    try {
      departmentUser = JSON.parse(storedDepartment)
    } catch {
      localStorage.removeItem('departmentUser')
    }
  }

  const departmentName = departmentUser?.name || 'Department'
  const departmentEmail =
    departmentUser?.email || 'department@civicresolve.com'

  /*
    BACKEND / DATABASE:

    Current filtering is done in React.

    FINAL SYSTEM:

    Backend should return ONLY complaints belonging to the
    authenticated department.

    Suggested API:
    GET /api/department/complaints

    Backend logic:

    1. Verify department user.
    2. Get department_id from authenticated account.
    3. Query complaints using department_id.
    4. Return only authorized complaints.

    Example database relationship:

    complaints.department_id
              ↓
    departments.department_id

    This prevents one department from seeing another
    department's complaints.
  */

  const departmentComplaints = useMemo(() => {
    return complaints.filter(
      (complaint) => complaint.department === departmentName,
    )
  }, [departmentName])

  /*
    SEARCH / FILTER:

    Currently search and status filtering happen on frontend.

    For a small dataset this is fine for the demo.

    FINAL BACKEND OPTION:

    GET /api/department/complaints?search=road&status=In%20Progress

    Flask can perform the filtering using SQL queries.

    IMPORTANT:
    Backend authorization must still happen even if filters
    are sent from React.
  */

  const filteredComplaints = useMemo(() => {
    const searchText = search.trim().toLowerCase()

    return departmentComplaints.filter((complaint) => {
      const matchesSearch =
        !searchText ||
        complaint.id.toLowerCase().includes(searchText) ||
        complaint.title.toLowerCase().includes(searchText) ||
        complaint.location.toLowerCase().includes(searchText) ||
        complaint.category.toLowerCase().includes(searchText)

      const matchesStatus =
        statusFilter === 'All' || complaint.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [departmentComplaints, search, statusFilter])

  /*
    DASHBOARD STATISTICS:

    These counts are currently calculated from the demo array.

    FINAL BACKEND:

    These values can be calculated using SQL COUNT queries.

    Suggested API:
    GET /api/department/dashboard/stats

    Example response:

    {
      "total_assigned": 8,
      "assigned": 3,
      "in_progress": 3,
      "resolved": 2,
      "submitted": 1
    }

    Backend should calculate counts only for the logged-in
    department.
  */

  const submittedCount = departmentComplaints.filter(
    (complaint) => complaint.status === 'Submitted',
  ).length

  const assignedCount = departmentComplaints.filter(
    (complaint) => complaint.status === 'Assigned',
  ).length

  const inProgressCount = departmentComplaints.filter(
    (complaint) => complaint.status === 'In Progress',
  ).length

  const resolvedCount = departmentComplaints.filter(
    (complaint) => complaint.status === 'Resolved',
  ).length

  /*
    LOGOUT:

    Current logout only removes demo localStorage values.

    FINAL BACKEND:

    Suggested API:
    POST /api/auth/logout

    Flask should invalidate the session/token if the project
    uses server-side sessions or token-based authentication.

    Then React can navigate back to the landing page.
  */

  const handleLogout = () => {
    localStorage.removeItem('userRole')
    localStorage.removeItem('departmentUser')
    setShowProfile(false)
    navigate('/')
  }

  /*
    NO DEPARTMENT USER:

    This is a frontend safety check for the demo.

    FINAL BACKEND:

    The Flask API should also reject unauthorized requests.

    Frontend protection alone is NOT security.
  */

  if (!departmentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg ring-1 ring-slate-200">

          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-2xl text-white">
            🏛️
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Department Login Required
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Please sign in to access the department dashboard.
          </p>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Go to Login
          </button>

        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl text-white">
              🏛️
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-900">
                CivicResolve
              </h1>

              <p className="text-xs text-slate-500">
                Department Portal
              </p>
            </div>

          </div>

          <div className="flex items-center gap-2 sm:gap-3">

            <button
              type="button"
              onClick={() => setShowNotifications(true)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:px-4"
            >
              🔔 <span className="hidden sm:inline">Notifications</span>
            </button>

            <button
              type="button"
              onClick={() => setShowProfile(true)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:px-4"
            >
              👤 <span className="hidden sm:inline">My Profile</span>
            </button>

          </div>

        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Welcome */}
        <div className="mb-8">

          <p className="text-sm font-medium text-blue-600">
            Department Dashboard
          </p>

          <h2 className="mt-1 text-3xl font-bold text-slate-900">
            Welcome, {departmentName}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            View and manage civic complaints assigned to your department.
          </p>

        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">
              Total Assigned
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {departmentComplaints.length}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Complaints for your department
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">
              Assigned
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {assignedCount}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Ready to be handled
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">
              In Progress
            </p>

            <p className="mt-2 text-3xl font-bold text-amber-600">
              {inProgressCount}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Currently being handled
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">
              Resolved
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {resolvedCount}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Successfully resolved
            </p>
          </div>

        </div>

        {/* Department Summary */}
        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:p-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-sm font-semibold text-blue-700">
                Department Overview
              </p>

              <h3 className="mt-1 text-lg font-bold text-slate-900">
                {departmentName}
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                {departmentComplaints.length} complaint
                {departmentComplaints.length === 1 ? '' : 's'} currently assigned
              </p>
            </div>

            <div className="flex flex-wrap gap-2">

              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                Submitted: {submittedCount}
              </span>

              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
                Assigned: {assignedCount}
              </span>

              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-100">
                In Progress: {inProgressCount}
              </span>

              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-green-700 ring-1 ring-green-100">
                Resolved: {resolvedCount}
              </span>

            </div>

          </div>

        </div>

        {/* Complaints Section */}
        <section className="mt-8 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">

          <div className="border-b border-slate-200 p-5 sm:p-6">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Assigned Complaints
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Complaints currently assigned to your department.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search complaints..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-64"
                />

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="All">All Status</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>

              </div>

            </div>

          </div>

          {/* Complaint List */}
          <div className="divide-y divide-slate-200">

            {filteredComplaints.length === 0 ? (
              <div className="p-10 text-center">

                <div className="text-4xl">
                  📋
                </div>

                <h4 className="mt-3 text-lg font-semibold text-slate-900">
                  No complaints found
                </h4>

                <p className="mt-1 text-sm text-slate-500">
                  Try changing your search or status filter.
                </p>

              </div>
            ) : (
              filteredComplaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className="p-5 transition hover:bg-slate-50 sm:p-6"
                >

                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap items-center gap-2">

                        <span className="text-sm font-semibold text-blue-600">
                          {complaint.id}
                        </span>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                            complaint.status,
                          )}`}
                        >
                          {complaint.status}
                        </span>

                      </div>

                      <h4 className="mt-2 text-lg font-semibold text-slate-900">
                        {complaint.title}
                      </h4>

                      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-500">

                        <span>
                          Category: {complaint.category}
                        </span>

                        <span>
                          Location: {complaint.location}
                        </span>

                        <span>
                          Date: {complaint.date}
                        </span>

                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/department/complaint/${complaint.id}`)
                      }
                      className="shrink-0 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      View Details
                    </button>

                  </div>

                </div>
              ))
            )}

          </div>

        </section>

      </main>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6">

          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

            <div className="flex items-start justify-between border-b border-slate-200 p-6">

              <div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                  👤
                </div>

                <h2 className="mt-3 text-xl font-bold text-slate-900">
                  My Profile
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Department account details
                </p>

              </div>

              <button
                type="button"
                onClick={() => setShowProfile(false)}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close profile"
              >
                ✕
              </button>

            </div>

            <div className="space-y-5 p-6">

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Department
                </p>

                <p className="mt-2 font-semibold text-slate-900">
                  {departmentName}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Email
                </p>

                <p className="mt-2 text-sm text-slate-600">
                  {departmentEmail}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Account Type
                </p>

                <p className="mt-2 text-sm font-medium text-slate-800">
                  Department Account
                </p>
              </div>

              {/*
                FINAL BACKEND:

                Profile information should come from:
                GET /api/auth/me

                Do not permanently store sensitive account information
                in localStorage.
              */}

              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                Logout
              </button>

            </div>

          </div>

        </div>
      )}

      {/* Notifications Modal */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6">

          <div className="flex max-h-[85vh] w-full max-w-md flex-col rounded-2xl bg-white shadow-2xl">

            <div className="flex shrink-0 items-start justify-between border-b border-slate-200 p-6">

              <div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                  🔔
                </div>

                <h2 className="mt-3 text-xl font-bold text-slate-900">
                  Notifications
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Updates for {departmentName}
                </p>

              </div>

              <button
                type="button"
                onClick={() => setShowNotifications(false)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close notifications"
              >
                ✕
              </button>

            </div>

            {/*
              NOTIFICATION BACKEND:

              Current notifications are generated from demo complaints.

              FINAL API:
              GET /api/department/notifications

              Suggested database table:

              notifications
              - notification_id
              - recipient_user_id
              - complaint_id
              - message
              - type
              - is_read
              - created_at

              Backend should return notifications only for the
              authenticated department/user.

              Notifications can be created when:
              - Admin assigns a complaint to department
              - Complaint status changes
              - Admin adds a remark
              - Citizen submits a complaint assigned to department
              - Resolution information is added
            */}

            <div className="min-h-0 flex-1 overflow-y-auto p-6">

              <div className="space-y-3">

                {departmentComplaints.length === 0 ? (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center">

                    <div className="text-3xl">
                      🔔
                    </div>

                    <p className="mt-2 text-sm font-medium text-slate-700">
                      No new notifications
                    </p>

                  </div>
                ) : (
                  <>
                    {departmentComplaints.slice(0, 5).map((complaint) => (
                      <div
                        key={complaint.id}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                      >

                        <p className="font-semibold text-slate-900">
                          {complaint.id} — {complaint.status}
                        </p>

                        <p className="mt-1 text-sm text-slate-600">
                          {complaint.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Assigned to {departmentName}
                        </p>

                      </div>
                    ))}
                  </>
                )}

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  )
}

export default DepartmentDashboard