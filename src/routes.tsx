import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

import LandingPage from './pages/LandingPage'
import Login from './pages/Login'

import Register from './pages/citizen/Register'
import Dashboard from './pages/citizen/Dashboard'
import ReportIssue from './pages/citizen/ReportIssue'
import MyComplaints from './pages/citizen/MyComplaints'
import ComplaintsDetails from './pages/citizen/ComplaintsDetails'

import AdminDashboard from './pages/admin/AdminDashboard'
import AdminComplaints from './pages/admin/AdminComplaints'
import AdminComplaintDetails from './pages/admin/AdminComplaintDetails'
import AdminAnalytics from './pages/admin/AdminAnalytics'

import DepartmentDashboard from './pages/department/DepartmentDashboard'
import DepartmentComplaintDetails from './pages/department/DepartmentComplaintDetails'

type Role = 'citizen' | 'admin' | 'department'

type ProtectedRouteProps = {
  children: React.ReactNode
  allowedRole: Role
}

function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-xs font-semibold text-slate-500">Verifying session...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== allowedRole) {
    // Route to appropriate dashboard for current role
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />
    }
    if (user.role === 'department') {
      return <Navigate to="/department/dashboard" replace />
    }
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

function PublicAuthRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-xs font-semibold text-slate-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (user) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />
    if (user.role === 'department') return <Navigate to="/department/dashboard" replace />
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            <PublicAuthRoute>
              <Login />
            </PublicAuthRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicAuthRoute>
              <Register />
            </PublicAuthRoute>
          }
        />

        {/* Citizen */}
        <Route path="/home" element={<Navigate to="/dashboard" replace />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRole="citizen">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/report-issue"
          element={
            <ProtectedRoute allowedRole="citizen">
              <ReportIssue />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-complaints"
          element={
            <ProtectedRoute allowedRole="citizen">
              <MyComplaints />
            </ProtectedRoute>
          }
        />

        <Route
          path="/complaint/:id"
          element={
            <ProtectedRoute allowedRole="citizen">
              <ComplaintsDetails />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/complaints"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminComplaints />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/complaint/:id"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminComplaintDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminAnalytics />
            </ProtectedRoute>
          }
        />

        {/* Department */}
        <Route
          path="/department/dashboard"
          element={
            <ProtectedRoute allowedRole="department">
              <DepartmentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/department/complaint/:id"
          element={
            <ProtectedRoute allowedRole="department">
              <DepartmentComplaintDetails />
            </ProtectedRoute>
          }
        />

        {/* Unknown URL */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes