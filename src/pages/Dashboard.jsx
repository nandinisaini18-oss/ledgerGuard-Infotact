"use client"

import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import useIsAdmin from '../hooks/useIsAdmin'
import { logoutUser } from '../services/user'
import { getTransactions } from '../services/transaction'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Spinner from '../components/ui/Spinner'

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
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await getTransactions()
        if (response.data?.success && response.data?.transactions) {
          setTransactions(response.data.transactions)
        }
      } catch {
        // Silent fail — dashboard still renders user data
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  async function handleLogout() {
    try {
      await logoutUser()
      setUser(null)
      navigate('/')
    } catch {
      // Logout failed
    }
  }

  const totalCount = transactions.length
  const incomeCount = transactions.filter((t) => t.type === 'income').length
  const expenseCount = transactions.filter((t) => t.type === 'expense').length
  const recentTransactions = transactions.slice(0, 5)

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
              <p className="dash__stat-value dash__stat-value--income">{incomeCount}</p>
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
              <p className="dash__stat-value dash__stat-value--expense">{expenseCount}</p>
            </div>
          </Card>
        </div>
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
          <div className="dash__loading">
            <Spinner />
          </div>
        ) : recentTransactions.length === 0 ? (
          <Card className="dash__empty">
            <div className="dash__empty-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <h3 className="dash__empty-title">No transactions yet</h3>
            <p className="dash__empty-desc">
              {isAdmin
                ? 'Create your first transaction to get started.'
                : 'Transactions will appear here once an admin creates them.'}
            </p>
            {isAdmin && (
              <Link to="/transactions/new">
                <Button variant="primary" size="sm">Create Transaction</Button>
              </Link>
            )}
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
