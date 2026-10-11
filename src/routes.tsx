import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import LandingPage from './pages/LandingPage'

import Register from './pages/citizen/Register'
import Home from './pages/citizen/Home'
import Dashboard from './pages/citizen/Dashboard'
import ReportIssue from './pages/citizen/ReportIssueTemp'
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

function ProtectedRoute({
  children,
  allowedRole,
}: ProtectedRouteProps) {
  const userRole = localStorage.getItem('userRole')

  if (userRole !== allowedRole) {
    return <Navigate to="/" replace />
  }

  return children
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<LandingPage />} />

        <Route path="/register" element={<Register />} />

        {/* Citizen */}
        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRole="citizen">
              <Home />
            </ProtectedRoute>
          }
        />

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
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes