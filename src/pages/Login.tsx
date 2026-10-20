import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const redirectState = location.state as { successMessage?: string; email?: string } | null
  const { login } = useAuth()

  const [email, setEmail] = useState(redirectState?.email || '')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(redirectState?.successMessage || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')

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
            className="flex items-center group transition"
          >
            <img
              src="/logo.png"
              alt="CivicResolve"
              className="h-12 sm:h-14 md:h-16 w-auto object-contain transition-transform group-hover:scale-[1.02]"
            />
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

              {/* Registration Success Notification */}
              {success && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-fade-in">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{success}</span>
                </div>
              )}

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
