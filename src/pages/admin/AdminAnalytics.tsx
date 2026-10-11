import { useNavigate } from 'react-router-dom'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

function AdminAnalytics() {
  const navigate = useNavigate()

  /*
    BACKEND / DATABASE NOTE:

    This analytics page currently uses static demo data.

    After Flask + MySQL integration, DO NOT keep these numbers hardcoded.

    Recommended API:
    GET /api/admin/analytics

    Backend should:
    1. Verify that the logged-in user is an Admin.
    2. Read complaint data from the MySQL database.
    3. Calculate category-wise, status-wise, monthly and department-wise data.
    4. Send the calculated data to React as JSON.
    5. React will display that data in these Recharts components.

    Example response structure:

    {
      "summary": {
        "total": 128,
        "pending": 32,
        "in_progress": 41,
        "resolved": 55,
        "resolution_rate": 43
      },
      "categoryData": [
        { "name": "Road", "complaints": 32 }
      ],
      "statusData": [
        { "name": "Pending", "value": 32 }
      ],
      "monthlyData": [
        { "month": "Oct", "complaints": 42 }
      ],
      "departmentData": [
        { "name": "Road", "complaints": 32 }
      ]
    }

    Important:
    React should NOT connect directly to MySQL.
    React -> Flask API -> MySQL -> Flask API -> React
  */

  /*
    DATABASE TABLES USED FOR ANALYTICS:

    complaints
    - complaint_id
    - citizen_id
    - category
    - subcategory
    - department_id
    - status
    - created_at
    - updated_at
    - resolved_at

    users
    - user_id
    - name
    - email
    - role

    departments
    - department_id
    - department_name

    complaint_status_history
    - history_id
    - complaint_id
    - status
    - changed_by
    - changed_at

    These tables will allow the backend team to generate all
    statistics shown on this page.
  */

  // TODO BACKEND:
  // Replace this static category data with category-wise complaint
  // counts received from GET /api/admin/analytics.
  const categoryData = [
    { name: 'Road', complaints: 32 },
    { name: 'Garbage', complaints: 24 },
    { name: 'Water', complaints: 21 },
    { name: 'Electrical', complaints: 18 },
    { name: 'Drainage', complaints: 15 },
    { name: 'Other', complaints: 18 },
  ]

  /*
    BACKEND QUERY IDEA:

    SELECT category, COUNT(*) AS complaints
    FROM complaints
    GROUP BY category;

    The backend should convert the database result into:
    { name: category, complaints: count }
  */

  // TODO BACKEND:
  // Replace this static status data with live complaint status counts
  // from the MySQL database.
  const statusData = [
    { name: 'Pending', value: 32 },
    { name: 'In Progress', value: 41 },
    { name: 'Resolved', value: 55 },
  ]

  /*
    BACKEND QUERY IDEA:

    SELECT status, COUNT(*) AS total
    FROM complaints
    GROUP BY status;

    The backend should return:
    { name: "Pending", value: total }

    Note:
    The final system may use statuses such as:
    Submitted -> Verified -> Assigned -> In Progress -> Resolved -> Closed.

    Keep the frontend chart synchronized with the final status names
    used by the backend/database.
  */

  // TODO BACKEND:
  // This chart should show complaints created during each month.
  // The backend should calculate monthly counts from complaints.created_at.
  const monthlyData = [
    { month: 'May', complaints: 18 },
    { month: 'Jun', complaints: 25 },
    { month: 'Jul', complaints: 31 },
    { month: 'Aug', complaints: 28 },
    { month: 'Sep', complaints: 38 },
    { month: 'Oct', complaints: 42 },
  ]

  /*
    BACKEND QUERY IDEA:

    The backend can group complaints by month using the
    created_at date stored in the complaints table.

    Example concept:

    SELECT MONTH(created_at), COUNT(*)
    FROM complaints
    GROUP BY MONTH(created_at);

    For a real application, also consider the year so that
    October 2025 and October 2026 are not mixed together.

    The backend should return the latest required months
    in the format:
    { month: "Oct", complaints: 42 }
  */

  // TODO BACKEND:
  // Replace this static department data with live data.
  // Department information should come from the departments table.
  const departmentData = [
    { name: 'Road', complaints: 32 },
    { name: 'Sanitation', complaints: 24 },
    { name: 'Water', complaints: 21 },
    { name: 'Electrical', complaints: 18 },
    { name: 'Drainage', complaints: 15 },
  ]

  /*
    BACKEND QUERY IDEA:

    SELECT d.department_name, COUNT(c.complaint_id)
    FROM departments d
    LEFT JOIN complaints c
      ON d.department_id = c.department_id
    GROUP BY d.department_id, d.department_name;

    This is better than hardcoding department names because
    all departments can be managed from the departments table.

    Current project departments include:
    - Road
    - Water
    - Electrical
    - Sanitation
    - Drainage
    - Parks & Garden
    - Public Safety

    The final analytics page should be able to display all departments.
  */

  const pieColors = ['#f59e0b', '#3b82f6', '#10b981']

  /*
    BACKEND NOTE FOR SUMMARY CARDS:

    The following values are currently hardcoded:
    - Total Complaints = 128
    - Pending = 32
    - In Progress = 41
    - Resolved = 55
    - Resolution Rate = 43%

    These should eventually come from:
    GET /api/admin/analytics

    Suggested backend calculations:

    Total Complaints:
    COUNT(*) FROM complaints

    Pending:
    COUNT(*) WHERE status = 'Pending'

    In Progress:
    COUNT(*) WHERE status = 'In Progress'

    Resolved:
    COUNT(*) WHERE status = 'Resolved'

    Resolution Rate:
    (Resolved Complaints / Total Complaints) * 100

    Backend should calculate the percentage and send it to React.
    React should only display the received value.
  */

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
              Administration Portal
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/admin/dashboard')}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back to Dashboard
          </button>

        </div>
      </header>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-6 py-10">

        {/* Heading */}
        <div className="mb-8">

          <p className="text-sm font-medium text-blue-700">
            Administration
          </p>

          <h2 className="mt-1 text-3xl font-bold text-slate-900">
            Analytics & Reports
          </h2>

          <p className="mt-2 text-slate-500">
            Overview of complaint trends, status and department performance.
          </p>

        </div>

        {/* Summary Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Complaints
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              128
            </p>

            <p className="mt-2 text-sm text-blue-600">
              All reported issues
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Pending
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              32
            </p>

            <p className="mt-2 text-sm text-amber-600">
              Need attention
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              In Progress
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              41
            </p>

            <p className="mt-2 text-sm text-blue-600">
              Currently being handled
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Resolution Rate
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              43%
            </p>

            <p className="mt-2 text-sm text-emerald-600">
              55 complaints resolved
            </p>
          </div>

        </div>

        {/* Charts Row 1 */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          {/* Category Chart */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-5">
              <h3 className="text-lg font-bold text-slate-900">
                Complaints by Category
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Number of complaints reported in each category.
              </p>
            </div>

            <div className="h-80">

              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="name" />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="complaints"
                    fill="#2563eb"
                    radius={[6, 6, 0, 0]}
                  />

                </BarChart>
              </ResponsiveContainer>

            </div>

          </div>

          {/* Status Chart */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-5">
              <h3 className="text-lg font-bold text-slate-900">
                Complaint Status
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Distribution of complaints by current status.
              </p>
            </div>

            <div className="h-80">

              <ResponsiveContainer width="100%" height="100%">
                <PieChart>

                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={105}
                    dataKey="value"
                    label
                  >

                    {statusData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={pieColors[index]}
                      />
                    ))}

                  </Pie>

                  <Tooltip />

                  <Legend />

                </PieChart>
              </ResponsiveContainer>

            </div>

          </div>

        </div>

        {/* Monthly Trend */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-5">
            <h3 className="text-lg font-bold text-slate-900">
              Monthly Complaint Trend
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Complaint reporting trend over the past six months.
            </p>
          </div>

          <div className="h-80">

            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="complaints"
                  name="Complaints"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 7 }}
                />

              </LineChart>
            </ResponsiveContainer>

          </div>

        </div>

        {/* Department Performance */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-5">
            <h3 className="text-lg font-bold text-slate-900">
              Department-wise Complaints
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Complaints currently assigned to major departments.
            </p>
          </div>

          <div className="h-80">

            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={departmentData}
                layout="vertical"
              >

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis type="number" />

                <YAxis
                  dataKey="name"
                  type="category"
                  width={100}
                />

                <Tooltip />

                <Bar
                  dataKey="complaints"
                  name="Complaints"
                  fill="#2563eb"
                  radius={[0, 6, 6, 0]}
                />

              </BarChart>
            </ResponsiveContainer>

          </div>

        </div>

      </section>

    </main>
  )
}

export default AdminAnalytics