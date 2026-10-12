import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()
  const userRole = localStorage.getItem('userRole')

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-blue-700">
              CivicResolve
            </h1>
            <p className="text-xs text-slate-500">
              Smart Civic Reporting System
            </p>
          </div>

          <div className="flex items-center gap-3">
            {userRole === 'citizen' ? (
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="rounded-lg bg-blue-700 px-5 py-2.5 font-semibold text-white shadow-sm hover:bg-blue-800 transition"
              >
                Dashboard
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="rounded-lg px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 transition"
                >
                  Sign In
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="rounded-lg bg-blue-700 px-5 py-2.5 font-semibold text-white shadow-sm hover:bg-blue-800 transition"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 md:grid-cols-2">
          
          <div>
            <div className="mb-6 inline-flex items-center rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm">
              🏛️ Building Better Communities Together
            </div>

            <h2 className="text-5xl font-bold leading-tight tracking-tight text-slate-900 md:text-6xl">
              Report Civic Issues.
              <span className="block text-blue-700">
                Track Their Progress.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              CivicResolve makes it simple for citizens to report local
              problems, monitor complaint status, and contribute to a cleaner,
              safer and better-connected city.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => navigate('/report-issue')}
                className="rounded-lg bg-blue-700 px-7 py-3.5 font-semibold text-white shadow-md hover:bg-blue-800 transition"
              >
                Report an Issue
              </button>

              <button
                type="button"
                onClick={() => navigate('/my-complaints')}
                className="rounded-lg border border-slate-300 bg-white px-7 py-3.5 font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Track Complaints
              </button>
            </div>
          </div>

          {/* Civic Illustration Card */}
          <div className="hidden md:block">
            <div className="rounded-2xl border border-blue-100 bg-white p-8 shadow-xl shadow-blue-100/50">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    CivicResolve
                  </p>
                  <h3 className="mt-1 text-xl font-bold text-slate-900">
                    Your City. Your Voice.
                  </h3>
                </div>

                <div className="rounded-xl bg-blue-50 p-3 text-2xl">
                  🏙️
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-sm text-slate-500">Workflow Overview</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    Automated Issue Routing
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Direct Department Assignment
                    </span>

                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      Standardized
                    </span>
                  </div>
                </div>

                <div className="rounded-xl bg-blue-700 p-5 text-white">
                  <p className="text-sm text-blue-100">
                    Platform Scope
                  </p>

                  <p className="mt-2 text-2xl font-bold">
                    Civic Issue Management
                  </p>

                  <p className="mt-1 text-sm text-blue-100">
                    Centralized platform connecting citizens with city administration
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="font-semibold text-blue-700">
              HOW IT WORKS
            </p>

            <h3 className="mt-2 text-3xl font-bold text-slate-900">
              Simple. Transparent. Connected.
            </h3>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-3xl">📍</div>
              <h4 className="mt-4 text-lg font-bold">
                Report an Issue
              </h4>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Submit civic complaints with category, location and photos.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-3xl">📊</div>
              <h4 className="mt-4 text-lg font-bold">
                Track Progress
              </h4>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Follow your complaint from submission to resolution.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-3xl">🤝</div>
              <h4 className="mt-4 text-lg font-bold">
                Improve Your City
              </h4>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Stay informed and help create better public spaces.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home