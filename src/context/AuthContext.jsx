"use client"

import { createContext, useContext, useState, useEffect } from 'react'
import { getMe } from '../services/user'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await getMe()
        if (response.data?.success && response.data?.user) {
          setUser(response.data.user)
        }
      } catch (error) {
        if (error.response?.status === 401 || 
            error.response?.status === 403 ||
            error.message?.includes('Invalid or expired token')) {
          setUser(null)
        }
      } finally {
        setLoading(false)
      }
    }

    restoreSession()
  }, [])

  const value = {
    user,
    loading,
    authenticated: !!user,
    setUser,
    refreshUser: async () => {
      setLoading(true)
      try {
        const response = await getMe()
        if (response.data?.success && response.data?.user) {
          setUser(response.data.user)
        } else {
          setUser(null)
        }
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
