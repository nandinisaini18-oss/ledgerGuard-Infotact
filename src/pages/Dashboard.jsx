"use client"

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { logoutUser } from '../services/user'
import Card from '../components/ui/Card'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'

const userFields = [
  { label: 'Full Name', key: 'fullname' },
  { label: 'Email', key: 'email' },
  { label: 'Role', key: 'role' },
  { label: 'Company ID', key: 'companyId' },
]

export default function Dashboard() {
  const { user, loading, setUser } = useAuth()
  const navigate = useNavigate()
  const [logoutError, setLogoutError] = useState('')
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  async function handleLogout() {
    setLogoutError('')
    setIsLoggingOut(true)
    try {
      await logoutUser()
      setUser(null)
      navigate('/')
    } catch {
      setLogoutError('Something went wrong while logging out. Please try again.')
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (loading) {
    return null
  }

  return (
    <div className="form-container">
      <div className="form-container__header">
        <h1 className="form-container__title">Dashboard</h1>
        <p className="form-container__subtitle">Welcome, {user?.fullname}</p>
      </div>

      <div className="form-container__body">
        {logoutError && (
          <div style={{ marginBottom: 'var(--space-5)' }}>
            <Alert variant="error" message={logoutError} />
          </div>
        )}

        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {userFields.map(({ label, key }) => (
              <div key={key}>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-1)' }}>
                  {label}
                </p>
                <p style={{ fontSize: '0.9375rem', color: 'var(--color-gray-900)' }}>
                  {user?.[key] || '\u2014'}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <div className="form-container__actions">
          <Button
            variant="primary"
            fullWidth
            loading={isLoggingOut}
            disabled={isLoggingOut}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}