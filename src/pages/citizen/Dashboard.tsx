import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PortalNavbar from '../../components/common/PortalNavbar'
import EmptyState from '../../components/common/EmptyState'
import StatusBadge from '../../components/common/StatusBadge'
import { useAuth } from '../../context/AuthContext'
import { api, type Complaint } from '../../api/client'

function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const [showProfile, setShowProfile] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const loadData = async () => {
    setIsLoading(true)
    setFetchError(null)
    try {
      const data = await api.complaints.getMyComplaints()
      setComplaints(data)
    } catch (err: any) {
      setFetchError(err.message || 'Unable to retrieve complaint records from the server.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const userName = user?.name || 'Citizen Resident'
  const userEmail = user?.email || 'citizen@civicresolve.com'

  // Derive genuine counts directly from the database response
  const totalSubmitted = complaints.length
  const pendingCount = complaints.filter((c) => c.status === 'Pending').length
  const inProgressCount = complaints.filter((c) => c.status === 'In Progress' || c.status === 'Approved').length
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length

  const stats = [
    { label: 'Total Submitted', value: totalSubmitted, subtext: 'Lifetime reported issues', color: 'text-slate-900', icon: '📝' },
    { label: 'Pending Review', value: pendingCount, subtext: 'Awaiting admin triage', color: 'text-purple-600', icon: '⏳' },
    { label: 'In Progress', value: inProgressCount, subtext: 'Department field action', color: 'text-amber-600', icon: '🛠️' },
    { label: 'Resolved & Closed', value: resolvedCount, subtext: 'Verified completions', color: 'text-emerald-600', icon: '✅' },
  ]

  // Show up to 3 most recent complaints
  const recentComplaints = complaints.slice(0, 3)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <PortalNavbar role="citizen" userName={userName} userSubtitle={userEmail} />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {/* Welcome Banner */}
        <div className="rounded-2xl border border-blue-200/80 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 p-6 sm:p-8 text-white shadow-lg shadow-blue-900/10 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600/60 px-3 py-1 text-xs font-semibold text-blue-100 border border-blue-400/30">
                Citizen Self-Service Hub
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome, {userName}
              </h1>
              <p className="text-sm sm:text-base text-blue-100/90 max-w-xl">
                Report local civic defects, track live department updates, and verify work quality directly from your dashboard.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/report-issue')}
                className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-800 shadow-md hover:bg-blue-50 transition active:scale-[0.98] inline-flex items-center gap-2"
              >
                <span>➕</span> Report an Issue
              </button>

              <button
                type="button"
                onClick={() => setShowNotifications(true)}
                className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/20 transition inline-flex items-center gap-2"
              >
                <span>🔔</span> Notifications
              </button>

              <button
                type="button"
                onClick={() => setShowProfile(true)}
                className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/20 transition inline-flex items-center gap-2"
              >
                <span>👤</span> Profile
              </button>
            </div>
          </div>
        </div>

        {/* Server Fetch Error Alert */}
        {fetchError && (
          <div className="mb-8 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="text-sm font-bold">Failed to Synchronize Records</h3>
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
                  {isLoading ? '...' : s.value}
                </p>
                <p className="mt-1 text-xs text-slate-400">{s.subtext}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Access Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700 text-2xl mb-4">
                📸
              </div>
              <h2 className="text-lg font-bold text-slate-900">New Issue Submission</h2>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Spot a pothole, pipeline leak, or broken streetlight? Report it with photos and GPS coordinates.
              </p>
            </div>
            <Link
              to="/report-issue"
              className="mt-5 inline-flex items-center justify-center rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 transition"
            >
              Launch Submission Wizard →
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 text-2xl mb-4">
                📋
              </div>
              <h2 className="text-lg font-bold text-slate-900">My Complaints History</h2>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Review all your active and historical grievances, department remarks, and verification stages.
              </p>
            </div>
            <Link
              to="/my-complaints"
              className="mt-5 inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              View All Complaints ({totalSubmitted}) →
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 text-2xl mb-4">
                🏛️
              </div>
              <h2 className="text-lg font-bold text-slate-900">Municipal Guidelines</h2>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Understand municipal resolution timelines, emergency protocols, and supported complaint categories.
              </p>
            </div>
            <a
              href="/#how-it-works"
              className="mt-5 inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Learn More →
            </a>
          </div>
        </div>

        {/* Recent Complaints Section */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recent Complaints</h2>
              <p className="text-xs text-slate-500">Live status of your submitted civic grievances</p>
            </div>
            {complaints.length > 0 && (
              <Link
                to="/my-complaints"
                className="text-xs sm:text-sm font-semibold text-blue-700 hover:underline"
              >
                View Full History ({totalSubmitted}) →
              </Link>
            )}
          </div>

          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-blue-600 border-t-transparent mb-2" />
              <p className="text-xs">Loading complaint records...</p>
            </div>
          ) : recentComplaints.length > 0 ? (
            <div className="space-y-3">
              {recentComplaints.map((c) => (
                <div
                  key={c.complaint_id}
                  className="civic-card-hover rounded-xl border border-slate-200 p-4.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5 bg-slate-50/50 hover:bg-white transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700">
                        #{c.complaint_id}
                      </span>
                      <StatusBadge status={c.status} size="sm" />
                      <span className="text-[11px] text-slate-400">
                        {new Date(c.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{c.title}</h3>
                    <p className="text-xs text-slate-500">
                      📂 {c.category_name} {c.subcategory_name ? `• ${c.subcategory_name}` : ''} {c.address ? `• 📍 ${c.address}` : ''}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(`/complaint/${c.complaint_id}`)}
                    className="self-start sm:self-auto rounded-lg border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition whitespace-nowrap"
                  >
                    View Timeline →
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="📭"
              title="No Active Complaints Found"
              description="You have not submitted any civic complaints yet. When you report an infrastructure defect, its real-time progress and departmental updates will appear here."
              actionLabel="Report Your First Issue"
              onAction={() => navigate('/report-issue')}
            />
          )}
        </section>
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
              <h3 className="text-lg font-bold text-slate-900">Notifications</h3>
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
              <p className="mt-2 text-sm font-bold text-slate-800">
                {totalSubmitted > 0 ? `${totalSubmitted} Active Complaints Monitored` : 'All Caught Up'}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                You will receive alerts here when the administration assigns your complaints or departments post updates.
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
              <h3 className="text-lg font-bold text-slate-900">Citizen Profile</h3>
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
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-700 text-white font-bold text-lg">
                  {userName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{userName}</p>
                  <p className="text-xs text-slate-500">{userEmail}</p>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-2 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                <p><strong>Account Role:</strong> Registered Citizen</p>
                <p><strong>Total Submissions:</strong> {totalSubmitted}</p>
                <p><strong>Database ID:</strong> #{user?.user_id}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
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

export default Dashboard