import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function LandingPage() {
  const navigate = useNavigate()

  // State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [contactSubmitted, setContactSubmitted] = useState(false)
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactSubject, setContactSubject] = useState('')
  const [contactMessage, setContactMessage] = useState('')

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'how-it-works', 'features', 'benefits', 'about', 'contact']
      const scrollPosition = window.scrollY + 120

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleContactSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      return
    }

    setContactSubmitted(true)
    setTimeout(() => {
      setContactName('')
      setContactEmail('')
      setContactSubject('')
      setContactMessage('')
      setContactSubmitted(false)
    }, 4000)
  }

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* =========================================================================
          1. NAVIGATION BAR
      ========================================================================= */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 sm:py-4">
          {/* Logo / Wordmark */}
          <a
            href="#home"
            className="flex items-center gap-2.5 group transition"
            id="nav-logo-link"
          >
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 to-blue-600 text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 sm:w-6 sm:h-6"
                aria-hidden="true"
              >
                <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.432z" />
              </svg>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors">
                Civic<span className="text-blue-700">Resolve</span>
              </span>
              <p className="hidden sm:block text-[10px] uppercase font-bold tracking-wider text-slate-500 leading-none">
                Civic Issue Management
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium text-slate-600"
            aria-label="Main Navigation"
          >
            {[
              { id: 'home', label: 'Home' },
              { id: 'how-it-works', label: 'How It Works' },
              { id: 'features', label: 'Features' },
              { id: 'benefits', label: 'Benefits' },
              { id: 'about', label: 'About' },
              { id: 'contact', label: 'Contact' },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`px-3 py-2 rounded-lg transition-all ${activeSection === item.id
                    ? 'text-blue-700 font-semibold bg-blue-50/70'
                    : 'hover:text-blue-700 hover:bg-slate-100/70'
                  }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              id="nav-login-btn"
              className="inline-flex items-center justify-center rounded-lg px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-700 hover:bg-slate-100 transition border border-transparent hover:border-slate-200"
            >
              Sign In
            </Link>

            <Link
              to="/register"
              id="nav-register-btn"
              className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-blue-800 transition active:scale-[0.98]"
            >
              Register
            </Link>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              id="nav-mobile-toggle"
            >
              {mobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-fade-in"
            id="mobile-navigation-drawer"
          >
            <div className="flex flex-col space-y-1">
              {[
                { id: 'home', label: 'Home' },
                { id: 'how-it-works', label: 'How It Works' },
                { id: 'features', label: 'Features' },
                { id: 'benefits', label: 'Benefits' },
                { id: 'about', label: 'About' },
                { id: 'contact', label: 'Contact' },
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={closeMobileMenu}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition ${activeSection === item.id
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-100'
                    }`}
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="w-full text-center py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Sign In to Portal
              </Link>
              <Link
                to="/register"
                onClick={closeMobileMenu}
                className="w-full text-center py-2.5 rounded-lg bg-blue-700 text-sm font-semibold text-white hover:bg-blue-800 shadow-sm transition"
              >
                Create Citizen Account
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* =========================================================================
          2. HERO SECTION (#home)
      ========================================================================= */}
      <section
        id="home"
        className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-slate-50 to-white pt-12 pb-16 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-32 border-b border-slate-200/60"
      >
        {/* Subtle decorative background circles */}
        <div
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-200/30 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute top-1/2 -right-24 w-96 h-96 rounded-full bg-cyan-200/20 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
            {/* Left Column: Headline and Call-to-Actions */}
            <div className="lg:col-span-7 animate-slide-up">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white px-3.5 py-1.5 text-xs font-semibold text-blue-700 shadow-sm mb-6">
                <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                Modern Municipal Grievance Platform
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.12]">
                Report Local Civic Issues.{' '}
                <span className="block text-blue-700">Track Direct Resolution.</span>
              </h1>

              {/* Description */}
              <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-600">
                CivicResolve provides an open, transparent digital bridge between residents and local
                administration. Report infrastructure concerns, submit photo evidence, pinpoint
                exact coordinates, and monitor municipal department resolution milestones.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5 sm:gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/report-issue')}
                  id="hero-report-issue-btn"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3.5 text-sm sm:text-base font-semibold text-white shadow-md shadow-blue-700/20 hover:bg-blue-800 transition active:scale-[0.99]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                    aria-hidden="true"
                  >
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                  </svg>
                  Report an Issue
                </button>

                <a
                  href="#how-it-works"
                  id="hero-how-it-works-btn"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm sm:text-base font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-400 transition"
                >
                  How It Works
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 text-slate-500"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>

                <Link
                  to="/login"
                  className="inline-flex items-center text-xs sm:text-sm font-medium text-blue-700 hover:text-blue-800 hover:underline px-2 py-2"
                >
                  Track Existing Complaint →
                </Link>
              </div>

              {/* Core Feature Highlights Pills */}
              <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-200/70">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs">
                    ✓
                  </div>
                  <span>Photo Evidence</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs">
                    ✓
                  </div>
                  <span>GPS Coordinates</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700 col-span-2 sm:col-span-1">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs">
                    ✓
                  </div>
                  <span>Verified Tracking</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Civic Workflow Representation */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Interactive Showcase Card */}
                <div className="civic-card-hover rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xl shadow-slate-200/70">
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-sm">
                        CR
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-slate-900 leading-tight">
                          Issue Lifecycle Flow
                        </h2>
                        <p className="text-[11px] text-slate-500">Digital Resolution Pipeline</p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 border border-emerald-200/60">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      Active Redressal
                    </span>
                  </div>

                  {/* Representative Sample Issue Preview */}
                  <div className="mt-4 rounded-xl bg-slate-50 p-4 border border-slate-200/60">
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-700 uppercase tracking-wide">
                        Road Infrastructure
                      </span>
                      <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        In Progress
                      </span>
                    </div>

                    <h3 className="mt-2.5 text-sm font-bold text-slate-800">
                      Pothole Repair & Surface Restoration
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                      Reported near Sector 4 intersection with attached location coordinates and photo evidence.
                    </p>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-600 border-t border-slate-200/50 pt-2.5">
                      <span className="flex items-center gap-1 text-slate-500">
                        📍 MG Road, Ward 12
                      </span>
                      <span className="font-semibold text-blue-700">
                        Assigned: Road Works Dept
                      </span>
                    </div>
                  </div>

                  {/* Progress Milestones Stepper */}
                  <div className="mt-5 space-y-3">
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Stage Verification
                    </p>

                    <div className="relative pl-6 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-200">
                      <div className="relative flex items-start gap-3">
                        <div className="absolute -left-6 mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-700 ring-4 ring-white">
                          <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-900">
                            1. Citizen Report Submitted
                          </p>
                          <p className="text-[11px] text-slate-500">Details & photos logged</p>
                        </div>
                      </div>

                      <div className="relative flex items-start gap-3">
                        <div className="absolute -left-6 mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-700 ring-4 ring-white">
                          <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-900">
                            2. Administrative Triage
                          </p>
                          <p className="text-[11px] text-slate-500">Verified and routed to Road Dept</p>
                        </div>
                      </div>

                      <div className="relative flex items-start gap-3">
                        <div className="absolute -left-6 mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 ring-4 ring-white">
                          <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-amber-700">
                            3. Field Crew Dispatched
                          </p>
                          <p className="text-[11px] text-slate-500">Inspection & repair work underway</p>
                        </div>
                      </div>

                      <div className="relative flex items-start gap-3 opacity-60">
                        <div className="absolute -left-6 mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-300 ring-4 ring-white" />
                        <div>
                          <p className="text-xs font-semibold text-slate-600">
                            4. Verified Resolution
                          </p>
                          <p className="text-[11px] text-slate-400">Photo verification & feedback</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="hidden sm:flex absolute -bottom-4 -right-4 rounded-xl border border-slate-200 bg-white p-3 shadow-lg items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700 text-lg">
                    ⚡
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Zero Paperwork</p>
                    <p className="text-[11px] text-slate-500">100% Digital Workflow</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. HOW IT WORKS SECTION (#how-it-works)
      ========================================================================= */}
      <section
        id="how-it-works"
        className="py-16 sm:py-24 bg-white border-b border-slate-200/70"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60 mb-3">
              Standardized Process
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              How CivicResolve Works
            </h2>
            <p className="mt-3.5 text-base sm:text-lg text-slate-600 leading-relaxed">
              From the moment an issue is spotted on the street to its verified resolution,
              every step is tracked with complete transparency.
            </p>
          </div>

          {/* 4-Step Grid */}
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Step 1 */}
            <div className="civic-card-hover rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-700 text-white font-extrabold text-lg shadow-sm">
                    01
                  </span>
                  <span className="text-2xl" role="img" aria-label="Camera">
                    📷
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-bold text-slate-900">
                  Report & Evidence
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Citizens submit the problem by selecting the category, providing clear
                  descriptions, uploading on-site photos, and tagging exact coordinates.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 text-xs font-semibold text-blue-700">
                • Citizen Action
              </div>
            </div>

            {/* Step 2 */}
            <div className="civic-card-hover rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-700 text-white font-extrabold text-lg shadow-sm">
                    02
                  </span>
                  <span className="text-2xl" role="img" aria-label="Shield">
                    📋
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-bold text-slate-900">
                  Admin Verification
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Municipal administration reviews incoming complaints for validity, checks
                  for duplicates, prioritizes urgency, and routes them to the correct department.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 text-xs font-semibold text-blue-700">
                • Administrative Triage
              </div>
            </div>

            {/* Step 3 */}
            <div className="civic-card-hover rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-700 text-white font-extrabold text-lg shadow-sm">
                    03
                  </span>
                  <span className="text-2xl" role="img" aria-label="Tools">
                    🛠️
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-bold text-slate-900">
                  Department Action
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Assigned municipal teams (Roads, Water, Sanitation, Electrical) deploy crew,
                  inspect the site, log progress updates, and execute required repairs.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 text-xs font-semibold text-blue-700">
                • Field Execution
              </div>
            </div>

            {/* Step 4 */}
            <div className="civic-card-hover rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white font-extrabold text-lg shadow-sm">
                    04
                  </span>
                  <span className="text-2xl" role="img" aria-label="Check">
                    ✅
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-bold text-slate-900">
                  Resolution & Rating
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  The department records resolution details and completion photos. Citizens receive
                  notifications, review the outcome, and submit satisfaction feedback.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 text-xs font-semibold text-emerald-700">
                • Verified Closure
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. CORE FEATURES SECTION (#features)
      ========================================================================= */}
      <section
        id="features"
        className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200/70"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60 mb-3">
              Platform Capabilities
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Engineered for Precision & Accountability
            </h2>
            <p className="mt-3.5 text-base sm:text-lg text-slate-600 leading-relaxed">
              Every feature is built around the real-world operational challenges of public civic infrastructure.
            </p>
          </div>

          {/* 4 Feature Pillars */}
          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {/* Feature 1: Issue Reporting */}
            <div className="civic-card-hover rounded-2xl border border-slate-200 bg-white p-7 sm:p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700 text-2xl mb-6">
                📝
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Structured Issue Reporting
              </h3>
              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                Report civic issues categorized into standardized municipal domains:
                Roads & Transport, Water Supply, Drainage & Sewage, Street Lighting, Solid Waste
                Management, and Public Gardens. Standardized taxonomy prevents lost or miscategorized reports.
              </p>
              <ul className="mt-4 space-y-2 text-xs sm:text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">✓</span> Pre-configured categories & subcategories
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">✓</span> Clear severity indicators (Urgent / High / Standard)
                </li>
              </ul>
            </div>

            {/* Feature 2: Photo Evidence */}
            <div className="civic-card-hover rounded-2xl border border-slate-200 bg-white p-7 sm:p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700 text-2xl mb-6">
                📸
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Photo Evidence Upload
              </h3>
              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                Visual proof is critical for municipal crews to evaluate equipment requirements
                before deploying to the site. Department teams can also attach post-resolution
                photographs to verify work quality.
              </p>
              <ul className="mt-4 space-y-2 text-xs sm:text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">✓</span> Before & after photo documentation
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">✓</span> On-site visual validation for field inspectors
                </li>
              </ul>
            </div>

            {/* Feature 3: Geographic Coordinates */}
            <div className="civic-card-hover rounded-2xl border border-slate-200 bg-white p-7 sm:p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700 text-2xl mb-6">
                📍
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Geographic Coordinate Pinpointing
              </h3>
              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                Vague location descriptions cause delayed responses. CivicResolve enables
                precise address logging and geographic coordinates, ensuring maintenance crews
                reach the exact spot without calling for directions.
              </p>
              <ul className="mt-4 space-y-2 text-xs sm:text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">✓</span> Exact latitude and longitude coordinate capture
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">✓</span> Street names, landmarks, and ward specifications
                </li>
              </ul>
            </div>

            {/* Feature 4: Real-time Tracking */}
            <div className="civic-card-hover rounded-2xl border border-slate-200 bg-white p-7 sm:p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700 text-2xl mb-6">
                ⏱️
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Real-Time Progress Tracking
              </h3>
              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                Citizens no longer need to call municipal offices for updates. The platform
                provides a transparent milestone tracker showing when a complaint was assigned,
                which department is handling it, and remarks added by the engineers.
              </p>
              <ul className="mt-4 space-y-2 text-xs sm:text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">✓</span> Full timestamped audit trail from submission to close
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">✓</span> Direct citizen feedback & rating upon completion
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. BENEFITS SECTION (#benefits)
      ========================================================================= */}
      <section
        id="benefits"
        className="py-16 sm:py-24 bg-white border-b border-slate-200/70"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60 mb-3">
              Value Proposition
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Benefits for Citizens & City Administration
            </h2>
            <p className="mt-3.5 text-base sm:text-lg text-slate-600 leading-relaxed">
              Bridging the gap between the public and urban service providers with mutual accountability.
            </p>
          </div>

          {/* Two-Column Comparison */}
          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            {/* For Citizens */}
            <div className="civic-card-hover rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/50 to-white p-7 sm:p-9 shadow-md">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-700 text-white text-2xl shadow-sm">
                  👥
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    For Citizens & Residents
                  </h3>
                  <p className="text-xs text-blue-700 font-semibold">Direct Voice in Neighborhood Maintenance</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-200 text-blue-800 text-xs font-bold">
                    ✓
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Convenient Digital Access</h4>
                    <p className="mt-0.5 text-xs sm:text-sm text-slate-600">
                      Report civic problems in seconds without paper forms, queuing in ward offices, or waiting in telephone lines.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-200 text-blue-800 text-xs font-bold">
                    ✓
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Total Transparency</h4>
                    <p className="mt-0.5 text-xs sm:text-sm text-slate-600">
                      Know exactly which municipal department received your complaint and view the designated official's field remarks.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-200 text-blue-800 text-xs font-bold">
                    ✓
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Empowerment Through Feedback</h4>
                    <p className="mt-0.5 text-xs sm:text-sm text-slate-600">
                      Rate resolution quality after repair completion, driving higher service standards across all municipal departments.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Administrators & Departments */}
            <div className="civic-card-hover rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-7 sm:p-9 shadow-md">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-white text-2xl shadow-sm">
                  🏛️
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    For Administrators & Departments
                  </h3>
                  <p className="text-xs text-slate-600 font-semibold">Organized Workflow & Objective Data</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-300 text-slate-800 text-xs font-bold">
                    ✓
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Centralized Intake & Routing</h4>
                    <p className="mt-0.5 text-xs sm:text-sm text-slate-600">
                      Eliminate lost complaints and duplicate entries through unified administrative triage and instant department assignment.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-300 text-slate-800 text-xs font-bold">
                    ✓
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Operational Accountability</h4>
                    <p className="mt-0.5 text-xs sm:text-sm text-slate-600">
                      Track resolution timeliness per department, identify recurring civic bottlenecks, and optimize resource allocation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-300 text-slate-800 text-xs font-bold">
                    ✓
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Complete Historical Audit Trail</h4>
                    <p className="mt-0.5 text-xs sm:text-sm text-slate-600">
                      Maintain verifiable digital archives of repair actions, inspector notes, and citizen satisfaction ratings.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. ABOUT SECTION (#about)
      ========================================================================= */}
      <section
        id="about"
        className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200/70"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60 mb-3">
              About CivicResolve
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Dedicated to Transparent Municipal Governance
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              CivicResolve is designed to make public infrastructure management open, responsive,
              and accountable. By establishing clear communication pathways between residents,
              city coordinators, and specialized maintenance departments, the platform ensures
              that reported issues receive timely attention and verifiable resolution.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3 max-w-4xl mx-auto">
            <div className="rounded-xl border border-slate-200 bg-white p-5 text-center">
              <div className="text-2xl mb-2">🔍</div>
              <h3 className="font-bold text-slate-900 text-sm">Transparency First</h3>
              <p className="mt-1 text-xs text-slate-500">
                Clear status visibility at every stage of the grievance lifecycle.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 text-center">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-bold text-slate-900 text-sm">Direct Routing</h3>
              <p className="mt-1 text-xs text-slate-500">
                Fast coordination connecting reports to the appropriate municipal team.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 text-center">
              <div className="text-2xl mb-2">🤝</div>
              <h3 className="font-bold text-slate-900 text-sm">Civic Partnership</h3>
              <p className="mt-1 text-xs text-slate-500">
                Residents and city administration collaborating for cleaner, safer neighborhoods.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. CONTACT & HELPDESK SECTION (#contact)
      ========================================================================= */}
      <section
        id="contact"
        className="py-16 sm:py-24 bg-white border-b border-slate-200/70"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60 mb-3">
              Support & Inquiries
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Get in Touch with Civic Support
            </h2>
            <p className="mt-3.5 text-base sm:text-lg text-slate-600 leading-relaxed">
              Have questions regarding portal registration, complaint procedures, or technical assistance?
            </p>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-12 max-w-5xl mx-auto items-start">
            {/* Contact Details Card */}
            <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-7 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Civic Helpdesk</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Assisting citizens with platform access and complaint tracking.
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <span className="text-lg">🕒</span>
                  <div>
                    <p className="font-bold text-slate-900">Operational Hours</p>
                    <p className="text-slate-600">Monday – Saturday: 9:00 AM – 6:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-lg">✉️</span>
                  <div>
                    <p className="font-bold text-slate-900">Email Inquiry</p>
                    <p className="text-slate-600">support@civicresolve.org</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-lg">🏢</span>
                  <div>
                    <p className="font-bold text-slate-900">Municipal Grievance Cell</p>
                    <p className="text-slate-600">Central Municipal Administrative Building</p>
                  </div>
                </div>
              </div>

              {/* Emergency Advisory */}
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 leading-relaxed">
                <strong className="block font-bold mb-1">🚨 Emergency Advisory:</strong>
                CivicResolve is intended for civic infrastructure maintenance. For immediate life-safety emergencies (Police, Fire, Ambulance), please dial designated national emergency phone helplines immediately.
              </div>
            </div>

            {/* Quick Contact Form */}
            <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-1">Send an Inquiry</h3>
              <p className="text-xs text-slate-500 mb-6">
                Our administrative support team reviews messages during regular working hours.
              </p>

              {contactSubmitted ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center animate-fade-in">
                  <div className="text-3xl mb-2">✅</div>
                  <h4 className="text-base font-bold text-emerald-900">Inquiry Received</h4>
                  <p className="mt-1 text-xs sm:text-sm text-emerald-700">
                    Thank you for reaching out. Your inquiry has been submitted and will be reviewed shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Your Name"
                        required
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="block text-xs font-semibold text-slate-700 mb-1">
                      Subject
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      placeholder="e.g. Question about complaint categories"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Write your message here..."
                      required
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-blue-700 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 transition active:scale-[0.99]"
                  >
                    Submit Inquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. CALL TO ACTION STRIP
      ========================================================================= */}
      <section className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 py-12 sm:py-16 text-white text-center">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to Help Build a Better Neighborhood?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Join other residents in reporting civic concerns directly to responsible departments.
            Quick registration, transparent tracking, and verified results.
          </p>

          <div className="mt-8 flex flex-wrap justify-center items-center gap-3.5">
            <Link
              to="/register"
              id="cta-register-btn"
              className="rounded-xl bg-white px-6 py-3 text-sm sm:text-base font-bold text-blue-800 shadow-md hover:bg-blue-50 transition active:scale-[0.98]"
            >
              Register Citizen Account
            </Link>

            <Link
              to="/login"
              id="cta-login-btn"
              className="rounded-xl border border-blue-300/40 bg-blue-700/60 px-6 py-3 text-sm sm:text-base font-semibold text-white hover:bg-blue-600 transition"
            >
              Sign In to Existing Account
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. PROFESSIONAL FOOTER
      ========================================================================= */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5 text-white">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold">
                  CR
                </div>
                <span className="text-xl font-bold tracking-tight">CivicResolve</span>
              </div>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
                A digital platform for civic issue management, connecting citizens with municipal
                administration for swift, transparent grievance redressal.
              </p>

            </div>

            {/* Platform Navigation */}
            <div>
              <p className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
                Navigation
              </p>
              <ul className="space-y-2">
                <li><a href="#home" className="hover:text-white transition">Home</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition">How It Works</a></li>
                <li><a href="#features" className="hover:text-white transition">Platform Features</a></li>
                <li><a href="#benefits" className="hover:text-white transition">Benefits Overview</a></li>
                <li><a href="#about" className="hover:text-white transition">About CivicResolve</a></li>
                <li><a href="#contact" className="hover:text-white transition">Contact & Helpdesk</a></li>
              </ul>
            </div>

            {/* Portal Access */}
            <div>
              <p className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
                Portal Access
              </p>
              <ul className="space-y-2">
                <li><Link to="/login" className="hover:text-white transition">Sign In</Link></li>
                <li><Link to="/register" className="hover:text-white transition">Register Account</Link></li>
                <li><Link to="/report-issue" className="hover:text-white transition">Report Civic Issue</Link></li>
                <li><Link to="/my-complaints" className="hover:text-white transition">Track Complaint</Link></li>
              </ul>
            </div>

            {/* Municipal Sectors */}
            <div>
              <p className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
                Supported Sectors
              </p>
              <ul className="space-y-2 text-slate-400">
                <li>Roads & Infrastructure</li>
                <li>Water Supply & Quality</li>
                <li>Street Lighting</li>
                <li>Solid Waste & Sanitation</li>
                <li>Drainage & Sewage</li>
                <li>Parks & Public Spaces</li>
              </ul>
            </div>
          </div>

          {/* Copyright & Disclaimer Bar */}
          <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] text-slate-500">
            <p>© 2026 CivicResolve. A Digital Platform for Civic Issue Management. All rights reserved.</p>
            <p>Designed for responsive access across mobile, tablet, and desktop devices.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage