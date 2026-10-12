import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

type PortalRole = 'citizen' | 'admin' | 'department'

const DEPARTMENT_OPTIONS = [
  'Road & Infrastructure',
  'Water Supply & Sanitation',
  'Electrical & Street Lighting',
  'Solid Waste Management',
  'Drainage & Sewage',
  'Parks & Public Gardens',
  'Public Safety & Health',
]

function Login() {
  const navigate = useNavigate()

  const [selectedRole, setSelectedRole] = useState<PortalRole>('citizen')
  const [selectedDept, setSelectedDept] = useState(DEPARTMENT_OPTIONS[0])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [infoNotice, setInfoNotice] = useState<string | null>(null)

  const handleRoleChange = (role: PortalRole) => {
    setSelectedRole(role)
    setError('')
    setInfoNotice(null)
  }

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setInfoNotice(null)

    const trimmedEmail = email.trim()

    if (!trimmedEmail || !password) {
      setError('Please enter both your email address and password.')
      return
    }

    // NOTICE AS PER PHASE 2 SPECIFICATION:
    // Real authentication with PHP + MySQL database is scheduled for Phase 3.
    // Client-side authentication simulation is clearly separated.
    localStorage.setItem('userRole', selectedRole)
    if (selectedRole === 'department') {
      localStorage.setItem(
        'departmentUser',
        JSON.stringify({ name: selectedDept, email: trimmedEmail })
      )
    }

    setInfoNotice(
      `Notice: Authentication backend connection is scheduled for Phase 3. Entering ${selectedRole} portal in interface evaluation mode.`
    )

    setTimeout(() => {
      if (selectedRole === 'citizen') {
        navigate('/dashboard')
      } else if (selectedRole === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/department/dashboard')
      }
    }, 600)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/20 to-slate-100 text-slate-900 flex flex-col justify-between">
      {/* Top Navigation */}
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 sm:py-4">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-blue-700 hover:text-blue-800 transition"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-white shadow-sm shadow-blue-500/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.432z" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Civic<span className="text-blue-700">Resolve</span>
              </span>
              <p className="text-[11px] text-slate-500 leading-none">
                Municipal Grievance Platform
              </p>
            </div>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-700 transition px-3 py-1.5 rounded-lg hover:bg-slate-100"
          >
            <span>←</span> Back to Landing Page
          </Link>
        </div>
      </header>

      {/* Main Login Area */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md animate-fade-in">
          {/* Card Container */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50">
            {/* Header info */}
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-700/10 mb-3">
                Authorized Access
              </span>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Sign In to CivicResolve
              </h1>
              <p className="mt-1.5 text-sm text-slate-500">
                Select your designated portal role to continue
              </p>
            </div>

            {/* Role Switcher Tabs */}
            <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1 mb-6 text-xs sm:text-sm font-medium">
              <button
                type="button"
                onClick={() => handleRoleChange('citizen')}
                className={`py-2 px-2 rounded-lg text-center transition ${
                  selectedRole === 'citizen'
                    ? 'bg-white font-semibold text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Citizen
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={`py-2 px-2 rounded-lg text-center transition ${
                  selectedRole === 'admin'
                    ? 'bg-white font-semibold text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('department')}
                className={`py-2 px-2 rounded-lg text-center transition ${
                  selectedRole === 'department'
                    ? 'bg-white font-semibold text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Department
              </button>
            </div>

            {/* Role Context Helper */}
            <div className="mb-5 rounded-lg bg-slate-50 p-3 text-xs text-slate-600 border border-slate-200/60 flex items-start gap-2">
              <span className="text-blue-600 font-bold">ℹ</span>
              <div>
                {selectedRole === 'citizen' && (
                  <p>
                    <strong>Citizen Portal:</strong> Submit civic grievances, upload photo evidence, and track real-time resolution progress.
                  </p>
                )}
                {selectedRole === 'admin' && (
                  <p>
                    <strong>Municipal Admin Portal:</strong> Verify reported issues, triage priority, allocate to departments, and review city-wide analytics.
                  </p>
                )}
                {selectedRole === 'department' && (
                  <p>
                    <strong>Department Portal:</strong> Review assigned work orders, update field repair milestones, and attach resolution documentation.
                  </p>
                )}
              </div>
            </div>

            {/* Department Selection for Department Role */}
            {selectedRole === 'department' && (
              <div className="mb-4">
                <label
                  htmlFor="department-select"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Municipal Department
                </label>
                <select
                  id="department-select"
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                >
                  {DEPARTMENT_OPTIONS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    selectedRole === 'citizen'
                      ? 'citizen@example.com'
                      : selectedRole === 'admin'
                      ? 'admin@civicresolve.gov'
                      : 'official@civicresolve.gov'
                  }
                  required
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  {error}
                </div>
              )}

              {/* Informative Notice */}
              {infoNotice && (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs text-blue-700">
                  {infoNotice}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-700/20 hover:bg-blue-800 transition active:scale-[0.99]"
              >
                Sign In to {selectedRole === 'citizen' ? 'Citizen' : selectedRole === 'admin' ? 'Admin' : 'Department'} Portal
              </button>
            </form>

            {/* Registration Link for Citizens */}
            {selectedRole === 'citizen' && (
              <div className="mt-6 border-t border-slate-100 pt-5 text-center">
                <p className="text-xs text-slate-500">
                  Don't have an account yet?{' '}
                  <Link
                    to="/register"
                    className="font-semibold text-blue-700 hover:text-blue-800 hover:underline"
                  >
                    Register as a Citizen
                  </Link>
                </p>
              </div>
            )}

            {/* Phase Notice */}
            <div className="mt-5 rounded-lg bg-amber-50/80 p-3 text-[11px] text-amber-800 border border-amber-200/60 leading-relaxed">
              <span className="font-semibold">Development Notice:</span> Real credential verification and JWT session tokens will be connected to the PHP REST API & MySQL database in Phase 3.
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <p>© 2026 CivicResolve. A Digital Platform for Civic Issue Management.</p>
      </footer>
    </main>
  )
}

export default Login
