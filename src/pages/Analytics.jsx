"use client"

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { getTransactionSummary, getCategoryAnalytics } from '../services/analytics'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'

function AnalyticsSkeleton() {
  return (
    <div className="analytics" role="status" aria-label="Loading analytics">
      <div className="analytics__header">
        <div>
          <div className="shimmer" style={{ width: '140px', height: '28px', marginBottom: '8px' }} />
          <div className="shimmer" style={{ width: '260px', height: '16px' }} />
        </div>
      </div>

      <div className="analytics__summary-grid">
        {[0, 1, 2].map((i) => (
          <Card key={i} className="analytics__summary-card">
            <div className="analytics__summary-icon analytics__summary-icon--skeleton">
              <div className="shimmer" style={{ width: '20px', height: '20px', borderRadius: 'var(--radius-full)' }} />
            </div>
            <div className="analytics__summary-body">
              <div className="shimmer" style={{ width: '80px', height: '14px', marginBottom: '6px' }} />
              <div className="shimmer" style={{ width: '100px', height: '24px' }} />
            </div>
          </Card>
        ))}
      </div>

      <div className="analytics__categories-section">
        <div className="shimmer" style={{ width: '180px', height: '22px', marginBottom: '16px' }} />
        <Card className="analytics__categories-card">
          <div className="transaction-table-container">
            <table className="transaction-table" role="table">
              <thead>
                <tr className="transaction-table__header">
                  <th scope="col" className="transaction-table__header-cell">Category</th>
                  <th scope="col" className="transaction-table__header-cell">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="transaction-table__row">
                    <td className="transaction-table__cell">
                      <div className="shimmer" style={{ width: '120px', height: '20px' }} />
                    </td>
                    <td className="transaction-table__cell">
                      <div className="shimmer" style={{ width: '90px', height: '20px' }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default function Analytics() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [summary, setSummary] = useState(null)
  const [categories, setCategories] = useState([])
  const [retryKey, setRetryKey] = useState(0)

  const handleRetry = useCallback(() => {
    setLoading(true)
    setError('')
    setRetryKey((k) => k + 1)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function fetchAnalytics() {
      try {
        const [summaryRes, categoryRes] = await Promise.all([
          getTransactionSummary(),
          getCategoryAnalytics(),
        ])

        if (cancelled) return

        if (summaryRes.data?.success) {
          setSummary({
            totalIncome: summaryRes.data.totalIncome || 0,
            totalExpense: summaryRes.data.totalExpense || 0,
            balance: summaryRes.data.balance || 0,
          })
        }

        if (categoryRes.data?.success) {
          setCategories(categoryRes.data.categories || [])
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load analytics data')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchAnalytics()
    return () => { cancelled = true }
  }, [retryKey])

  if (loading) {
    return <AnalyticsSkeleton />
  }

  return (
    <div className="analytics">
      <div className="analytics__header">
        <div>
          <h1 className="analytics__title">Analytics</h1>
          <p className="analytics__subtitle">
            Financial overview for {user?.companyId ? 'your company' : 'your account'}
          </p>
        </div>
      </div>

      {error && (
        <div className="analytics__error" role="alert">
          <Alert variant="error" message={error} />
          <Button variant="secondary" size="sm" onClick={handleRetry}>
            Retry
          </Button>
        </div>
      )}

      {summary && (
        <section className="analytics__summary-section">
          <h2 className="analytics__section-title">Financial Summary</h2>
          <div className="analytics__summary-grid">
            <Card className="analytics__summary-card">
              <div className="analytics__summary-icon analytics__summary-icon--income">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="19 12 12 5 5 12" />
                </svg>
              </div>
              <div className="analytics__summary-body">
                <p className="analytics__summary-label">Total Income</p>
                <p className="analytics__summary-value analytics__summary-value--income">
                  ${summary.totalIncome.toFixed(2)}
                </p>
              </div>
            </Card>

            <Card className="analytics__summary-card">
              <div className="analytics__summary-icon analytics__summary-icon--expense">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <polyline points="19 12 12 19 5 12" />
                </svg>
              </div>
              <div className="analytics__summary-body">
                <p className="analytics__summary-label">Total Expense</p>
                <p className="analytics__summary-value analytics__summary-value--expense">
                  ${summary.totalExpense.toFixed(2)}
                </p>
              </div>
            </Card>

            <Card className="analytics__summary-card">
              <div className="analytics__summary-icon analytics__summary-icon--balance">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div className="analytics__summary-body">
                <p className="analytics__summary-label">Balance</p>
                <p className={`analytics__summary-value ${summary.balance >= 0 ? 'analytics__summary-value--income' : 'analytics__summary-value--expense'}`}>
                  ${Math.abs(summary.balance).toFixed(2)}
                  {summary.balance < 0 && ' (deficit)'}
                </p>
              </div>
            </Card>
          </div>
        </section>
      )}

      <section className="analytics__categories-section">
        <h2 className="analytics__section-title">Category Breakdown</h2>
        {categories.length === 0 ? (
          <Card className="analytics__empty">
            <EmptyState
              icon={
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              }
              title="No category data"
              description="Create transactions to see a breakdown of your spending by category."
            />
          </Card>
        ) : (
          <Card className="analytics__categories-card">
            <div className="transaction-table-container">
              <table className="transaction-table" role="table">
                <thead>
                  <tr className="transaction-table__header">
                    <th scope="col" className="transaction-table__header-cell">Category</th>
                    <th scope="col" className="transaction-table__header-cell">Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat._id} className="transaction-table__row">
                      <td className="transaction-table__cell">
                        <span className="analytics__category-badge">{cat._id}</span>
                      </td>
                      <td className="transaction-table__cell">
                        <span className="analytics__category-amount">
                          ${cat.totalAmount.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </section>
    </div>
  )
}
