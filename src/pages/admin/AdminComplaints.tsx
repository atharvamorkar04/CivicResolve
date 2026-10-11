import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AdminComplaints() {
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')

  /*
    BACKEND / DATABASE NOTE:

    Current complaints are static demo data.

    FINAL VERSION:
    Complaints should be fetched from MySQL through the Flask backend.

    Suggested API:
    GET /api/admin/complaints

    Backend should return:
    - complaint_id
    - title
    - category
    - citizen name
    - created_at
    - department
    - status

    IMPORTANT:
    React should NOT connect directly to MySQL.
    React -> Flask API -> MySQL
  */
  const complaints = [
    {
      id: 'CC-1024',
      title: 'Road Maintenance Issue',
      category: 'Road & Transport',
      citizen: 'Rahul Patil',
      date: '02 October 2026',
      department: 'Road Department',
      status: 'In Progress',
      statusStyle: 'bg-blue-50 text-blue-700',
    },
    {
      id: 'CC-1023',
      title: 'Garbage Not Collected',
      category: 'Garbage & Cleaning',
      citizen: 'Priya Sharma',
      date: '01 October 2026',
      department: 'Sanitation Department',
      status: 'Pending',
      statusStyle: 'bg-amber-50 text-amber-700',
    },
    {
      id: 'CC-1022',
      title: 'Street Light Not Working',
      category: 'Electrical & Street Lights',
      citizen: 'Amit Joshi',
      date: '30 September 2026',
      department: 'Electrical Department',
      status: 'Resolved',
      statusStyle: 'bg-emerald-50 text-emerald-700',
    },
    {
      id: 'CC-1021',
      title: 'Water Leakage',
      category: 'Water Supply',
      citizen: 'Sneha Kulkarni',
      date: '29 September 2026',
      department: 'Water Department',
      status: 'In Progress',
      statusStyle: 'bg-blue-50 text-blue-700',
    },
    {
      id: 'CC-1020',
      title: 'Blocked Drain',
      category: 'Drainage & Sewage',
      citizen: 'Vikram More',
      date: '28 September 2026',
      department: 'Drainage Department',
      status: 'Pending',
      statusStyle: 'bg-amber-50 text-amber-700',
    },
  ]

  /*
    BACKEND / DATABASE:

    Current search and filters work on frontend demo data.

    FINAL VERSION:
    Backend can receive search/filter parameters and query MySQL.

    Example:
    GET /api/admin/complaints?search=CC-1024
    GET /api/admin/complaints?status=Resolved
    GET /api/admin/complaints?department=Water%20Department

    Backend must validate that the logged-in user has Admin role.
  */
  const filteredComplaints = useMemo(() => {
    const searchText = search.trim().toLowerCase()

    return complaints.filter((complaint) => {
      const matchesSearch =
        !searchText ||
        complaint.id.toLowerCase().includes(searchText) ||
        complaint.title.toLowerCase().includes(searchText) ||
        complaint.citizen.toLowerCase().includes(searchText)

      const matchesStatus =
        statusFilter === 'all' ||
        complaint.status.toLowerCase().replace(' ', '-') === statusFilter

      const matchesDepartment =
        departmentFilter === 'all' ||
        complaint.department === departmentFilter

      return matchesSearch && matchesStatus && matchesDepartment
    })
  }, [search, statusFilter, departmentFilter])

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
            Complaint Management
          </p>

          <h2 className="mt-1 text-3xl font-bold text-slate-900">
            All Complaints
          </h2>

          <p className="mt-2 text-slate-500">
            View and manage all complaints submitted by citizens.
          </p>

        </div>

        {/* Search & Filters */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="grid gap-4 md:grid-cols-3">

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search complaint ID, title or citizen..."
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />

            {/*
              BACKEND:
              Status filter should eventually be applied using the complaints.status
              column in MySQL.

              Suggested statuses:
              Submitted
              Verified
              Assigned
              In Progress
              Resolved
            */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>

            {/*
              BACKEND / DATABASE:
              Department filter should use the department relationship
              stored in the complaint record.

              Suggested database relationship:
              complaints.department_id -> departments.department_id

              Backend should return the department name for display.
            */}
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">All Departments</option>
              <option value="Road Department">Road Department</option>
              <option value="Water Department">Water Department</option>
              <option value="Electrical Department">
                Electrical Department
              </option>
              <option value="Sanitation Department">
                Sanitation Department
              </option>
              <option value="Drainage Department">
                Drainage Department
              </option>
            </select>

          </div>

          <div className="mt-4 flex items-center justify-between">

            <p className="text-sm text-slate-500">
              Showing{' '}
              <span className="font-semibold text-slate-700">
                {filteredComplaints.length}
              </span>{' '}
              of {complaints.length} complaints
            </p>

            {(search || statusFilter !== 'all' || departmentFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setStatusFilter('all')
                  setDepartmentFilter('all')
                }}
                className="text-sm font-semibold text-blue-700 hover:text-blue-800"
              >
                Clear Filters
              </button>
            )}

          </div>

        </div>

        {/* Complaints Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="border-b border-slate-200 bg-slate-50">

                <tr>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Complaint
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Citizen
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Department
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Date
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredComplaints.length > 0 ? (

                  filteredComplaints.map((complaint) => (

                    <tr
                      key={complaint.id}
                      className="transition hover:bg-slate-50"
                    >

                      <td className="px-6 py-5">

                        <p className="text-sm font-semibold text-blue-700">
                          {complaint.id}
                        </p>

                        <p className="mt-1 font-semibold text-slate-900">
                          {complaint.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {complaint.category}
                        </p>

                      </td>

                      <td className="px-6 py-5">

                        <p className="text-sm font-medium text-slate-800">
                          {complaint.citizen}
                        </p>

                      </td>

                      <td className="px-6 py-5">

                        <p className="text-sm text-slate-600">
                          {complaint.department}
                        </p>

                      </td>

                      <td className="px-6 py-5">

                        <p className="text-sm text-slate-600">
                          {complaint.date}
                        </p>

                      </td>

                      <td className="px-6 py-5">

                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${complaint.statusStyle}`}
                        >
                          {complaint.status}
                        </span>

                      </td>

                      <td className="px-6 py-5 text-right">

                        {/*
                          BACKEND / DATABASE:

                          Clicking View Details opens the complaint details page.

                          Suggested API for that page:
                          GET /api/admin/complaints/:complaint_id

                          Backend must:
                          - Verify Admin authentication.
                          - Find complaint using complaint_id.
                          - Return citizen, department, status, remarks,
                            resolution information and photos.
                        */}
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/admin/complaint/${complaint.id}`)
                          }
                          className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                        >
                          View Details
                        </button>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center"
                    >
                      <p className="text-sm font-semibold text-slate-700">
                        No complaints found
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Try changing your search or filter.
                      </p>
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* Information */}
        <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-5">

          <p className="text-sm font-semibold text-blue-800">
            Complaint Management
          </p>

          <p className="mt-1 text-sm leading-6 text-blue-700">
            Admin can review complaints, assign departments and
            monitor their progress from this section.
          </p>

        </div>

        {/*
          BACKEND / DATABASE SUMMARY:

          Main MySQL tables required for this page:

          1. complaints
             - complaint_id
             - citizen_id
             - title
             - category
             - subcategory
             - description
             - location
             - department_id
             - status
             - created_at
             - updated_at

          2. users
             - user_id
             - name
             - email
             - password_hash
             - role

          3. departments
             - department_id
             - department_name

          4. complaint_status_history
             - history_id
             - complaint_id
             - status
             - remarks
             - changed_by
             - changed_at

          Backend should use JOINs between these tables when
          returning complete complaint information.

          IMPORTANT:
          Admin authorization must always be checked by Flask.
          Frontend filters are only for display and are NOT security.
        */}

      </section>

    </main>
  )
}

export default AdminComplaints