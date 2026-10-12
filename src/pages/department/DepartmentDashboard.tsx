import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PortalNavbar from '../../components/common/PortalNavbar'
import StatusBadge from '../../components/common/StatusBadge'
import EmptyState from '../../components/common/EmptyState'

type ComplaintStatus =
  | 'Submitted'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Rejected'

interface DepartmentComplaint {
  id: string
  title: string
  category: string
  location: string
  status: ComplaintStatus
  date: string
  department: string
  priority?: string
}

interface DepartmentUser {
  name: string
  email?: string
}

function DepartmentDashboard() {
  const navigate = useNavigate()

  // Read stored department user
  const storedDepartment = localStorage.getItem('departmentUser')
  let departmentUser: DepartmentUser | null = null

  if (storedDepartment) {
    try {
      departmentUser = JSON.parse(storedDepartment)
    } catch {
      localStorage.removeItem('departmentUser')
    }
  }

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Empty state pending MySQL records
  const [complaints] = useState<DepartmentComplaint[]>([])

  const deptName = departmentUser?.name || 'Municipal Department'

  const filteredComplaints = useMemo(() => {
    return complaints.filter((item) => {
      const matchesSearch =
        !search.trim() ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase()) ||
        item.location.toLowerCase().includes(search.toLowerCase())

      const matchesStatus =
        statusFilter === 'all' || item.status.toLowerCase().replace(' ', '-') === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [complaints, search, statusFilter])

  // Not logged in gate
  if (!departmentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg border border-slate-200">
          <div className="text-4xl mb-3">🏛️</div>
          <h1 className="text-xl font-bold text-slate-900">Department Portal Sign In Required</h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
            Please sign in with authorized department credentials to review assigned municipal work orders.
          </p>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="mt-6 w-full rounded-xl bg-blue-700 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 transition"
          >
            Go to Department Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <PortalNavbar
        role="department"
        userName={deptName}
        userSubtitle={departmentUser.email || 'Field Maintenance Supervisor'}
      />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {/* Banner */}
        <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-6 sm:p-8 text-white shadow-lg mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-400/30">
                Department Operations Desk
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {deptName}
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-xl">
                Field queue for assigned civic work orders. Inspect reported defects, dispatch repair crews, update status notes, and upload verified completion photos.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-xs font-semibold text-white inline-flex items-center gap-2">
                <span>📍</span> Assigned Sector Active
              </span>
            </div>
          </div>
        </div>

        {/* Work Order KPI Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Assigned Orders', val: 0, sub: 'Total assigned cases', color: 'text-slate-900', icon: '📋' },
            { label: 'Pending Action', val: 0, sub: 'Awaiting site inspection', color: 'text-purple-600', icon: '⏳' },
            { label: 'In Progress', val: 0, sub: 'Crews dispatched on-site', color: 'text-amber-600', icon: '🛠️' },
            { label: 'Resolved & Closed', val: 0, sub: 'Completed this month', color: 'text-emerald-600', icon: '✅' },
          ].map((st) => (
            <div key={st.label} className="civic-card-hover rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{st.label}</span>
                <span className="text-lg">{st.icon}</span>
              </div>
              <p className={`mt-3 text-3xl font-extrabold ${st.color}`}>{st.val}</p>
              <p className="mt-1 text-[11px] text-slate-400">{st.sub}</p>
            </div>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm mb-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 text-sm">
                🔍
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search work orders by ID, location, or issue description..."
                className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {[
                { id: 'all', label: 'All Orders' },
                { id: 'assigned', label: 'Assigned' },
                { id: 'in-progress', label: 'In Progress' },
                { id: 'resolved', label: 'Resolved' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                    statusFilter === tab.id
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Work Order Records or Empty State */}
        {filteredComplaints.length > 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Title & Description</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Date Logged</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredComplaints.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-mono font-bold text-emerald-700">
                        #{item.id}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900 max-w-xs truncate">
                        {item.title}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600">
                        📍 {item.location}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">
                        {item.date}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={item.status} size="sm" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => navigate(`/department/complaint/${item.id}`)}
                          className="rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition"
                        >
                          Manage Work Order →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked View */}
            <div className="md:hidden divide-y divide-slate-100 p-4 space-y-4">
              {filteredComplaints.map((item) => (
                <div key={item.id} className="pt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-700">
                      #{item.id}
                    </span>
                    <StatusBadge status={item.status} size="sm" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-500">📍 {item.location}</p>
                  <button
                    type="button"
                    onClick={() => navigate(`/department/complaint/${item.id}`)}
                    className="w-full mt-2 rounded-lg bg-emerald-50 border border-emerald-200 py-2 text-xs font-semibold text-emerald-800 text-center"
                  >
                    Manage Work Order →
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            icon="🛠️"
            title="Department Queue is Up to Date"
            description={`There are currently zero open work orders assigned to the ${deptName}. Newly routed tickets from the administrative triage console will appear here.`}
            actionLabel={search || statusFilter !== 'all' ? 'Reset Filters' : undefined}
            onAction={() => {
              setSearch('')
              setStatusFilter('all')
            }}
          />
        )}
      </main>
    </div>
  )
}

export default DepartmentDashboard