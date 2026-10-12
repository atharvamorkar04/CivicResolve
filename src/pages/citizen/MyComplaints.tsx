import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import PortalNavbar from '../../components/common/PortalNavbar'
import StatusBadge from '../../components/common/StatusBadge'
import EmptyState from '../../components/common/EmptyState'

interface CitizenComplaint {
  id: string
  title: string
  category: string
  subcategory?: string
  date: string
  status: 'Submitted' | 'Assigned' | 'In Progress' | 'Resolved' | 'Rejected'
  department?: string
  location?: string
}

function MyComplaints() {
  const navigate = useNavigate()

  // State
  const [complaints] = useState<CitizenComplaint[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Filter logic
  const filteredComplaints = useMemo(() => {
    return complaints.filter((item) => {
      const matchesSearch =
        !search.trim() ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase())

      const matchesStatus =
        statusFilter === 'all' || item.status.toLowerCase().replace(' ', '-') === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [complaints, search, statusFilter])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <PortalNavbar role="citizen" />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {/* Header banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Complaints
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Track the progress, departmental notes, and verified closure of your reported civic issues.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/report-issue')}
            className="self-start sm:self-auto rounded-xl bg-blue-700 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-blue-800 transition active:scale-[0.98] inline-flex items-center gap-1.5"
          >
            <span>➕</span> Report New Issue
          </button>
        </div>

        {/* Search & Status Filters */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 text-sm">
                🔍
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by complaint ID, title, or category..."
                className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {[
                { id: 'all', label: 'All Complaints' },
                { id: 'submitted', label: 'Submitted' },
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
                      ? 'bg-blue-700 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Complaint Records List or Empty State */}
        {filteredComplaints.length > 0 ? (
          <div className="space-y-4">
            {filteredComplaints.map((item) => (
              <div
                key={item.id}
                className="civic-card-hover rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-xs font-bold text-blue-700 font-mono">
                      #{item.id}
                    </span>
                    <StatusBadge status={item.status} size="sm" />
                    <span className="text-[11px] text-slate-400">
                      Reported: {item.date}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {item.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-700 font-medium">
                      📂 {item.category}
                    </span>
                    {item.department && (
                      <span className="rounded bg-blue-50 px-2 py-0.5 text-blue-700 font-medium">
                        🏛️ {item.department}
                      </span>
                    )}
                    {item.location && (
                      <span className="text-slate-500">
                        📍 {item.location}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/complaint/${item.id}`)}
                  className="self-start md:self-auto rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition whitespace-nowrap"
                >
                  View Details & Status →
                </button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="📭"
            title={search || statusFilter !== 'all' ? 'No Matching Complaints' : 'No Complaints Recorded'}
            description={
              search || statusFilter !== 'all'
                ? 'No issues match your active search and filter parameters. Try clearing the search query or selecting a different status filter.'
                : 'You have not submitted any civic complaints yet. Issues you report through the submission wizard will be tracked here with live department milestones.'
            }
            actionLabel="Report a New Issue"
            onAction={() => navigate('/report-issue')}
            secondaryActionLabel={search || statusFilter !== 'all' ? 'Reset Filters' : undefined}
            onSecondaryAction={() => {
              setSearch('')
              setStatusFilter('all')
            }}
          />
        )}
      </main>
    </div>
  )
}

export default MyComplaints