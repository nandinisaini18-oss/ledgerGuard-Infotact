import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getUserById } from '../services/user'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import { getInitials } from '../utils/display'

function UserDetailsSkeleton() {
  return (
    <div className="view-transaction" role="status" aria-label="Loading user">
      <header className="vt-header">
        <div className="vt-header__left">
          <div className="shimmer" style={{ width: '120px', height: '18px' }} />
          <div className="shimmer" style={{ width: '16px', height: '16px', borderRadius: 'var(--radius-sm)' }} />
          <div className="shimmer" style={{ width: '140px', height: '18px' }} />
        </div>
      </header>

      <div className="vt-details">
        <div className="shimmer" style={{ width: '80px', height: '14px', marginBottom: 'var(--space-4)' }} />
        <div className="vt-details__grid">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="vt-meta-item">
              <div className="shimmer" style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-md)' }} />
              <div className="vt-meta-item__content">
                <div className="shimmer" style={{ width: '90px', height: '10px' }} />
                <div className="shimmer" style={{ width: '160px', height: '16px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function formatDate(value) {
  if (!value) return '\u2014'
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function UserDetails() {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryKey, setRetryKey] = useState(0)

  const handleRetry = useCallback(() => {
    setLoading(true)
    setError('')
    setRetryKey((k) => k + 1)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function fetchUser() {
      try {
        const response = await getUserById(id)
        if (cancelled) return
        if (response.data?.success && response.data?.user) {
          setUser(response.data.user)
        } else {
          setError('User not found')
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load user')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchUser()
    return () => { cancelled = true }
  }, [id, retryKey])

  if (loading) {
    return <UserDetailsSkeleton />
  }

  if (error || !user) {
    return (
      <div className="view-transaction__error" role="alert">
        <div className="view-transaction__error-card">
          <div className="view-transaction__error-content">
            <Alert variant="error" message={error || 'User not found'} />
            <div className="view-transaction__actions">
              <Link to="/users">
                <Button variant="secondary">Back to Users</Button>
              </Link>
              {error && (
                <Button variant="ghost" onClick={handleRetry}>
                  Retry
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="view-transaction user-details">
      <header className="vt-header">
        <div className="vt-header__left">
          <Link to="/users" className="vt-header__back" aria-label="Back to users">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Users</span>
          </Link>
          <svg className="vt-header__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span className="vt-header__current">{user.fullname || '\u2014'}</span>
        </div>
      </header>

      <div className="user-details__profile">
        <span
          className={`user-details__avatar ${user.role === 'admin' ? 'user-details__avatar--admin' : 'user-details__avatar--user'}`}
          aria-hidden="true"
        >
          {getInitials(user.fullname)}
        </span>
        <div className="user-details__identity">
          <p className="user-details__name">{user.fullname || '\u2014'}</p>
          <p className="user-details__email">{user.email || '\u2014'}</p>
        </div>
      </div>

      <div className="vt-details">
        <h2 className="vt-details__heading">User Details</h2>
        <div className="vt-details__grid">
          <div className="vt-meta-item">
            <div className="vt-meta-item__icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="vt-meta-item__content">
              <span className="vt-meta-item__label">Name</span>
              <span className="vt-meta-item__value">{user.fullname || '\u2014'}</span>
            </div>
          </div>

          <div className="vt-meta-item">
            <div className="vt-meta-item__icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
            <div className="vt-meta-item__content">
              <span className="vt-meta-item__label">Email</span>
              <span className="vt-meta-item__value">{user.email || '\u2014'}</span>
            </div>
          </div>

          <div className="vt-meta-item">
            <div className="vt-meta-item__icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="vt-meta-item__content">
              <span className="vt-meta-item__label">Role</span>
              <span className="vt-meta-item__value">
                <span className="company-profile__badge">{user.role || '\u2014'}</span>
              </span>
            </div>
          </div>

          <div className="vt-meta-item">
            <div className="vt-meta-item__icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
            </div>
            <div className="vt-meta-item__content">
              <span className="vt-meta-item__label">Created</span>
              <time className="vt-meta-item__value" dateTime={user.createdAt}>
                {formatDate(user.createdAt)}
              </time>
            </div>
          </div>

          <div className="vt-meta-item">
            <div className="vt-meta-item__icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M16 16h5v5" />
              </svg>
            </div>
            <div className="vt-meta-item__content">
              <span className="vt-meta-item__label">Last Updated</span>
              <time className="vt-meta-item__value" dateTime={user.updatedAt}>
                {formatDate(user.updatedAt)}
              </time>
            </div>
          </div>

          <div className="vt-meta-item">
            <div className="vt-meta-item__icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2 2 7l10 5 10-5-10-5Z" />
                <path d="m2 17 10 5 10-5" />
                <path d="m2 12 10 5 10-5" />
              </svg>
            </div>
            <div className="vt-meta-item__content">
              <span className="vt-meta-item__label">User ID</span>
              <span className="vt-meta-item__value vt-meta-item__value--mono">{user.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
