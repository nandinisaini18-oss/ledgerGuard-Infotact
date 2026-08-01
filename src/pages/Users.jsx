import { useEffect, useState, useCallback, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getUsers, updateUserRole } from '../services/user'
import Card from '../components/ui/Card'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import Modal from '../components/ui/Modal'
import { PageTitleSkeleton } from '../components/ui/Skeleton'
import { getInitials } from '../utils/display'

const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'user', label: 'User' },
]

function UsersTableSkeleton() {
  return (
    <Card className="transaction-list__table-wrapper" role="status" aria-label="Loading users">
      <div className="transaction-table-container">
        <div className="transaction-table" role="table">
          <thead>
            <tr className="transaction-table__header">
              <th scope="col" className="transaction-table__header-cell">Name</th>
              <th scope="col" className="transaction-table__header-cell">Email</th>
              <th scope="col" className="transaction-table__header-cell">Role</th>
              <th scope="col" className="transaction-table__header-cell">Created</th>
              <th scope="col" className="transaction-table__header-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="transaction-table__row">
                <td className="transaction-table__cell">
                  <div className="shimmer" style={{ width: '140px', height: '20px' }} />
                </td>
                <td className="transaction-table__cell">
                  <div className="shimmer" style={{ width: '200px', height: '20px' }} />
                </td>
                <td className="transaction-table__cell">
                  <div className="shimmer" style={{ width: '70px', height: '22px' }} />
                </td>
                <td className="transaction-table__cell">
                  <div className="shimmer" style={{ width: '100px', height: '20px' }} />
                </td>
                <td className="transaction-table__cell">
                  <div className="shimmer" style={{ width: '120px', height: '20px' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </div>
      </div>
    </Card>
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

function UserRow({ user, onOpenRole }) {
  return (
    <tr className="transaction-table__row">
      <td className="transaction-table__cell">
        <span className="user-cell">
          <span
            className={`user-avatar ${user.role === 'admin' ? 'user-avatar--admin' : 'user-avatar--user'}`}
            aria-hidden="true"
          >
            {getInitials(user.fullname)}
          </span>
          <span className="transaction-table__title">{user.fullname || '\u2014'}</span>
        </span>
      </td>
      <td className="transaction-table__cell">{user.email || '\u2014'}</td>
      <td className="transaction-table__cell">
        <span className="company-profile__badge">{user.role || '\u2014'}</span>
      </td>
      <td className="transaction-table__cell">
        <time className="transaction-table__date" dateTime={user.createdAt}>
          {formatDate(user.createdAt)}
        </time>
      </td>
      <td className="transaction-table__cell">
        <div className="transaction-table__actions">
          <Link to={`/users/${user.id}`} className="transaction-table__action">
            View
          </Link>
          <Link to={`/users/${user.id}/edit`} className="transaction-table__action">
            Edit
          </Link>
          <button type="button" className="transaction-table__action" onClick={() => onOpenRole(user)}>
            Change Role
          </button>
        </div>
      </td>
    </tr>
  )
}

export default function Users() {
  const location = useLocation()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [flash, setFlash] = useState(location.state?.fromEdit ? 'User updated successfully' : '')
  const [retryKey, setRetryKey] = useState(0)

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const searchDebounceTimer = useRef(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)
  const [filterLoading, setFilterLoading] = useState(false)
  const hasLoaded = useRef(false)

  const [roleDialogOpen, setRoleDialogOpen] = useState(false)
  const [roleTarget, setRoleTarget] = useState(null)
  const [roleValue, setRoleValue] = useState('')
  const [roleError, setRoleError] = useState('')
  const [roleSaving, setRoleSaving] = useState(false)

  const handleRetry = useCallback(() => {
    setRetryKey((k) => k + 1)
  }, [])

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value
    setSearchQuery(value)
    clearTimeout(searchDebounceTimer.current)
    searchDebounceTimer.current = setTimeout(() => {
      setDebouncedSearch(value)
      setCurrentPage(1)
    }, 400)
  }, [])

  useEffect(() => {
    return () => {
      clearTimeout(searchDebounceTimer.current)
    }
  }, [])

  useEffect(() => {
    async function fetchUsers() {
      if (!hasLoaded.current) {
        setLoading(true)
      } else {
        setFilterLoading(true)
      }
      setError('')
      try {
        const params = { page: currentPage, limit }
        if (debouncedSearch) params.search = debouncedSearch
        const response = await getUsers(params)
        if (response.data?.success && Array.isArray(response.data.users)) {
          setUsers(response.data.users)
          setTotalPages(response.data.totalPages || 1)
          setTotalUsers(response.data.totalUsers || 0)
          hasLoaded.current = true
        } else {
          setError('Failed to load users')
        }
      } catch (err) {
        setError(err.message || 'An unexpected error occurred')
      } finally {
        setLoading(false)
        setFilterLoading(false)
      }
    }

    fetchUsers()
  }, [currentPage, limit, debouncedSearch, retryKey])

  useEffect(() => {
    if (!flash) return
    const timer = setTimeout(() => setFlash(''), 5000)
    return () => clearTimeout(timer)
  }, [flash])

  function handleOpenRole(user) {
    setRoleTarget(user)
    setRoleValue(user.role)
    setRoleError('')
    setRoleDialogOpen(true)
  }

  function handleCloseRole() {
    setRoleDialogOpen(false)
    setRoleTarget(null)
    setRoleValue('')
    setRoleError('')
  }

  async function handleSaveRole() {
    if (!roleTarget) return
    setRoleError('')
    if (!roleValue) {
      setRoleError('Please select a role')
      return
    }

    setRoleSaving(true)
    try {
      const response = await updateUserRole(roleTarget.id, roleValue)
      if (response.data?.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === roleTarget.id ? { ...u, role: roleValue } : u))
        )
        setFlash('User role updated successfully')
        handleCloseRole()
      } else {
        setRoleError('Failed to update role')
      }
    } catch (err) {
      setRoleError(err.message || 'Failed to update role')
    } finally {
      setRoleSaving(false)
    }
  }

  const initialLoading = loading && users.length === 0

  if (initialLoading) {
    return (
      <div className="transaction-list">
        <PageTitleSkeleton />
        <UsersTableSkeleton />
      </div>
    )
  }

  return (
    <div className="transaction-list">
      <div className="transaction-list__header">
        <div>
          <h1 className="transaction-list__title">Users</h1>
          <p className="transaction-list__subtitle">
            View all users within your company
          </p>
        </div>
        <Link to="/users/new">
          <Button variant="primary">New User</Button>
        </Link>
      </div>

      {flash && (
        <div className="transaction-list__flash" role="status">
          <Alert variant="success" message={flash} />
        </div>
      )}

      {error && (
        <div className="transaction-list__error" role="alert">
          <Alert variant="error" message={error} />
          <div style={{ marginTop: 'var(--space-3)' }}>
            <Button variant="secondary" size="sm" onClick={handleRetry}>
              Retry
            </Button>
          </div>
        </div>
      )}

      <div className="transaction-list__filters">
        <div className="transaction-list__filter transaction-list__filter--search">
          <label htmlFor="user-search" className="transaction-list__filter-label">Search</label>
          <div className="transaction-list__search-wrapper">
            <svg className="transaction-list__search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              id="user-search"
              type="text"
              className="form-field__input transaction-list__filter-input transaction-list__filter-search"
              placeholder="Search by name or email"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div className="transaction-list__filter">
          <label htmlFor="user-limit" className="transaction-list__filter-label">Per page</label>
          <select
            id="user-limit"
            className="form-field__input transaction-list__filter-select"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {filterLoading ? (
        <UsersTableSkeleton />
      ) : users.length === 0 ? (
        <Card className="transaction-list__empty">
          <EmptyState
            icon={
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            }
            title={debouncedSearch ? 'No users found' : 'No users yet'}
            description={
              debouncedSearch
                ? 'No users match your search.'
                : 'Users will appear here once they are added to your company.'
            }
            action={
              !debouncedSearch ? (
                <Link to="/users/new">
                  <Button variant="primary">Add User</Button>
                </Link>
              ) : null
            }
          />
        </Card>
      ) : (
        <Card className="transaction-list__table-wrapper">
          <div className="transaction-table-container">
            <table className="transaction-table" role="table">
              <thead>
                <tr className="transaction-table__header">
                  <th scope="col" className="transaction-table__header-cell">Name</th>
                  <th scope="col" className="transaction-table__header-cell">Email</th>
                  <th scope="col" className="transaction-table__header-cell">Role</th>
                  <th scope="col" className="transaction-table__header-cell">Created</th>
                  <th scope="col" className="transaction-table__header-cell">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <UserRow key={user.id} user={user} onOpenRole={handleOpenRole} />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {!filterLoading && totalPages > 1 && (
        <div className="pagination">
          <div className="pagination__info">
            Page {currentPage} of {totalPages} ({totalUsers} users)
          </div>
          <div className="pagination__controls">
            <button
              type="button"
              className="pagination__btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Previous
            </button>
            <div className="pagination__pages">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  if (totalPages <= 7) return true
                  if (p === 1 || p === totalPages) return true
                  if (Math.abs(p - currentPage) <= 1) return true
                  return false
                })
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) {
                    acc.push('...')
                  }
                  acc.push(p)
                  return acc
                }, [])
                .map((item, idx) =>
                  item === '...' ? (
                    <span key={`ellipsis-${idx}`} className="pagination__ellipsis">...</span>
                  ) : (
                    <button
                      key={item}
                      type="button"
                      className={`pagination__page ${item === currentPage ? 'pagination__page--active' : ''}`}
                      onClick={() => setCurrentPage(item)}
                    >
                      {item}
                    </button>
                  )
                )}
            </div>
            <button
              type="button"
              className="pagination__btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      <Modal
        isOpen={roleDialogOpen}
        onClose={handleCloseRole}
        title="Change Role"
        size="sm"
      >
        <div className="delete-dialog">
          <p className="delete-dialog__message">
            Change the role for <strong>{roleTarget?.fullname || '\u2014'}</strong>.
          </p>
          <div className="form-field">
            <label htmlFor="role" className="form-field__label">
              Role
            </label>
            <div className="form-field__input-wrapper">
              <select
                id="role"
                className={`form-field__input ${roleError ? 'form-field--error' : ''}`}
                value={roleValue}
                onChange={(e) => {
                  setRoleValue(e.target.value)
                  setRoleError('')
                }}
              >
                {roleOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            {roleError && (
              <span className="form-field__error" role="alert">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {roleError}
              </span>
            )}
          </div>
          <div className="modal__actions">
            <Button variant="secondary" onClick={handleCloseRole} disabled={roleSaving}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveRole} loading={roleSaving} disabled={roleSaving}>
              Save Role
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
