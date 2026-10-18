import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

interface PortalNavbarProps {
  role: 'citizen' | 'admin' | 'department'
  userName?: string
  userSubtitle?: string
}

export const PortalNavbar: React.FC<PortalNavbarProps> = ({
  role,
  userName,
  userSubtitle,
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await logout()
    } finally {
      navigate('/login')
    }
  }

  const citizenLinks = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Report Issue', path: '/report-issue' },
    { label: 'My Complaints', path: '/my-complaints' },
  ]

  const adminLinks = [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'All Complaints', path: '/admin/complaints' },
    { label: 'Analytics', path: '/admin/analytics' },
  ]

  const departmentLinks = [
    { label: 'Work Orders', path: '/department/dashboard' },
  ]

  const navLinks =
    role === 'citizen'
      ? citizenLinks
      : role === 'admin'
      ? adminLinks
      : departmentLinks

  const roleBadge = {
    citizen: { label: 'Citizen Portal', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    admin: { label: 'Administration', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    department: { label: 'Department Portal', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  }[role]

  const displayName = userName || user?.name || (role === 'admin' ? 'Administrator' : role === 'citizen' ? 'Citizen' : 'Department Officer')
  const displaySubtitle = userSubtitle || user?.email || (role === 'citizen' ? 'Resident Account' : 'Authorized Personnel')

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Left: Logo & Role Badge */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-700 text-white font-bold text-sm shadow-sm">
              CR
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-blue-700 transition">
              Civic<span className="text-blue-700">Resolve</span>
            </span>
          </Link>

          <span
            className={`hidden sm:inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${roleBadge.color}`}
          >
            {roleBadge.label}
          </span>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Right: User details & Sign Out */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-bold text-slate-900 leading-tight">
              {displayName}
            </p>
            <p className="text-[11px] text-slate-500 leading-tight">
              {displaySubtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="hidden sm:inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-rose-600 hover:border-rose-200 transition"
          >
            Sign Out
          </button>

          {/* Mobile hamburger toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            aria-label="Toggle portal menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 shadow-lg animate-fade-in">
          <div className="mb-3 pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-900">
                {displayName}
              </p>
              <p className="text-xs text-slate-500">{roleBadge.label}</p>
            </div>
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${roleBadge.color}`}
            >
              Active Session
            </span>
          </div>

          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                  location.pathname === link.path
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-2 text-xs font-semibold text-slate-600 hover:text-blue-700"
            >
              ← Visit Public Landing Page
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full text-center py-2.5 rounded-lg border border-rose-200 bg-rose-50 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition"
            >
              Sign Out of Portal
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

export default PortalNavbar
