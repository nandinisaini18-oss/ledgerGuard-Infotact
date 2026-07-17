import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context'
import Spinner from './ui/Spinner'

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="route-loading">
        <Spinner size="lg" />
      </div>
    )
  }

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
