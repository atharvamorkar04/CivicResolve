import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState<string | null>(null)

  // Calculate simple password strength
  const getPasswordStrength = () => {
    if (!password) return { label: 'Empty', percent: 0, color: 'bg-slate-200' }
    if (password.length < 6) return { label: 'Weak', percent: 30, color: 'bg-rose-500' }
    const hasNumbers = /\d/.test(password)
    const hasLetters = /[a-zA-Z]/.test(password)
    if (password.length >= 8 && hasNumbers && hasLetters) {
      return { label: 'Strong', percent: 100, color: 'bg-emerald-500' }
    }
    return { label: 'Medium', percent: 65, color: 'bg-amber-500' }
  }

  const strength = getPasswordStrength()

  const handleRegister = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setNotice(null)

    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please fill in all required fields.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.')
      return
    }

    if (!agreeTerms) {
      setError('Please agree to the civic issue reporting guidelines to proceed.')
      return
    }

    // NOTICE AS PER SPECIFICATIONS:
    // Real registration is handled by the PHP + MySQL backend in Phase 3.
    // Client-side simulation saves non-sensitive display info for demo and informs the user.
    localStorage.setItem(
      'registeredUser',
      JSON.stringify({
        fullName: fullName.trim(),
        email: email.trim(),
        role: 'citizen',
      })
    )

    setNotice(
      'Account registration validated! Backend authentication is scheduled for Phase 3. Redirecting to Citizen Sign In...'
    )

    setTimeout(() => {
      navigate('/login')
    }, 1200)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/20 to-slate-100 text-slate-900 flex flex-col justify-between">
      {/* Top Header */}
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-blue-700 hover:text-blue-800 transition"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-white shadow-sm shadow-blue-500/20">
              <span className="font-bold text-sm">CR</span>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Civic<span className="text-blue-700">Resolve</span>
              </span>
              <p className="text-[11px] text-slate-500 leading-none">
                Citizen Registration
              </p>
            </div>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-700 transition px-3 py-1.5 rounded-lg hover:bg-slate-100"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main Form Container */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg animate-fade-in">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50">
            {/* Header */}
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-700/10 mb-2">
                Public Resident Access
              </span>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Create Citizen Account
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                Register to report neighborhood defects and track live repairs
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label
                  htmlFor="full-name"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Full Name *
                </label>
                <input
                  id="full-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Kulkarni"
                  required
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Phone Number (Optional)
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Password *
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
                  placeholder="At least 6 characters"
                  required
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />

                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-500">Security Strength:</span>
                      <span className="font-semibold text-slate-700">{strength.label}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${strength.color} transition-all duration-300`}
                        style={{ width: `${strength.percent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Confirm Password *
                </label>
                <input
                  id="confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  required
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Guidelines Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>
                    I agree to provide accurate civic issue details and adhere to municipal reporting guidelines.
                  </span>
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  {error}
                </div>
              )}

              {/* Notice Message */}
              {notice && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
                  {notice}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full rounded-xl bg-blue-700 py-3 text-sm font-semibold text-white shadow-md shadow-blue-700/20 hover:bg-blue-800 transition active:scale-[0.99]"
              >
                Create Account
              </button>
            </form>

            {/* Sign in redirect */}
            <div className="mt-6 border-t border-slate-100 pt-5 text-center">
              <p className="text-xs text-slate-500">
                Already registered?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-blue-700 hover:text-blue-800 hover:underline"
                >
                  Sign In to Portal
                </Link>
              </p>
            </div>

            {/* Development Notice */}
            <div className="mt-5 rounded-lg bg-amber-50/80 p-3 text-[11px] text-amber-800 border border-amber-200/60 leading-relaxed">
              <span className="font-semibold">Backend Notice:</span> MySQL user storage and password hashing will be connected in Phase 3 via the PHP REST API.
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

export default Register