"use client"

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context'

export default function ProtectedRoute({ children }) {
  const { authenticated, loading } = useAuth()
  const location = useLocation()
  
  if (loading) {
    return null
  }
  
  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  
  return children
}