import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PortalNavbar from '../../components/common/PortalNavbar'
import StatusBadge from '../../components/common/StatusBadge'
import EmptyState from '../../components/common/EmptyState'

interface AdminComplaintItem {
  id: string
  title: string
  category: string
  citizen: string
  date: string
  department: string
  status: 'Submitted' | 'Assigned' | 'In Progress' | 'Resolved' | 'Rejected'
}

const DEPARTMENTS = [
  'Road & Infrastructure',
  'Water Supply',
  'Electrical & Street Lighting',
  'Sanitation & Solid Waste',
  'Drainage & Sewage',
  'Parks & Gardens',
  'Public Safety',
]

function AdminComplaints() {
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')

  // Empty state pending database records
  const [complaints] = useState<AdminComplaintItem[]>([])

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
  }, [complaints, search, statusFilter, departmentFilter])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <PortalNavbar role="admin" userName="Municipal Administrator" userSubtitle="Complaints Manager" />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              All Municipal Complaints
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Verify citizen grievances, adjust priorities, and reassign departments across all urban wards.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/admin/dashboard')}
            className="self-start sm:self-auto rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Filters Bar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 text-sm">
                🔍
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by ID, title, or citizen name..."
                className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2 text-sm outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            {/* Status Filter */}
            <div className="md:col-span-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
              >
                <option value="all">All Statuses</option>
                <option value="submitted">Submitted (New)</option>
                <option value="assigned">Assigned</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Department Filter */}
            <div className="md:col-span-3">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
              >
                <option value="all">All Departments</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Complaints Data Table & Mobile Cards */}
        {filteredComplaints.length > 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Complaint Title</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Citizen</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredComplaints.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-mono font-bold text-purple-700">
                        #{item.id}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900 max-w-xs truncate">
                        {item.title}
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 text-slate-700 font-medium text-xs">
                        {item.citizen}
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-xs">
                        {item.department || 'Unassigned'}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={item.status} size="sm" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/complaint/${item.id}`)}
                          className="rounded-lg border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-100 transition"
                        >
                          Review & Triage →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Cards View */}
            <div className="md:hidden divide-y divide-slate-100 p-4 space-y-4">
              {filteredComplaints.map((item) => (
                <div key={item.id} className="pt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-purple-700">
                      #{item.id}
                    </span>
                    <StatusBadge status={item.status} size="sm" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                  <div className="text-xs text-slate-500 space-y-0.5">
                    <p><strong>Citizen:</strong> {item.citizen}</p>
                    <p><strong>Department:</strong> {item.department}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/complaint/${item.id}`)}
                    className="w-full mt-2 rounded-lg bg-purple-50 border border-purple-200 py-2 text-xs font-semibold text-purple-700 text-center"
                  >
                    Review Details →
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            icon="🗂️"
            title={search || statusFilter !== 'all' || departmentFilter !== 'all' ? 'No Matching Complaints' : 'No Complaint Records Found'}
            description={
              search || statusFilter !== 'all' || departmentFilter !== 'all'
                ? 'No complaint records match your active search and filter filters. Try resetting the filters to view the full queue.'
                : 'The MySQL database currently has zero complaint records. When citizens submit issues, they will be listed here for review, verification, and department assignment.'
            }
            actionLabel={search || statusFilter !== 'all' || departmentFilter !== 'all' ? 'Reset All Filters' : undefined}
            onAction={() => {
              setSearch('')
              setStatusFilter('all')
              setDepartmentFilter('all')
            }}
          />
        )}
      </main>
    </div>
  )
}

export default AdminComplaints