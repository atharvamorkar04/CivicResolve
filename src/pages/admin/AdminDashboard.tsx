import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AdminDashboard() {
  const navigate = useNavigate()

  const [showProfile, setShowProfile] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  /*
    BACKEND / DATABASE NOTE:
    Current frontend uses localStorage only for demo login/logout.

    FINAL VERSION:
    - Admin login should be handled by Flask backend.
    - Backend should verify admin email and password from MySQL.
    - Backend should create/manage the authenticated admin session or token.
    - React should not directly connect to MySQL.
    - Suggested API:
      POST /api/auth/login
      POST /api/auth/logout
      GET  /api/auth/me
  */

  const handleLogout = () => {
    /*
      BACKEND / DATABASE:
      Current code removes demo authentication from localStorage.

      FINAL VERSION:
      Call:
      POST /api/auth/logout

      Backend should invalidate the admin session/token if required.
    */
    localStorage.removeItem('userRole')
    localStorage.removeItem('departmentUser')
    setShowProfile(false)
    navigate('/')
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-blue-700">
              CivicResolve
            </h1>

            <p className="text-xs text-slate-500">
              Administration Portal
            </p>
          </div>

          <div className="flex items-center gap-3">

            {/* Notifications */}
            <button
              type="button"
              onClick={() => setShowNotifications(true)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              🔔 Notifications
            </button>

            {/* Profile */}
            <button
              type="button"
              onClick={() => setShowProfile(true)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              👤 My Profile
            </button>

          </div>

        </div>
      </header>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-6 py-10">

        {/* Heading */}
        <div className="mb-8">

          <p className="text-sm font-medium text-blue-700">
            Administration
          </p>

          <h2 className="mt-1 text-3xl font-bold text-slate-900">
            Admin Dashboard
          </h2>

          <p className="mt-2 text-slate-500">
            Monitor and manage citizen complaints.
          </p>

        </div>

        {/* Statistics */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Complaints
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              128
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Pending
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              32
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              In Progress
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              41
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Resolved
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              55
            </p>
          </div>

        </div>

        {/*
          BACKEND / DATABASE:
          These statistics are currently demo values.

          FINAL VERSION:
          Fetch real numbers from backend.

          Suggested API:
          GET /api/admin/dashboard/stats

          Backend should calculate:
          - Total complaints
          - Pending / Verified complaints
          - In Progress complaints
          - Resolved complaints

          These values should come from the complaints table in MySQL.
        */}

        {/* Management Cards */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">

          {/* Complaints */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
              📋
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              Manage Complaints
            </h3>

            <p className="mt-2 leading-6 text-slate-500">
              View, review and manage all citizen complaints.
            </p>

            <button
              type="button"
              onClick={() => navigate('/admin/complaints')}
              className="mt-5 rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              View All Complaints
            </button>

          </div>

          {/* Analytics */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
              📊
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              Analytics & Reports
            </h3>

            <p className="mt-2 leading-6 text-slate-500">
              Analyze complaint trends, categories and department performance.
            </p>

            <button
              type="button"
              onClick={() => navigate('/admin/analytics')}
              className="mt-5 rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              View Analytics
            </button>

          </div>

        </div>

        {/*
          BACKEND / DATABASE:
          "Manage Complaints" should open complaints fetched from MySQL.

          Suggested API:
          GET /api/admin/complaints

          "Analytics & Reports" should fetch calculated data from backend.

          Suggested API:
          GET /api/admin/analytics
        */}

        {/* Recent Complaints */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-6 py-5">

            <h3 className="text-lg font-bold text-slate-900">
              Recent Complaints
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Latest complaints submitted by citizens.
            </p>

          </div>

          <div className="divide-y divide-slate-100">

            <div className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="font-semibold text-slate-900">
                  CC-1024 — Road Maintenance Issue
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Road & Transport • Rahul Patil
                </p>
              </div>

              <span className="w-fit rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700">
                In Progress
              </span>

            </div>

            <div className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="font-semibold text-slate-900">
                  CC-1023 — Garbage Not Collected
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Garbage & Cleaning • Priya Sharma
                </p>
              </div>

              <span className="w-fit rounded-full bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-700">
                Pending
              </span>

            </div>

            <div className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="font-semibold text-slate-900">
                  CC-1022 — Street Light Not Working
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Electrical & Street Lights • Amit Joshi
                </p>
              </div>

              <span className="w-fit rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700">
                Resolved
              </span>

            </div>

          </div>

        </div>

        {/*
          BACKEND / DATABASE:
          Recent complaints are currently hardcoded for frontend demonstration.

          FINAL VERSION:
          Backend should return the latest complaints from MySQL.

          Suggested API:
          GET /api/admin/complaints/recent

          Backend can use:
          ORDER BY created_at DESC
          LIMIT 5

          Data should include:
          - complaint_id
          - title
          - category
          - citizen name
          - status
          - created_at
        */}

      </section>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6">

          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

            <div className="flex items-start justify-between border-b border-slate-200 p-6">

              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                  👤
                </div>

                <h2 className="mt-3 text-xl font-bold text-slate-900">
                  My Profile
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Administrator account details
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowProfile(false)}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close profile"
              >
                ✕
              </button>

            </div>

            <div className="space-y-5 p-6">

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Name
                </p>

                <p className="mt-2 font-semibold text-slate-900">
                  CivicResolve Administrator
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Email
                </p>

                <p className="mt-2 text-sm text-slate-600">
                  admin@civicresolve.com
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Account Type
                </p>

                <p className="mt-2 text-sm font-medium text-slate-800">
                  Administrator
                </p>
              </div>

              {/*
                BACKEND / DATABASE:
                Admin profile details are currently static.

                FINAL VERSION:
                Fetch the logged-in admin details from backend.

                Suggested API:
                GET /api/auth/me

                Backend should return only the authenticated
                administrator's information.
              */}

              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                Logout
              </button>

            </div>

          </div>

        </div>
      )}

      {/* Notifications Modal */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6">

          <div className="flex w-full max-w-md max-h-[85vh] flex-col rounded-2xl bg-white shadow-2xl">

            {/* Notifications Header */}
            <div className="flex shrink-0 items-start justify-between border-b border-slate-200 p-6">

              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                  🔔
                </div>

                <h2 className="mt-3 text-xl font-bold text-slate-900">
                  Notifications
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Important complaint management updates
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowNotifications(false)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close notifications"
              >
                ✕
              </button>

            </div>

            {/* Scrollable Notifications */}
            <div className="min-h-0 flex-1 overflow-y-auto p-6">

              <div className="space-y-3">

                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                  <p className="font-semibold text-slate-900">
                    New complaint CC-1024 has been submitted.
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Just now
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">
                    Complaint CC-1023 is awaiting verification.
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Today
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">
                    Department updated complaint CC-1024.
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Today
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">
                    Department added a remark to CC-1021.
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Today
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">
                    Complaint CC-1022 has been marked as resolved.
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Yesterday
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {/*
        BACKEND / DATABASE — NOTIFICATIONS:

        Current notifications are static demo messages.

        FINAL VERSION:
        Notifications should come from the MySQL notifications table.

        Suggested table:

        notifications
        - notification_id
        - complaint_id
        - recipient_user_id
        - message
        - type
        - is_read
        - created_at

        Suggested API:
        GET /api/admin/notifications

        Backend should create notifications when:
        1. New complaint is submitted.
        2. Complaint is verified.
        3. Complaint is assigned to a department.
        4. Department updates complaint status.
        5. Department adds a remark.
        6. Department uploads resolution information/photo.
        7. Complaint is resolved.

        IMPORTANT:
        Admin should receive only admin-related notifications.
        Backend should handle this filtering.
      */}

    </main>
  )
}

export default AdminDashboard