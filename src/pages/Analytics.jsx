import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { getTransactionSummary, getCategoryAnalytics, getTrends } from '../services/analytics'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

const RANGE_OPTIONS = [
  { value: '7d', label: '7d' },
  { value: '30d', label: '30d' },
  { value: '12m', label: '12m' },
]

const compactNumber = new Intl.NumberFormat('en-IN', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

const formatCurrency = (value) => `₹${Number(value).toFixed(2)}`

const formatCompactCurrency = (value) => `₹${compactNumber.format(Number(value))}`

const tooltipFormatter = (value, name) => [formatCurrency(value), name]

const CHART_TICK = { fill: '#64748b', fontSize: 12 }
const CHART_GRID = '#e2e8f0'
const CHART_AXIS_LINE = '#cbd5e1'
const CHART_INCOME = '#059669'
const CHART_EXPENSE = '#dc2626'
const CHART_ACCENT = '#10b981'
const CHART_TOOLTIP = {
  borderRadius: 10,
  border: '1px solid #e2e8f0',
  boxShadow: '0 4px 8px rgba(15, 23, 42, 0.06)',
  fontSize: 13,
}

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
  const [range, setRange] = useState('30d')
  const [trends, setTrends] = useState([])
  const [trendsLoading, setTrendsLoading] = useState(true)
  const [trendsError, setTrendsError] = useState('')
  const [trendsRetryKey, setTrendsRetryKey] = useState(0)

  const handleRetry = useCallback(() => {
    setLoading(true)
    setError('')
    setRetryKey((k) => k + 1)
  }, [])

  const handleTrendsRetry = useCallback(() => {
    setTrendsRetryKey((k) => k + 1)
  }, [])

  useEffect(() => {
    let cancelled = false
    let errors = []

    async function fetchAnalytics() {
      try {
        const summaryRes = await getTransactionSummary()
        if (cancelled) return
        if (summaryRes.data?.success) {
          setSummary({
            totalIncome: summaryRes.data.totalIncome || 0,
            totalExpense: summaryRes.data.totalExpense || 0,
            balance: summaryRes.data.balance || 0,
          })
        }
      } catch {
        errors.push('financial summary')
      }

      try {
        const categoryRes = await getCategoryAnalytics()
        if (cancelled) return
        if (categoryRes.data?.success) {
          setCategories(categoryRes.data.categories || [])
        }
      } catch {
        errors.push('category breakdown')
      }

      if (!cancelled) {
        if (errors.length > 0) {
          setError(`Failed to load: ${errors.join(', ')}`)
        }
        setLoading(false)
      }
    }

    fetchAnalytics()
    return () => { cancelled = true }
  }, [retryKey])

  useEffect(() => {
    let cancelled = false

    async function fetchTrends() {
      setTrendsLoading(true)
      setTrendsError('')
      try {
        const res = await getTrends(range)
        if (cancelled) return
        if (res.data?.success) {
          setTrends(res.data.data || [])
        } else {
          setTrendsError('Unable to load historical trends.')
        }
      } catch {
        if (!cancelled) {
          setTrendsError('Failed to load historical trends.')
        }
      } finally {
        if (!cancelled) setTrendsLoading(false)
      }
    }

    fetchTrends()
    return () => { cancelled = true }
  }, [range, trendsRetryKey])

  if (loading) {
    return <AnalyticsSkeleton />
  }

  const maxCategoryAmount = categories.length > 0
    ? Math.max(...categories.map((cat) => cat.totalAmount), 1)
    : 1

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
                  ₹{summary.totalIncome.toFixed(2)}
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
                  ₹{summary.totalExpense.toFixed(2)}
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
                  ₹{Math.abs(summary.balance).toFixed(2)}
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
                  {categories.map((cat) => {
                    const width = `${Math.max((cat.totalAmount / maxCategoryAmount) * 100, 2)}%`
                    return (
                      <tr key={cat._id} className="transaction-table__row">
                        <td className="transaction-table__cell">
                          <div className="analytics__category-cell">
                            <span className="analytics__category-badge">{cat._id}</span>
                            <div className="analytics__category-bar" aria-hidden="true">
                              <span
                                className="analytics__category-bar-fill"
                                style={{ width }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="transaction-table__cell">
                          <span className="analytics__category-amount">
                            ₹{cat.totalAmount.toFixed(2)}
                          </span>
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

      <section className="analytics__trends-section">
        <div className="analytics__trends-header">
          <h2 className="analytics__section-title">Historical Trends</h2>
          <div className="analytics__range" role="group" aria-label="Time range">
            {RANGE_OPTIONS.map((option) => {
              const isActive = range === option.value
              return (
                <Button
                  key={option.value}
                  variant={isActive ? 'primary' : 'secondary'}
                  size="sm"
                  className="analytics__range-btn"
                  aria-pressed={isActive}
                  onClick={() => setRange(option.value)}
                >
                  {option.label}
                </Button>
              )
            })}
          </div>
        </div>

        {trendsLoading ? (
          <>
            <Card className="analytics__trends-card">
              <div className="shimmer" style={{ width: '160px', height: '20px', marginBottom: '16px' }} />
              <div className="shimmer analytics__chart-skeleton" />
            </Card>
            <Card className="analytics__trends-card">
              <div className="shimmer" style={{ width: '140px', height: '20px', marginBottom: '16px' }} />
              <div className="shimmer analytics__chart-skeleton" />
            </Card>
          </>
        ) : trendsError ? (
          <Card className="analytics__trends-card analytics__trends-error">
            <Alert variant="error" message={trendsError} />
            <Button variant="secondary" size="sm" onClick={handleTrendsRetry}>
              Retry
            </Button>
          </Card>
        ) : trends.length === 0 ? (
          <Card className="analytics__empty">
            <EmptyState
              icon={
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              }
              title="No trend data yet"
              description="Transactions from the selected period will appear here."
            />
          </Card>
        ) : (
          <>
            <Card className="analytics__trends-card">
              <h3 className="analytics__chart-title">Revenue vs Expense</h3>
              <div
                className="analytics__chart"
                role="img"
                aria-label="Line chart comparing income and expense over the selected period"
              >
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={trends} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                    <CartesianGrid stroke={CHART_GRID} strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="label" tick={CHART_TICK} tickLine={false} axisLine={{ stroke: CHART_AXIS_LINE }} />
                    <YAxis tick={CHART_TICK} tickLine={false} axisLine={false} width={58} tickFormatter={formatCompactCurrency} />
                    <Tooltip formatter={tooltipFormatter} contentStyle={CHART_TOOLTIP} />
                    <Legend iconSize={10} wrapperStyle={{ fontSize: 13, paddingTop: 4 }} />
                    <Line
                      type="monotone"
                      dataKey="income"
                      name="Income"
                      stroke={CHART_INCOME}
                      strokeWidth={2}
                      dot={{ r: 3, fill: CHART_INCOME, strokeWidth: 0 }}
                      activeDot={{ r: 5 }}
                      isAnimationActive={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="expense"
                      name="Expense"
                      stroke={CHART_EXPENSE}
                      strokeWidth={2}
                      dot={{ r: 3, fill: CHART_EXPENSE, strokeWidth: 0 }}
                      activeDot={{ r: 5 }}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="analytics__trends-card">
              <h3 className="analytics__chart-title">Balance Trend</h3>
              <div
                className="analytics__chart"
                role="img"
                aria-label="Bar chart showing balance over the selected period"
              >
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={trends} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                    <CartesianGrid stroke={CHART_GRID} strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="label" tick={CHART_TICK} tickLine={false} axisLine={{ stroke: CHART_AXIS_LINE }} />
                    <YAxis tick={CHART_TICK} tickLine={false} axisLine={false} width={58} tickFormatter={formatCompactCurrency} />
                    <Tooltip formatter={tooltipFormatter} contentStyle={CHART_TOOLTIP} />
                    <Legend iconSize={10} wrapperStyle={{ fontSize: 13, paddingTop: 4 }} />
                    <Bar dataKey="balance" name="Balance" radius={[4, 4, 0, 0]} maxBarSize={42} isAnimationActive={false}>
                      {trends.map((point) => (
                        <Cell
                          key={point.label}
                          fill={Number(point.balance) >= 0 ? CHART_ACCENT : CHART_EXPENSE}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </>
        )}
      </section>
    </div>
  )
}
