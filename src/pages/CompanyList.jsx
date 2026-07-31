import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getCompanies } from '../services/company'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Alert from '../components/ui/Alert'
import EmptyState from '../components/ui/EmptyState'
import { PageTitleSkeleton, TransactionTableSkeleton } from '../components/ui/Skeleton'

function formatDate(value) {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function CompanyRow({ company }) {
  const statusClass =
    company.status === 'active' ? 'company-list__status company-list__status--active' : 'company-list__status company-list__status--inactive'

  return (
    <tr className="transaction-table__row">
      <td className="transaction-table__cell">
        <div className="transaction-table__title">{company.companyName}</div>
      </td>
      <td className="transaction-table__cell">
        <span className="company-list__email">{company.email}</span>
      </td>
      <td className="transaction-table__cell">
        <span className="company-list__subscription">{company.subscription}</span>
      </td>
      <td className="transaction-table__cell">
        <span className={statusClass}>
          <span className="company-list__status-dot" aria-hidden="true" />
          {company.status}
        </span>
      </td>
      <td className="transaction-table__cell">
        <time className="transaction-table__date" dateTime={company.createdAt}>
          {formatDate(company.createdAt)}
        </time>
      </td>
      <td className="transaction-table__cell">
        <div className="transaction-table__actions">
          <Link to={`/companies/${company.companyId}`} className="transaction-table__action">
            View
          </Link>
        </div>
      </td>
    </tr>
  )
}

export default function CompanyList() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryKey, setRetryKey] = useState(0)

  const handleRetry = useCallback(() => {
    setRetryKey((k) => k + 1)
  }, [])

  useEffect(() => {
    let active = true

    async function fetchCompanies() {
      setLoading(true)
      setError('')
      try {
        const response = await getCompanies()
        if (!active) return
        if (response.data?.success && Array.isArray(response.data.companies)) {
          setCompanies(response.data.companies)
        } else {
          setError('Failed to load companies')
        }
      } catch (err) {
        if (active) setError(err.message || 'An unexpected error occurred')
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchCompanies()

    return () => {
      active = false
    }
  }, [retryKey])

  if (loading) {
    return (
      <div className="transaction-list">
        <PageTitleSkeleton />
        <TransactionTableSkeleton />
      </div>
    )
  }

  return (
    <div className="transaction-list company-list">
      <div className="transaction-list__header">
        <div>
          <h1 className="transaction-list__title">Companies</h1>
          <p className="transaction-list__subtitle">All registered companies</p>
        </div>
      </div>

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

      {!error && companies.length === 0 ? (
        <Card className="transaction-list__empty">
          <EmptyState
            icon={
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 21h18" />
                <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
                <path d="M9 7h1" />
                <path d="M14 7h1" />
                <path d="M9 11h1" />
                <path d="M14 11h1" />
                <path d="M9 15h1" />
                <path d="M14 15h1" />
              </svg>
            }
            title="No companies yet"
            description="Companies will appear here once they are registered."
          />
        </Card>
      ) : (
        !error && (
          <Card className="transaction-list__table-wrapper">
            <div className="transaction-table-container">
              <table className="transaction-table" role="table">
                <thead>
                  <tr className="transaction-table__header">
                    <th scope="col" className="transaction-table__header-cell">Company Name</th>
                    <th scope="col" className="transaction-table__header-cell">Email</th>
                    <th scope="col" className="transaction-table__header-cell">Subscription</th>
                    <th scope="col" className="transaction-table__header-cell">Status</th>
                    <th scope="col" className="transaction-table__header-cell">Created Date</th>
                    <th scope="col" className="transaction-table__header-cell">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((company) => (
                    <CompanyRow key={company.companyId} company={company} />
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )
      )}
    </div>
  )
}
