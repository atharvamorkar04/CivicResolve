import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

function LandingPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    const enteredEmail = email.trim().toLowerCase()

    // BACKEND TODO:
    // Currently, login information is stored in localStorage only for frontend demo.
    // After Flask backend is connected, do NOT authenticate the user in React.
    //
    // Suggested API:
    // POST /api/auth/login
    //
    // Send:
    // {
    //   email,
    //   password
    // }
    //
    // Backend should:
    // 1. Find the user in MySQL using email.
    // 2. Verify the password securely.
    // 3. Check the user's role.
    // 4. Return the authenticated user's role and basic details.
    //
    // Example response:
    // {
    //   userId: 101,
    //   name: "User Name",
    //   email: "user@email.com",
    //   role: "citizen"
    // }
    //
    // IMPORTANT:
    // Passwords must NOT be stored as plain text in MySQL.
    // Backend should use password hashing.

    // Clear previous frontend demo login information.
    // BACKEND TODO:
    // After real authentication is implemented, session/token handling
    // should be managed by the backend instead of relying only on localStorage.
    localStorage.removeItem('userRole')
    localStorage.removeItem('departmentUser')

    // ---------------------------------------------------------
    // CITIZEN DEMO LOGIN
    // ---------------------------------------------------------
    //
    // FRONTEND DEMO ONLY:
    // This hardcoded account is used only until Flask + MySQL authentication
    // is connected.
    //
    // BACKEND TODO:
    // Remove this hardcoded login after backend authentication is ready.
    //
    // Suggested database table:
    // users
    //
    // Example fields:
    // user_id
    // full_name
    // email
    // password_hash
    // role
    // created_at

    if (
      enteredEmail === 'citizen@demo.com' &&
      password === '123456'
    ) {
      localStorage.setItem('userRole', 'citizen')

      // BACKEND TODO:
      // After successful API login, redirect according to the role
      // returned by Flask backend.
      //
      // Citizen:
      // navigate('/dashboard')

      navigate('/dashboard')
      return
    }

    // ---------------------------------------------------------
    // REGISTERED CITIZEN LOGIN
    // ---------------------------------------------------------
    //
    // FRONTEND DEMO ONLY:
    // Currently Register.tsx stores the registered citizen in localStorage.
    //
    // BACKEND TODO:
    // Replace this localStorage check with the Flask login API.
    //
    // The backend should check the users table in MySQL.
    // React should never directly access MySQL.

    const registeredUser = localStorage.getItem('registeredUser')

    if (registeredUser) {
      try {
        const user = JSON.parse(registeredUser)

        if (
          user.email === enteredEmail &&
          user.password === password &&
          user.role === 'citizen'
        ) {
          localStorage.setItem('userRole', 'citizen')

          // BACKEND TODO:
          // When Flask authentication is connected,
          // backend should return a session/token after successful login.
          //
          // The frontend can then store only the required authentication
          // information and use it for protected API requests.

          navigate('/dashboard')
          return
        }
      } catch {
        // FRONTEND DEMO CLEANUP:
        // Remove invalid demo registration data.
        //
        // BACKEND TODO:
        // This will no longer be required when registered users
        // are stored and validated through MySQL.
        localStorage.removeItem('registeredUser')
      }
    }

    // ---------------------------------------------------------
    // ADMIN DEMO LOGIN
    // ---------------------------------------------------------
    //
    // FRONTEND DEMO ONLY:
    // Admin credentials are currently hardcoded.
    //
    // BACKEND TODO:
    // Admin should also log in through:
    //
    // POST /api/auth/login
    //
    // Backend should verify:
    // - email
    // - password
    // - role = admin
    //
    // Admin account can be stored in the users/admin table in MySQL.
    // Do NOT keep real admin passwords inside React code.

    if (
      enteredEmail === 'admin@civicresolve.com' &&
      password === 'admin123'
    ) {
      localStorage.setItem('userRole', 'admin')

      // BACKEND TODO:
      // After successful admin authentication:
      // navigate('/admin/dashboard')

      navigate('/admin/dashboard')
      return
    }

    // ---------------------------------------------------------
    // DEPARTMENT DEMO LOGINS
    // ---------------------------------------------------------
    //
    // FRONTEND DEMO ONLY:
    // These department accounts are currently hardcoded so that
    // every department can be tested without a backend.
    //
    // BACKEND TODO:
    // Store department accounts in MySQL.
    //
    // Suggested tables:
    //
    // departments
    // -------------------------
    // department_id
    // department_name
    //
    // users
    // -------------------------
    // user_id
    // name
    // email
    // password_hash
    // role
    // department_id
    //
    // Example:
    // Road Department -> department_id = 1
    // Water Department -> department_id = 2
    // etc.
    //
    // This creates a proper relationship between a department user
    // and their department.

    const departments = [
      {
        name: 'Road Department',
        email: 'road@civicresolve.com',
        password: 'road123',
      },
      {
        name: 'Water Department',
        email: 'water@civicresolve.com',
        password: 'water123',
      },
      {
        name: 'Electrical Department',
        email: 'electrical@civicresolve.com',
        password: 'electrical123',
      },
      {
        name: 'Sanitation Department',
        email: 'sanitation@civicresolve.com',
        password: 'sanitation123',
      },
      {
        name: 'Drainage Department',
        email: 'drainage@civicresolve.com',
        password: 'drainage123',
      },
      {
        name: 'Parks & Garden Department',
        email: 'parks@civicresolve.com',
        password: 'parks123',
      },
      {
        name: 'Public Safety Department',
        email: 'safety@civicresolve.com',
        password: 'safety123',
      },
    ]

    const department = departments.find(
      (item) =>
        item.email === enteredEmail &&
        item.password === password,
    )

    if (department) {
      localStorage.setItem('userRole', 'department')

      localStorage.setItem(
        'departmentUser',
        JSON.stringify({
          name: department.name,
          email: department.email,
        }),
      )

      // BACKEND TODO:
      // After Flask authentication is connected:
      // 1. Backend verifies the department account.
      // 2. Backend identifies the department_id.
      // 3. Backend returns the authenticated department information.
      //
      // Example response:
      // {
      //   userId: 201,
      //   name: "Road Department",
      //   email: "road@civicresolve.com",
      //   role: "department",
      //   departmentId: 1,
      //   departmentName: "Road Department"
      // }
      //
      // IMPORTANT:
      // Department users should NOT be able to change their department
      // from the frontend.
      // Backend must verify department permissions for every API request.
      //
      // Department dashboard can then request:
      // GET /api/department/complaints
      //
      // Backend should return only complaints assigned to that department.

      navigate('/department/dashboard')
      return
    }

    // ---------------------------------------------------------
    // INVALID LOGIN
    // ---------------------------------------------------------
    //
    // FRONTEND:
    // Display error message when no demo/registered account matches.
    //
    // BACKEND TODO:
    // Flask API should return a proper authentication error,
    // for example HTTP 401 Unauthorized.
    //
    // React should display a user-friendly message such as:
    // "Invalid email or password. Please try again."

    setError('Invalid email or password. Please try again.')
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      <section className="flex min-h-screen items-center justify-center px-6 py-10">

        <div className="w-full max-w-5xl">

          {/* Project Identity */}
          <div className="mb-8 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-700 text-3xl shadow-lg shadow-blue-200">
              🏛️
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-blue-700 sm:text-5xl">
              CivicResolve
            </h1>

            <p className="mt-2 text-lg font-semibold text-slate-700">
              A Digital Platform for Civic Issue Management
            </p>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              A centralized platform for citizens, administrators and
              concerned departments to report, manage and track civic issues.
            </p>

          </div>

          {/* Login Card */}
          <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-lg shadow-slate-200/60">

            <div className="mb-6 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl">
                🔐
              </div>

              <h2 className="mt-4 text-2xl font-bold text-slate-900">
                Welcome
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Sign in to access your CivicResolve account.
              </p>

            </div>

            <form onSubmit={handleLogin}>

              {/* Email */}
              <div className="mb-5">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />

              </div>

              {/* Password */}
              <div className="mb-5">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />

              </div>

              {/* Error */}
              {error && (
                <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}

              {/* Login */}
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-700 py-3.5 font-semibold text-white shadow-md transition hover:bg-blue-800"
              >
                Login
              </button>

            </form>

            {/* Register */}
            <p className="mt-5 text-center text-sm text-slate-500">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="font-semibold text-blue-700 hover:text-blue-800"
              >
                Create an account
              </button>
            </p>

          </div>

          {/* Features */}
          <div className="mt-7 flex flex-wrap justify-center gap-3">

            <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600">
              Report Issues
            </span>

            <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600">
              Track Complaints
            </span>

            <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600">
              Department Management
            </span>

            <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600">
              Transparent Resolution
            </span>

          </div>

          {/* Footer */}
          <div className="mt-7 text-center">

            <p className="text-xs text-slate-400">
              Smart • Transparent • Citizen-Centric
            </p>

            <p className="mt-2 text-xs text-slate-400">
              © 2026 CivicResolve • Civic Issue Management Platform
            </p>

          </div>

        </div>

      </section>

    </main>
  )
}

export default LandingPage