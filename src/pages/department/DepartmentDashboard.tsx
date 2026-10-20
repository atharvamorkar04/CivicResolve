import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PortalNavbar from '../../components/common/PortalNavbar'
import StatusBadge from '../../components/common/StatusBadge'
import EmptyState from '../../components/common/EmptyState'
import { useAuth } from '../../context/AuthContext'
import { api, type Complaint, type DepartmentMetrics } from '../../api/client'

function DepartmentDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [metrics, setMetrics] = useState<DepartmentMetrics>({
    total: 0,
    pending_action: 0,
    in_progress: 0,
    resolved: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [serverDeptName, setServerDeptName] = useState<string | null>(null)

  const loadData = async () => {
    setIsLoading(true)
    setFetchError(null)
    try {
      const res = await api.department.getComplaints()
      setComplaints(res.complaints)
      setMetrics(res.metrics)
      if (res.department_name) {
        setServerDeptName(res.department_name)
      }
    } catch (err: any) {
      setFetchError(err.message || 'Failed to load department work orders.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const deptName =
    serverDeptName ||
    user?.department_name ||
    'Department Operations'

  const filteredComplaints = useMemo(() => {
    const searchText = search.trim().toLowerCase()

    return complaints.filter((item) => {
      const matchesSearch =
        !searchText ||
        item.title.toLowerCase().includes(searchText) ||
        String(item.complaint_id).includes(searchText) ||
        (item.address && item.address.toLowerCase().includes(searchText))

      const matchesStatus =
        statusFilter === 'all' || item.status.toLowerCase().replace(' ', '-') === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [complaints, search, statusFilter])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <PortalNavbar
        role="department"
        userName={deptName}
        userSubtitle={user?.name || user?.email || 'Operations Desk'}
      />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {/* Banner */}
        <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-6 sm:p-8 text-white shadow-lg mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-400/30">
                {deptName} Desk
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {deptName} Dashboard
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

        {/* Server Fetch Error Alert */}
        {fetchError && (
          <div className="mb-8 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="text-sm font-bold">Failed to Fetch Department Work Orders</h3>
                <p className="text-xs text-rose-700 mt-0.5">{fetchError}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={loadData}
              className="self-start sm:self-auto rounded-xl bg-rose-700 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-800 transition"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Work Order KPI Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Assigned Orders', val: metrics.total, sub: 'Total assigned cases', color: 'text-slate-900', icon: '📋' },
            { label: 'Pending Action', val: metrics.pending_action, sub: 'Awaiting site inspection', color: 'text-purple-600', icon: '⏳' },
            { label: 'In Progress', val: metrics.in_progress, sub: 'Crews dispatched on-site', color: 'text-amber-600', icon: '🛠️' },
            { label: 'Resolved & Closed', val: metrics.resolved, sub: 'Completed this period', color: 'text-emerald-600', icon: '✅' },
          ].map((st) => (
            <div key={st.label} className="civic-card-hover rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{st.label}</span>
                <span className="text-lg">{st.icon}</span>
              </div>
              <p className={`mt-3 text-3xl font-extrabold ${st.color}`}>
                {isLoading ? '...' : st.val}
              </p>
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
                { id: 'approved', label: 'Approved (Pending Action)' },
                { id: 'in-progress', label: 'In Progress' },
                { id: 'resolved', label: 'Resolved' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition ${statusFilter === tab.id
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
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent mb-3" />
            <p className="text-xs font-semibold">Loading assigned work orders...</p>
          </div>
        ) : filteredComplaints.length > 0 ? (
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
                    <tr key={item.complaint_id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-mono font-bold text-emerald-700">
                        #{item.complaint_id}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900 max-w-xs truncate">
                        {item.title}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600">
                        📍 {item.address || 'Location on map'}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={item.status} size="sm" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => navigate(`/department/complaint/${item.complaint_id}`)}
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
                <div key={item.complaint_id} className="pt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-700">
                      #{item.complaint_id}
                    </span>
                    <StatusBadge status={item.status} size="sm" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-500">📍 {item.address || 'Site'}</p>
                  <button
                    type="button"
                    onClick={() => navigate(`/department/complaint/${item.complaint_id}`)}
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
            description={`There are currently zero open work orders matching this filter assigned to the ${deptName}. Newly routed tickets from the administrative triage console will appear here.`}
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