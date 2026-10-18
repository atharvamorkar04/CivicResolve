import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    const trimmedEmail = email.trim()

    if (!trimmedEmail || !password) {
      setError('Please enter both your email address and password.')
      return
    }

    setIsSubmitting(true)

    try {
      const user = await login(trimmedEmail, password)

      // Direct to corresponding portal based on verified account role
      if (user.role === 'citizen') {
        navigate('/dashboard')
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard')
      } else if (user.role === 'department') {
        navigate('/department/dashboard')
      } else {
        navigate('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
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
                Enter your credentials to access your designated portal
              </p>
            </div>

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
                  placeholder="Enter your email (e.g. name@civicresolve.com)"
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-700/20 hover:bg-blue-800 transition active:scale-[0.99] disabled:opacity-50"
              >
                {isSubmitting ? 'Authenticating...' : 'Sign In to Portal'}
              </button>
            </form>

            {/* Registration Link for Citizens */}
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
