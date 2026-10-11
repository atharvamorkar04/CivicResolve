import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleRegister = () => {
    setError('')

    // FRONTEND VALIDATION:
    // These checks improve the user experience by preventing empty
    // or invalid form submission.
    //
    // BACKEND TODO:
    // The Flask backend MUST perform the same validation again.
    // Never depend only on React validation because users can bypass
    // frontend validation and directly call the API.

    if (
      !fullName.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError('Please fill in all fields.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    // ---------------------------------------------------------
    // BACKEND TODO: CITIZEN REGISTRATION
    // ---------------------------------------------------------
    //
    // Currently the registered user is stored in localStorage
    // only for frontend demonstration.
    //
    // Replace this localStorage code with a Flask API request.
    //
    // Suggested API:
    // POST /api/auth/register
    //
    // Send the following data:
    // {
    //   fullName,
    //   email,
    //   password,
    //   role: "citizen"
    // }
    //
    // IMPORTANT:
    // React should NOT connect directly to MySQL.
    //
    // Correct flow:
    //
    // React Register Page
    //        ↓
    // Flask API
    //        ↓
    // Validate input
    //        ↓
    // Check email already exists
    //        ↓
    // Hash password
    //        ↓
    // Save user in MySQL
    //        ↓
    // Return success response
    //
    // Suggested MySQL table:
    //
    // users
    // ---------------------------------------------------------
    // user_id       PRIMARY KEY
    // full_name
    // email         UNIQUE
    // password_hash
    // role
    // created_at
    // ---------------------------------------------------------
    //
    // New public registrations should always receive:
    // role = "citizen"
    //
    // Admin and Department accounts should NOT be created
    // through this public registration page.

    // BACKEND TODO: EMAIL DUPLICATE CHECK
    //
    // Before inserting the new citizen:
    // SELECT user_id FROM users WHERE email = ?
    //
    // If the email already exists, return an error such as:
    // "An account with this email already exists."
    //
    // The email column should have a UNIQUE constraint in MySQL
    // so duplicate accounts cannot be created accidentally.

    // BACKEND TODO: PASSWORD SECURITY
    //
    // Never store the user's password directly in MySQL.
    //
    // Current frontend demo stores the password in localStorage,
    // but this is ONLY temporary and must be removed when backend
    // authentication is connected.
    //
    // Flask backend should hash the password before storing it.
    //
    // Example concept:
    // password -> password_hash -> MySQL
    //
    // During login:
    // entered password -> compare with stored password hash
    //
    // Do NOT return password_hash to the frontend.

    // New public registrations are Citizen accounts.
    //
    // FRONTEND DEMO ONLY:
    // This localStorage data will later be replaced by the
    // successful response from the Flask registration API.
    localStorage.setItem('registeredUser', JSON.stringify({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: 'citizen',
    }))

    // BACKEND TODO:
    // After successful registration through Flask:
    // 1. Backend saves the citizen in MySQL.
    // 2. Backend returns a success response.
    // 3. Frontend can redirect the user to the login page.
    //
    // Example response:
    // {
    //   success: true,
    //   message: "Citizen account created successfully."
    // }

    // Go back to LandingPage after registration.
    navigate('/')
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-700">
            CivicResolve
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            A Digital Platform for Civic Issue Management
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/60">

          <div className="mb-7">
            <h2 className="text-2xl font-bold text-slate-900">
              Create Account
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Register as a citizen to report and track civic issues.
            </p>
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Full Name
            </label>

            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Confirm Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleRegister}
            className="w-full rounded-lg bg-blue-700 py-3.5 font-semibold text-white shadow-md transition hover:bg-blue-800"
          >
            Create Account
          </button>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/')}
              className="font-semibold text-blue-700 hover:text-blue-800"
            >
              Sign In
            </button>
          </p>

        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          © 2026 CivicResolve • Civic Issue Management Platform
        </p>

      </div>
    </main>
  )
}

export default Register