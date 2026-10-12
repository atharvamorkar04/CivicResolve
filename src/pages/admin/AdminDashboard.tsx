import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PortalNavbar from '../../components/common/PortalNavbar'
import EmptyState from '../../components/common/EmptyState'

function AdminDashboard() {
  const navigate = useNavigate()

  const [showProfile, setShowProfile] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  // Executive stats (Zero states until PHP/MySQL connection)
  const stats = [
    { label: 'Total Grievances', value: 0, subtext: 'Received across all wards', color: 'text-slate-900', icon: '📁' },
    { label: 'Pending Review', value: 0, subtext: 'Awaiting triage & allocation', color: 'text-purple-600', icon: '⏳' },
    { label: 'In-Field Progress', value: 0, subtext: 'Assigned to departments', color: 'text-amber-600', icon: '🛠️' },
    { label: 'Resolved Cases', value: 0, subtext: 'Completed & closed', color: 'text-emerald-600', icon: '✅' },
  ]

  const departments = [
    { name: 'Road & Transport', code: 'ROAD', active: 0, icon: '🛣️' },
    { name: 'Water Supply', code: 'WATER', active: 0, icon: '🚰' },
    { name: 'Electrical & Lighting', code: 'ELEC', active: 0, icon: '💡' },
    { name: 'Sanitation & Solid Waste', code: 'SAN', active: 0, icon: '🧹' },
    { name: 'Drainage & Sewage', code: 'DRAIN', active: 0, icon: '🌊' },
    { name: 'Parks & Public Gardens', code: 'PARK', active: 0, icon: '🌳' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <PortalNavbar role="admin" userName="Municipal Administrator" userSubtitle="Administrative Triage Desk" />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {/* Admin Header Banner */}
        <div className="rounded-2xl border border-purple-200/80 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-lg mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300 border border-purple-400/30">
                Municipal Operations Cockpit
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Administration Console
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-xl">
                Oversee incoming citizen grievances, verify urgency, assign responsible municipal engineering teams, and monitor resolution timelines.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/admin/complaints')}
                className="rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-purple-700 transition active:scale-[0.98] inline-flex items-center gap-2"
              >
                <span>📋</span> Complaints Queue
              </button>

              <button
                type="button"
                onClick={() => navigate('/admin/analytics')}
                className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/20 transition inline-flex items-center gap-2"
              >
                <span>📊</span> Analytics
              </button>

              <button
                type="button"
                onClick={() => setShowNotifications(true)}
                className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/20 transition inline-flex items-center gap-2"
              >
                <span>🔔</span> Alerts
              </button>
            </div>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {stats.map((s) => (
            <div
              key={s.label}
              className="civic-card-hover rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {s.label}
                </span>
                <span className="text-xl">{s.icon}</span>
              </div>
              <div className="mt-4">
                <p className={`text-3xl sm:text-4xl font-extrabold ${s.color}`}>
                  {s.value}
                </p>
                <p className="mt-1 text-xs text-slate-400">{s.subtext}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Department Workload Summary Grid */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Department Workload Distribution</h2>
              <p className="text-xs text-slate-500">Live operational assignment overview across municipal departments</p>
            </div>
            <Link
              to="/admin/analytics"
              className="text-xs font-semibold text-blue-700 hover:underline"
            >
              View Analytics →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {departments.map((dept) => (
              <div
                key={dept.code}
                className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 text-center transition hover:bg-white hover:border-blue-300"
              >
                <div className="text-2xl mb-1.5">{dept.icon}</div>
                <p className="text-xs font-bold text-slate-800 line-clamp-1">{dept.name}</p>
                <p className="mt-2 text-xl font-extrabold text-blue-700">{dept.active}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Active Cases</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Triage Queue */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recent Complaints Queue</h2>
              <p className="text-xs text-slate-500">Awaiting administrative verification and department allocation</p>
            </div>
            <Link
              to="/admin/complaints"
              className="text-xs sm:text-sm font-semibold text-blue-700 hover:underline"
            >
              Open Full Complaints Table →
            </Link>
          </div>

          <EmptyState
            icon="🗂️"
            title="Complaints Queue is Clear"
            description="There are currently zero pending complaints awaiting administrative verification in the database. New citizen reports will automatically appear here."
            actionLabel="View All Complaints Records"
            onAction={() => navigate('/admin/complaints')}
          />
        </div>
      </main>

      {/* Notifications Modal */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200 animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Administrative Alerts</h3>
              <button
                type="button"
                onClick={() => setShowNotifications(false)}
                className="text-slate-400 hover:text-slate-600 text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="py-6 text-center">
              <span className="text-3xl">🔔</span>
              <p className="mt-2 text-sm font-bold text-slate-800">No Critical Alerts</p>
              <p className="mt-1 text-xs text-slate-500">
                Department milestone escalations and urgent citizen complaints will appear here in real time.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 text-right">
              <button
                type="button"
                onClick={() => setShowNotifications(false)}
                className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200 animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Administrator Profile</h3>
              <button
                type="button"
                onClick={() => setShowProfile(false)}
                className="text-slate-400 hover:text-slate-600 text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-700 text-white font-bold text-lg">
                  ADM
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Municipal Administrator</p>
                  <p className="text-xs text-slate-500">admin@civicresolve.gov</p>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-2 p-3 bg-purple-50/50 rounded-xl border border-purple-100">
                <p><strong>Designation:</strong> Chief Grievance Redressal Coordinator</p>
                <p><strong>Privilege Scope:</strong> Triage, Department Allocation, City Analytics</p>
                <p><strong>Authentication:</strong> Scheduled for Phase 4 (PHP + MySQL session)</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowProfile(false)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard