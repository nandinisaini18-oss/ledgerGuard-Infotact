"use client"

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context'
import Spinner from './ui/Spinner'

export default function ProtectedRoute({ children }) {
  const { authenticated, loading } = useAuth()
  const location = useLocation()
  
  if (loading) {
    return (
      <div className="route-loading">
        <Spinner size="lg" />
      </div>
    )
  }
  
  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  
  return children
}