"use client"

import { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import useIsAdmin from '../hooks/useIsAdmin'
import { logoutUser } from '../services/user'
import { getTransactions } from '../services/transaction'
import { getTransactionSummary } from '../services/analytics'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import Alert from '../components/ui/Alert'

function DashboardStatsSkeleton() {
  return (
    <div className="dash__stats-grid" role="status" aria-label="Loading statistics">
      {[0, 1, 2].map((i) => (
        <Card key={i} className="dash__stat-card">
          <div className="shimmer" style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-lg)' }} />
          <div className="dash__stat-body">
            <div className="shimmer" style={{ width: '80px', height: '14px', marginBottom: '6px' }} />
            <div className="shimmer" style={{ width: '100px', height: '24px' }} />
          </div>
        </Card>
      ))}
    </div>
  )
}

function DashboardRecentSkeleton() {
  return (
    <Card className="dash__recent-card" role="status" aria-label="Loading recent transactions">
      <div className="transaction-table-container">
        <table className="transaction-table" role="table">
          <thead>
            <tr className="transaction-table__header">
              <th scope="col" className="transaction-table__header-cell">Title</th>
              <th scope="col" className="transaction-table__header-cell">Category</th>
              <th scope="col" className="transaction-table__header-cell">Amount</th>
              <th scope="col" className="transaction-table__header-cell">Type</th>
              <th scope="col" className="transaction-table__header-cell">Date</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="transaction-table__row">
                <td className="transaction-table__cell">
                  <div className="shimmer" style={{ width: '140px', height: '20px' }} />
                </td>
                <td className="transaction-table__cell">
                  <div className="shimmer" style={{ width: '80px', height: '24px', borderRadius: 'var(--radius-full)' }} />
                </td>
                <td className="transaction-table__cell">
                  <div className="shimmer" style={{ width: '70px', height: '20px' }} />
                </td>
                <td className="transaction-table__cell">
                  <div className="shimmer" style={{ width: '90px', height: '20px' }} />
                </td>
                <td className="transaction-table__cell">
                  <div className="shimmer" style={{ width: '100px', height: '20px' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

const typeIcons = {
  income: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="19 12 12 5 5 12" />
    </svg>
  ),
  expense: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </svg>
  ),
}

export default function Dashboard() {
  const { user, setUser } = useAuth()
  const isAdmin = useIsAdmin()
  const navigate = useNavigate()
  const [recentTransactions, setRecentTransactions] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpense, setTotalExpense] = useState(0)
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

    async function fetchDashboardData() {
      try {
        const [recentRes, summaryRes] = await Promise.all([
          getTransactions({ page: 1, limit: 5 }),
          getTransactionSummary(),
        ])

        if (cancelled) return

        if (recentRes.data?.success) {
          setRecentTransactions(recentRes.data.transactions || [])
          setTotalCount(recentRes.data.totalTransactions || 0)
        }

        if (summaryRes.data?.success) {
          setTotalIncome(summaryRes.data.totalIncome || 0)
          setTotalExpense(summaryRes.data.totalExpense || 0)
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load dashboard data')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchDashboardData()
    return () => { cancelled = true }
  }, [retryKey])

  async function handleLogout() {
    try {
      await logoutUser()
      setUser(null)
      navigate('/')
    } catch {
      // Logout failed
    }
  }

  return (
    <div className="dash">
      {/* Welcome Section */}
      <section className="dash__welcome">
        <div className="dash__welcome-content">
          <p className="dash__eyebrow">Welcome back</p>
          <h1 className="dash__greeting">{user?.fullname || 'User'}</h1>
          <p className="dash__meta">
            <span className="dash__meta-badge">
              {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
            </span>
            <span className="dash__meta-separator" />
            <span className="dash__meta-id">Company {user?.companyId}</span>
          </p>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="dash__section">
        <h2 className="dash__section-title">Quick Actions</h2>
        <div className="dash__actions-grid">
          {isAdmin && (
            <Link to="/transactions/new" className="dash__action-card">
              <div className="dash__action-icon dash__action-icon--primary">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>
              <div className="dash__action-text">
                <h3 className="dash__action-title">New Transaction</h3>
                <p className="dash__action-desc">Record an income or expense entry</p>
              </div>
              <svg className="dash__action-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          )}

          <Link to="/transactions" className="dash__action-card">
            <div className="dash__action-icon dash__action-icon--secondary">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </div>
            <div className="dash__action-text">
              <h3 className="dash__action-title">View Transactions</h3>
              <p className="dash__action-desc">Browse and manage all entries</p>
            </div>
            <svg className="dash__action-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Statistics */}
      <section className="dash__section">
        <h2 className="dash__section-title">Overview</h2>
        {loading ? (
          <DashboardStatsSkeleton />
        ) : error ? (
          <div className="dash__error" role="alert">
            <Alert variant="error" message={error} />
            <Button variant="secondary" size="sm" onClick={handleRetry}>
              Retry
            </Button>
          </div>
        ) : (
          <div className="dash__stats-grid">
            <Card className="dash__stat-card">
              <div className="dash__stat-icon dash__stat-icon--total">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div className="dash__stat-body">
                <p className="dash__stat-label">Total Transactions</p>
                <p className="dash__stat-value">{totalCount}</p>
              </div>
            </Card>

            <Card className="dash__stat-card">
              <div className="dash__stat-icon dash__stat-icon--income">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="19 12 12 5 5 12" />
                </svg>
              </div>
              <div className="dash__stat-body">
                <p className="dash__stat-label">Income</p>
                <p className="dash__stat-value dash__stat-value--income">${totalIncome.toFixed(2)}</p>
              </div>
            </Card>

            <Card className="dash__stat-card">
              <div className="dash__stat-icon dash__stat-icon--expense">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <polyline points="19 12 12 19 5 12" />
                </svg>
              </div>
              <div className="dash__stat-body">
                <p className="dash__stat-label">Expenses</p>
                <p className="dash__stat-value dash__stat-value--expense">${totalExpense.toFixed(2)}</p>
              </div>
            </Card>
          </div>
        )}
      </section>

      {/* Recent Transactions */}
      <section className="dash__section">
        <div className="dash__section-header">
          <h2 className="dash__section-title">Recent Transactions</h2>
          {totalCount > 0 && (
            <Link to="/transactions" className="dash__section-link">
              View all
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          )}
        </div>

        {loading ? (
          <DashboardRecentSkeleton />
        ) : recentTransactions.length === 0 ? (
          <Card className="dash__empty">
            <EmptyState
              icon={
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              }
              title="No transactions yet"
              description={
                isAdmin
                  ? 'Create your first transaction to get started.'
                  : 'Transactions will appear here once an admin creates them.'
              }
              action={
                isAdmin && (
                  <Link to="/transactions/new">
                    <Button variant="primary" size="sm">Create Transaction</Button>
                  </Link>
                )
              }
            />
          </Card>
        ) : (
          <Card className="dash__recent-card">
            <div className="transaction-table-container">
              <table className="transaction-table" role="table">
                <thead>
                  <tr className="transaction-table__header">
                    <th scope="col" className="transaction-table__header-cell">Title</th>
                    <th scope="col" className="transaction-table__header-cell">Category</th>
                    <th scope="col" className="transaction-table__header-cell">Amount</th>
                    <th scope="col" className="transaction-table__header-cell">Type</th>
                    <th scope="col" className="transaction-table__header-cell">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((t) => {
                    const isIncome = t.type === 'income'
                    const formattedDate = new Date(t.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })

                    return (
                      <tr key={t._id} className="transaction-table__row">
                        <td className="transaction-table__cell">
                          <Link to={`/transactions/${t._id}`} className="transaction-table__title dash__table-link">
                            {t.title}
                          </Link>
                        </td>
                        <td className="transaction-table__cell">
                          <span className={`transaction-table__category ${isIncome ? 'income' : 'expense'}`}>
                            {t.category}
                          </span>
                        </td>
                        <td className="transaction-table__cell">
                          <span className={`transaction-table__amount ${isIncome ? 'income' : 'expense'}`}>
                            {isIncome ? '+' : '-'}${t.amount.toFixed(2)}
                          </span>
                        </td>
                        <td className="transaction-table__cell">
                          <span className="transaction-table__type">
                            {typeIcons[t.type]}
                            {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                          </span>
                        </td>
                        <td className="transaction-table__cell">
                          <time className="transaction-table__date" dateTime={t.createdAt}>
                            {formattedDate}
                          </time>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </section>
    </div>
  )
}
