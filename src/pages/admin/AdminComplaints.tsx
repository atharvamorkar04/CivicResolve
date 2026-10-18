import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PortalNavbar from '../../components/common/PortalNavbar'
import StatusBadge from '../../components/common/StatusBadge'
import EmptyState from '../../components/common/EmptyState'
import { api, type Complaint, type Department } from '../../api/client'

function AdminComplaints() {
  const navigate = useNavigate()

  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState<number | 'all'>('all')

  const loadData = async () => {
    setIsLoading(true)
    setFetchError(null)
    try {
      const [complaintsRes, depts] = await Promise.all([
        api.admin.getComplaints(),
        api.departments.get(),
      ])
      setComplaints(complaintsRes.complaints)
      setDepartments(depts)
    } catch (err: any) {
      setFetchError(err.message || 'Failed to fetch complaints records.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredComplaints = useMemo(() => {
    const searchText = search.trim().toLowerCase()

    return complaints.filter((complaint) => {
      const matchesSearch =
        !searchText ||
        String(complaint.complaint_id).includes(searchText) ||
        complaint.title.toLowerCase().includes(searchText) ||
        (complaint.citizen_name && complaint.citizen_name.toLowerCase().includes(searchText)) ||
        (complaint.address && complaint.address.toLowerCase().includes(searchText))

      const matchesStatus =
        statusFilter === 'all' ||
        complaint.status.toLowerCase().replace(' ', '-') === statusFilter

      const matchesDepartment =
        departmentFilter === 'all' ||
        complaint.department_id === Number(departmentFilter)

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
              Verify citizen grievances, adjust priorities, and assign responsible departments across all urban wards.
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

        {/* Error Banner */}
        {fetchError && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs sm:text-sm text-rose-800 flex items-center justify-between gap-4">
            <div>
              <strong>Error Loading Data:</strong> {fetchError}
            </div>
            <button
              type="button"
              onClick={loadData}
              className="rounded-lg bg-rose-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-800"
            >
              Retry
            </button>
          </div>
        )}

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
                placeholder="Search by ID, title, citizen name, or address..."
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
                <option value="pending">Pending (New)</option>
                <option value="approved">Approved</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Department Filter (Loaded dynamically from MySQL) */}
            <div className="md:col-span-3">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
              >
                <option value="all">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.department_id} value={dept.department_id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Complaints Data Table & Mobile Cards */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-600 border-t-transparent mb-3" />
            <p className="text-xs font-semibold">Loading municipal queue from database...</p>
          </div>
        ) : filteredComplaints.length > 0 ? (
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
                    <tr key={item.complaint_id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-mono font-bold text-purple-700">
                        #{item.complaint_id}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900 max-w-xs truncate">
                        {item.title}
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        {item.category_name}
                      </td>
                      <td className="px-6 py-4 text-slate-700 font-medium text-xs">
                        {item.citizen_name || 'Resident'}
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-xs">
                        {item.department_name ? (
                          <span className="rounded bg-blue-50 px-2 py-0.5 text-blue-700 font-medium">
                            {item.department_name}
                          </span>
                        ) : (
                          <span className="text-amber-600 font-medium">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={item.status} size="sm" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/complaint/${item.complaint_id}`)}
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
                <div key={item.complaint_id} className="pt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-purple-700">
                      #{item.complaint_id}
                    </span>
                    <StatusBadge status={item.status} size="sm" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                  <div className="text-xs text-slate-500 space-y-0.5">
                    <p><strong>Citizen:</strong> {item.citizen_name || 'Resident'}</p>
                    <p><strong>Department:</strong> {item.department_name || 'Unassigned'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/complaint/${item.complaint_id}`)}
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
                ? 'No complaint records match your active search and filter settings. Try resetting the filters to view the full queue.'
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