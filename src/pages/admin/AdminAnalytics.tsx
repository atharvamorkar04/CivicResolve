import { useState, useEffect } from 'react'
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
  ResponsiveContainer,
} from 'recharts'
import PortalNavbar from '../../components/common/PortalNavbar'
import { api, type Complaint, type AdminMetrics } from '../../api/client'

function AdminAnalytics() {
  const navigate = useNavigate()
  const [timeRange, setTimeRange] = useState('30d')

  const [metrics, setMetrics] = useState<AdminMetrics>({
    total: 0,
    pending: 0,
    approved: 0,
    in_progress: 0,
    resolved: 0,
    rejected: 0,
  })
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true)
      try {
        const res = await api.admin.getComplaints()
        setMetrics(res.metrics)
        setComplaints(res.complaints)
      } catch {
        // Handled via zero states
      } finally {
        setIsLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  // 1. Category Data derived from real complaint records
  const categoryMap: Record<string, number> = {}
  complaints.forEach((c) => {
    const cat = c.category_name || 'General'
    categoryMap[cat] = (categoryMap[cat] || 0) + 1
  })
  const categoryData = Object.entries(categoryMap).map(([name, complaints]) => ({ name, complaints }))

  // 2. Status Breakdown
  const statusData = [
    { name: 'Pending', value: metrics.pending },
    { name: 'Approved', value: metrics.approved },
    { name: 'In Progress', value: metrics.in_progress },
    { name: 'Resolved', value: metrics.resolved },
    { name: 'Rejected', value: metrics.rejected },
  ].filter((s) => s.value > 0)

  // 3. Department Data
  const deptMap: Record<string, number> = {}
  complaints.forEach((c) => {
    const dept = c.department_name || 'Unassigned'
    deptMap[dept] = (deptMap[dept] || 0) + 1
  })
  const departmentData = Object.entries(deptMap).map(([name, complaints]) => ({ name, complaints }))

  // 4. Monthly Trend Data
  const monthMap: Record<string, number> = {}
  complaints.forEach((c) => {
    const month = new Date(c.created_at).toLocaleString('default', { month: 'short' })
    monthMap[month] = (monthMap[month] || 0) + 1
  })
  const monthlyData = Object.entries(monthMap).map(([month, complaints]) => ({ month, complaints }))

  const resolutionRate =
    metrics.total > 0 ? Math.round((metrics.resolved / metrics.total) * 100) : 0

  const summaryMetrics = [
    { label: 'Total Received', value: String(metrics.total), sub: 'Across all municipal wards', color: 'text-slate-900' },
    { label: 'Resolution Rate', value: `${resolutionRate}%`, sub: 'Verified completed', color: 'text-emerald-600' },
    { label: 'In Progress', value: String(metrics.in_progress + metrics.approved), sub: 'Field teams deployed', color: 'text-amber-600' },
    { label: 'Pending Triage', value: String(metrics.pending), sub: 'Awaiting admin review', color: 'text-purple-600' },
  ]

  const STATUS_COLORS = ['#8b5cf6', '#3b82f6', '#f59e0b', '#10b981', '#ef4444']

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <PortalNavbar role="admin" userName="Municipal Administrator" userSubtitle="Analytics Cockpit" />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              City-Wide Grievance Analytics
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Data-driven insights to monitor department performance, resolve recurring civic bottlenecks, and track turnaround speed.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none transition focus:border-purple-600"
            >
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="ytd">Year to Date (2026)</option>
            </select>

            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              ← Dashboard
            </button>
          </div>
        </div>

        {/* 4 KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {summaryMetrics.map((m) => (
            <div key={m.label} className="civic-card-hover rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{m.label}</span>
              <p className={`mt-3 text-3xl font-extrabold ${m.color}`}>
                {isLoading ? '...' : m.value}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">{m.sub}</p>
            </div>
          ))}
        </div>

        {/* 4 Analytics Charts Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Chart 1: Categories */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-base font-bold text-slate-900">Complaints by Category</h2>
                <span className="text-xs text-slate-400 font-medium">Distribution</span>
              </div>
              <p className="text-xs text-slate-500 mb-6">Distribution across municipal infrastructure sectors</p>
            </div>

            {categoryData.length > 0 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="complaints" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-56 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 flex flex-col items-center justify-center p-6 text-center">
                <span className="text-2xl mb-1.5">📊</span>
                <p className="text-xs font-bold text-slate-700">No Category Records Yet</p>
                <p className="text-[11px] text-slate-400 max-w-xs mt-0.5">
                  Visual bar charts will render automatically once complaints are stored in the MySQL database.
                </p>
              </div>
            )}
          </div>

          {/* Chart 2: Status Breakdown */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-base font-bold text-slate-900">Resolution Status Breakdown</h2>
                <span className="text-xs text-slate-400 font-medium">Lifecycle</span>
              </div>
              <p className="text-xs text-slate-500 mb-6">Proportion of pending, in-progress, and resolved cases</p>
            </div>

            {statusData.length > 0 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(Number(percent || 0) * 100).toFixed(0)}%`}>
                      {statusData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-56 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 flex flex-col items-center justify-center p-6 text-center">
                <span className="text-2xl mb-1.5">🥧</span>
                <p className="text-xs font-bold text-slate-700">No Status Records Yet</p>
                <p className="text-[11px] text-slate-400 max-w-xs mt-0.5">
                  Status pie charts will display live proportion breakdown once complaints are triaged.
                </p>
              </div>
            )}
          </div>

          {/* Chart 3: Monthly Trends */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-base font-bold text-slate-900">Monthly Submission Trends</h2>
                <span className="text-xs text-slate-400 font-medium">Timeline</span>
              </div>
              <p className="text-xs text-slate-500 mb-6">Historical complaint reporting volume over time</p>
            </div>

            {monthlyData.length > 0 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="complaints" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-56 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 flex flex-col items-center justify-center p-6 text-center">
                <span className="text-2xl mb-1.5">📈</span>
                <p className="text-xs font-bold text-slate-700">No Trend History Yet</p>
                <p className="text-[11px] text-slate-400 max-w-xs mt-0.5">
                  Monthly velocity curves will plot complaint volume as issues are submitted over coming months.
                </p>
              </div>
            )}
          </div>

          {/* Chart 4: Department Workload */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-base font-bold text-slate-900">Department Workload Allocation</h2>
                <span className="text-xs text-slate-400 font-medium">Operations</span>
              </div>
              <p className="text-xs text-slate-500 mb-6">Total open cases assigned across municipal field departments</p>
            </div>

            {departmentData.length > 0 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="complaints" fill="#059669" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-56 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 flex flex-col items-center justify-center p-6 text-center">
                <span className="text-2xl mb-1.5">🏛️</span>
                <p className="text-xs font-bold text-slate-700">No Department Workload Yet</p>
                <p className="text-[11px] text-slate-400 max-w-xs mt-0.5">
                  Comparative workload bars will render dynamically after administration allocates tickets.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminAnalytics