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
import TransactionList from '../pages/TransactionList'
import CreateTransaction from '../pages/CreateTransaction'
import EditTransaction from '../pages/EditTransaction'
import ViewTransaction from '../pages/ViewTransaction'
import Analytics from '../pages/Analytics'
import ProtectedRoute from '../components/ProtectedRoute'
import AdminRoute from '../components/AdminRoute'
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
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transactions" element={<TransactionList />} />
              <Route path="/transactions/new" element={<AdminRoute><CreateTransaction /></AdminRoute>} />
              <Route path="/transactions/:id" element={<ViewTransaction />} />
              <Route path="/transactions/:id/edit" element={<AdminRoute><EditTransaction /></AdminRoute>} />
              <Route path="/analytics" element={<Analytics />} />
            </Route>
          </>
        ) : (
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/register-company" element={<CompanyRegistration />} />
            <Route path="/register-user" element={<UserRegistration />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Route>
        )}
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
