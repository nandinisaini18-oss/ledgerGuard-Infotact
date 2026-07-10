import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import DashboardLayout from '../components/layout/DashboardLayout'
import Footer from '../components/layout/Footer'
import Home from '../pages/Home'
import AuthenticatedHome from '../pages/AuthenticatedHome'
import CompanyRegistration from '../pages/CompanyRegistration'
import UserRegistration from '../pages/UserRegistration'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import ProtectedRoute from '../components/ProtectedRoute'
import { AuthProvider, useAuth } from '../context'

function PublicLayout() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

function AppRoutesInner() {
  const { authenticated, loading } = useAuth()

  if (loading) return null

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Routes>
        {authenticated ? (
          <>
            <Route path="/" element={<AuthenticatedHome />} />
            <Route path="/register-company" element={<Navigate to="/" replace />} />
            <Route path="/register-user" element={<Navigate to="/" replace />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/register-company" element={<CompanyRegistration />} />
            <Route path="/register-user" element={<UserRegistration />} />
            <Route path="/login" element={<Login />} />
          </Route>
        )}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

function AppRoutes() {
  return (
    <AuthProvider>
      <AppRoutesInner />
    </AuthProvider>
  )
}

export default AppRoutes
