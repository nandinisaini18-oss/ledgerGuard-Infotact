import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getTransactionById, deleteTransaction } from '../services/transaction'
import { useAuth } from '../context'
import useIsAdmin from '../hooks/useIsAdmin'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import Modal from '../components/ui/Modal'

function ViewTransactionSkeleton() {
  return (
    <div className="view-transaction" role="status" aria-label="Loading transaction">
      <header className="vt-header">
        <div className="vt-header__left">
          <div className="shimmer" style={{ width: '120px', height: '18px' }} />
          <div className="shimmer" style={{ width: '16px', height: '16px', borderRadius: 'var(--radius-sm)' }} />
          <div className="shimmer" style={{ width: '140px', height: '18px' }} />
        </div>
        <div className="vt-header__actions">
          <div className="shimmer" style={{ width: '80px', height: '32px', borderRadius: 'var(--radius-md)' }} />
          <div className="shimmer" style={{ width: '80px', height: '32px', borderRadius: 'var(--radius-md)' }} />
        </div>
      </header>

      <div className="vt-grid">
        <div className="vt-grid__main">
          <div className="vt-hero">
            <div className="vt-hero__accent" aria-hidden="true" />
            <div className="vt-hero__body">
              <div className="vt-hero__badges">
                <div className="shimmer" style={{ width: '80px', height: '30px', borderRadius: 'var(--radius-full)' }} />
                <div className="shimmer" style={{ width: '100px', height: '30px', borderRadius: 'var(--radius-full)' }} />
              </div>
              <div className="vt-hero__amount-row">
                <div className="shimmer" style={{ width: '200px', height: '44px' }} />
              </div>
              <div className="shimmer" style={{ width: '100%', height: '60px', borderRadius: 'var(--radius-lg)' }} />
            </div>
          </div>

          <div className="vt-details">
            <div className="shimmer" style={{ width: '60px', height: '14px', marginBottom: 'var(--space-4)' }} />
            <div className="vt-details__grid">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="vt-meta-item">
                  <div className="shimmer" style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-lg)' }} />
                  <div className="vt-meta-item__content">
                    <div className="shimmer" style={{ width: '90px', height: '10px' }} />
                    <div className="shimmer" style={{ width: '160px', height: '16px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
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

function formatDateShort(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

function formatShortId(id) {
  if (!id) return '—'
  const str = String(id)
  if (str.length <= 12) return str
  return `${str.slice(0, 8)}...${str.slice(-4)}`
}

export default function ViewTransaction() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const isAdmin = useIsAdmin()
  const [transaction, setTransaction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [retryKey, setRetryKey] = useState(0)

  const handleRetry = useCallback(() => {
    setLoading(true)
    setError('')
    setRetryKey((k) => k + 1)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function fetchTransaction() {
      try {
        const response = await getTransactionById(id)
        if (cancelled) return

        if (response.data?.success && response.data?.transaction) {
          setTransaction(response.data.transaction)
        } else {
          setError('Transaction not found')
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load transaction')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchTransaction()
    return () => { cancelled = true }
  }, [id, retryKey])

  function handleDeleteClick() {
    setDeleteDialogOpen(true)
  }

  async function handleConfirmDelete() {
    if (!transaction) return

    setDeleting(true)
    try {
      const response = await deleteTransaction(transaction._id)
      if (response.data?.success) {
        navigate('/transactions', { state: { fromDelete: true, message: 'Transaction deleted successfully' } })
      } else {
        setError('Failed to delete transaction')
      }
    } catch (err) {
      setError(err.message || 'Failed to delete transaction')
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  function handleCancelDelete() {
    setDeleteDialogOpen(false)
  }

  if (loading) {
    return <ViewTransactionSkeleton />
  }

  if (error) {
    return (
      <div className="view-transaction__error" role="alert">
        <div className="view-transaction__error-card">
          <div className="view-transaction__error-content">
            <Alert variant="error" message={error} />
            <div className="view-transaction__actions">
              <Link to="/transactions">
                <Button variant="secondary">Back to Transactions</Button>
              </Link>
              <Button variant="ghost" onClick={handleRetry}>
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="view-transaction__error" role="alert">
        <div className="view-transaction__error-card">
          <div className="view-transaction__error-content">
            <Alert variant="error" message="Transaction not found" />
            <div className="view-transaction__actions">
              <Link to="/transactions">
                <Button variant="secondary">Back to Transactions</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const isIncome = transaction.type === 'income'
  const typeClass = isIncome ? 'income' : 'expense'

  return (
    <div className="view-transaction">
      {/* Navigation Header */}
      <header className="vt-header">
        <div className="vt-header__left">
          <Link to="/transactions" className="vt-header__back" aria-label="Back to transactions">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Transactions</span>
          </Link>
          <svg className="vt-header__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span className="vt-header__current">{transaction.title}</span>
        </div>
        <div className="vt-header__actions">
          {isAdmin && (
            <Link to={`/transactions/${transaction._id}/edit`}>
              <Button variant="secondary" size="sm">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  <path d="m15 5 4 4" />
                </svg>
                Edit
              </Button>
            </Link>
          )}
          {isAdmin && (
            <Button variant="ghost" size="sm" onClick={handleDeleteClick} className="vt-header__delete-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              Delete
            </Button>
          )}
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="vt-grid">
        {/* Left Column: Hero + Details */}
        <div className="vt-grid__main">

          {/* Transaction Hero Card */}
          <div className={`vt-hero vt-hero--${typeClass}`}>
            <div className="vt-hero__accent" aria-hidden="true" />
            <div className="vt-hero__body">
              {/* Top: Badges */}
              <div className="vt-hero__badges">
                <span className={`vt-badge vt-badge--${typeClass}`}>
                  {typeIcons[transaction.type]}
                  {isIncome ? 'Income' : 'Expense'}
                </span>
                <span className="vt-badge vt-badge--category">
                  {transaction.category}
                </span>
              </div>

              {/* Amount */}
              <div className="vt-hero__amount-row">
                <span className={`vt-hero__amount vt-hero__amount--${typeClass}`}>
                  {isIncome ? '+' : '−'}₹{(Number(transaction.amount) || 0).toFixed(2)}
                </span>
              </div>

              {/* Description */}
              {transaction.description && (
                <div className="vt-hero__description">
                  <p className="vt-hero__description-text">{transaction.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Details Panel */}
          <div className="vt-details">
            <h2 className="vt-details__heading">Details</h2>
            <div className="vt-details__grid">
              {/* Transaction ID */}
              <div className="vt-meta-item">
                <div className="vt-meta-item__icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2 2 7l10 5 10-5-10-5Z" />
                    <path d="m2 17 10 5 10-5" />
                    <path d="m2 12 10 5 10-5" />
                  </svg>
                </div>
                <div className="vt-meta-item__content">
                  <span className="vt-meta-item__label">Transaction ID</span>
                  <span className="vt-meta-item__value vt-meta-item__value--mono">{transaction._id}</span>
                </div>
              </div>

              {/* Created */}
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
                  <time className="vt-meta-item__value" dateTime={transaction.createdAt}>
                    {formatDateShort(transaction.createdAt)}
                  </time>
                  <span className="vt-meta-item__sub">{formatTime(transaction.createdAt)}</span>
                </div>
              </div>

              {/* Last Updated */}
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
                  <time className="vt-meta-item__value" dateTime={transaction.updatedAt}>
                    {formatDateShort(transaction.updatedAt)}
                  </time>
                  <span className="vt-meta-item__sub">{formatTime(transaction.updatedAt)}</span>
                </div>
              </div>

              {/* Created By */}
              {transaction.createdBy && (
                <div className="vt-meta-item">
                  <div className="vt-meta-item__icon" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div className="vt-meta-item__content">
                    <span className="vt-meta-item__label">Created By</span>
                    {user && String(transaction.createdBy._id) === user.id ? (
                      <>
                        <span className="vt-meta-item__value">{transaction.createdBy.fullname || user.fullname}</span>
                        <span className="vt-meta-item__sub">ID: {formatShortId(transaction.createdBy._id)}</span>
                      </>
                    ) : (
                      <span className="vt-meta-item__value">{transaction.createdBy.fullname || formatShortId(transaction.createdBy._id)}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Company ID */}
              {transaction.companyId && (
                <div className="vt-meta-item">
                  <div className="vt-meta-item__icon" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
                      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
                      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
                      <path d="M10 6h4" />
                      <path d="M10 10h4" />
                      <path d="M10 14h4" />
                      <path d="M10 18h4" />
                    </svg>
                  </div>
                  <div className="vt-meta-item__content">
                    <span className="vt-meta-item__label">Company ID</span>
                    <span className="vt-meta-item__value vt-meta-item__value--mono">{String(transaction.companyId)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteDialogOpen}
        onClose={handleCancelDelete}
        title="Delete Transaction"
        size="sm"
      >
        <div className="delete-dialog">
          <p className="delete-dialog__message">
            Are you sure you want to permanently delete this transaction?
          </p>
          <p className="delete-dialog__warning">This action cannot be undone.</p>
          <div className="delete-dialog__transaction-info">
            <span className="delete-dialog__label">Transaction</span>
            <span className="delete-dialog__title">{transaction.title}</span>
          <span className={`delete-dialog__amount ${typeClass}`}>
            {isIncome ? '+' : '−'}₹{(Number(transaction.amount) || 0).toFixed(2)}
          </span>
          </div>
          <div className="modal__actions">
            <Button variant="secondary" onClick={handleCancelDelete} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete} loading={deleting} disabled={deleting}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
