import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context'

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return null

  if (user?.role !== 'admin') {
    return (
      <Navigate
        to="/transactions"
        state={{
          permissionDenied: true,
          message: 'You do not have permission to access this page.',
          from: location.pathname,
        }}
        replace
      />
    )
  }

  return children
}
