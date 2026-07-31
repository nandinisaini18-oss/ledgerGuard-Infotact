import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { getCompanyById, toggleCompanyStatus } from '../services/company'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import Modal from '../components/ui/Modal'

function CompanyDetailsSkeleton() {
  return (
    <div className="view-transaction company-details" role="status" aria-label="Loading company">
      <header className="vt-header">
        <div className="vt-header__left">
          <div className="shimmer" style={{ width: '120px', height: '18px' }} />
          <div className="shimmer" style={{ width: '16px', height: '16px', borderRadius: 'var(--radius-sm)' }} />
          <div className="shimmer" style={{ width: '140px', height: '18px' }} />
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

function formatDateShort(dateString) {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatTime(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

export default function CompanyDetails() {
  const { id } = useParams()
  const location = useLocation()
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [flash, setFlash] = useState(location.state?.fromEdit ? 'Company updated successfully' : '')
  const [retryKey, setRetryKey] = useState(0)
  const [toggleDialogOpen, setToggleDialogOpen] = useState(false)
  const [toggling, setToggling] = useState(false)
  const [toggleError, setToggleError] = useState('')

  useEffect(() => {
    if (!flash) return
    const timer = setTimeout(() => setFlash(''), 5000)
    return () => clearTimeout(timer)
  }, [flash])

  const handleRetry = useCallback(() => {
    setLoading(true)
    setError('')
    setRetryKey((k) => k + 1)
  }, [])

  function handleToggleClick() {
    setToggleError('')
    setToggleDialogOpen(true)
  }

  function handleCancelToggle() {
    if (toggling) return
    setToggleDialogOpen(false)
    setToggleError('')
  }

  async function handleConfirmToggle() {
    if (!company || toggling) return

    setToggling(true)
    setToggleError('')
    try {
      const response = await toggleCompanyStatus(company.companyId)
      if (response.data?.success && response.data?.company) {
        setCompany(response.data.company)
        setFlash(response.data.message || 'Company status updated successfully')
        setToggleDialogOpen(false)
      } else {
        setToggleError('Failed to update company status')
      }
    } catch (err) {
      setToggleError(err.message || 'Failed to update company status')
    } finally {
      setToggling(false)
    }
  }

  useEffect(() => {
    let cancelled = false

    async function fetchCompany() {
      try {
        const response = await getCompanyById(id)
        if (cancelled) return

        if (response.data?.success && response.data?.company) {
          setCompany(response.data.company)
        } else {
          setError('Company not found')
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load company')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchCompany()
    return () => { cancelled = true }
  }, [id, retryKey])

  if (loading) {
    return <CompanyDetailsSkeleton />
  }

  if (error) {
    return (
      <div className="view-transaction__error" role="alert">
        <div className="view-transaction__error-card">
          <div className="view-transaction__error-content">
            <Alert variant="error" message={error} />
            <div className="view-transaction__actions">
              <Link to="/companies">
                <Button variant="secondary">Back to Companies</Button>
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

  if (!company) {
    return (
      <div className="view-transaction__error" role="alert">
        <div className="view-transaction__error-card">
          <div className="view-transaction__error-content">
            <Alert variant="error" message="Company not found" />
            <div className="view-transaction__actions">
              <Link to="/companies">
                <Button variant="secondary">Back to Companies</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const isActive = company.status === 'active'

  return (
    <div className="view-transaction company-details">
      <header className="vt-header">
        <div className="vt-header__left">
          <Link to="/companies" className="vt-header__back" aria-label="Back to companies">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Companies</span>
          </Link>
          <svg className="vt-header__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span className="vt-header__current">{company.companyName}</span>
        </div>
        <div className="vt-header__actions">
          <Link to={`/companies/${company.companyId}/edit`}>
            <Button variant="secondary" size="sm">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
              Edit
            </Button>
          </Link>
          <Button
            variant={isActive ? 'danger' : 'secondary'}
            size="sm"
            onClick={handleToggleClick}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {isActive ? (
                <>
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <line x1="9" y1="12" x2="15" y2="12" />
                </>
              ) : (
                <>
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <line x1="12" y1="9" x2="12" y2="15" />
                  <line x1="9" y1="12" x2="15" y2="12" />
                </>
              )}
            </svg>
            {isActive ? 'Disable' : 'Enable'}
          </Button>
        </div>
      </header>

      {flash && (
        <div className="view-transaction__flash" role="status">
          <Alert variant="success" message={flash} />
        </div>
      )}

      <div className="vt-grid">
        <div className="vt-grid__main">
          <div className={`vt-hero vt-hero--${isActive ? 'income' : 'expense'}`}>
            <div className="vt-hero__accent" aria-hidden="true" />
            <div className="vt-hero__body">
              <div className="vt-hero__badges">
                <span className={`vt-badge vt-badge--${isActive ? 'income' : 'expense'}`}>
                  {isActive ? 'Active' : 'Inactive'}
                </span>
                <span className="vt-badge vt-badge--category">
                  {company.subscription}
                </span>
              </div>

              <div className="vt-hero__amount-row">
                <span className="company-details__name">{company.companyName}</span>
              </div>

              <div className="vt-hero__description">
                <p className="vt-hero__description-text">{company.email}</p>
              </div>
            </div>
          </div>

          <div className="vt-details">
            <h2 className="vt-details__heading">Details</h2>
            <div className="vt-details__grid">
              <div className="vt-meta-item">
                <div className="vt-meta-item__icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2 2 7l10 5 10-5-10-5Z" />
                    <path d="m2 17 10 5 10-5" />
                    <path d="m2 12 10 5 10-5" />
                  </svg>
                </div>
                <div className="vt-meta-item__content">
                  <span className="vt-meta-item__label">Company ID</span>
                  <span className="vt-meta-item__value vt-meta-item__value--mono">{company.companyId}</span>
                </div>
              </div>

              <div className="vt-meta-item">
                <div className="vt-meta-item__icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div className="vt-meta-item__content">
                  <span className="vt-meta-item__label">Email</span>
                  <span className="vt-meta-item__value">{company.email}</span>
                </div>
              </div>

              <div className="vt-meta-item">
                <div className="vt-meta-item__icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 7h-9" />
                    <path d="M14 17H5" />
                    <circle cx="17" cy="17" r="3" />
                    <circle cx="7" cy="7" r="3" />
                  </svg>
                </div>
                <div className="vt-meta-item__content">
                  <span className="vt-meta-item__label">Subscription</span>
                  <span className="vt-meta-item__value">{company.subscription}</span>
                </div>
              </div>

              <div className="vt-meta-item">
                <div className="vt-meta-item__icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                  </svg>
                </div>
                <div className="vt-meta-item__content">
                  <span className="vt-meta-item__label">Status</span>
                  <span className="vt-meta-item__value">{company.status}</span>
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
                  <time className="vt-meta-item__value" dateTime={company.createdAt}>
                    {formatDateShort(company.createdAt)}
                  </time>
                  <span className="vt-meta-item__sub">{formatTime(company.createdAt)}</span>
                </div>
              </div>

              {company.updatedAt && (
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
                    <time className="vt-meta-item__value" dateTime={company.updatedAt}>
                      {formatDateShort(company.updatedAt)}
                    </time>
                    <span className="vt-meta-item__sub">{formatTime(company.updatedAt)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enable/Disable Confirmation Modal */}
      <Modal
        isOpen={toggleDialogOpen}
        onClose={handleCancelToggle}
        title={isActive ? 'Disable Company' : 'Enable Company'}
        size="sm"
      >
        <div className="delete-dialog">
          <p className="delete-dialog__message">
            {isActive
              ? `Are you sure you want to disable "${company.companyName}"?`
              : `Are you sure you want to enable "${company.companyName}"?`}
          </p>
          <div className="delete-dialog__transaction-info">
            <span className="delete-dialog__label">Company</span>
            <span className="delete-dialog__title">{company.companyName}</span>
            <span className="delete-dialog__label">Status</span>
            <span className="delete-dialog__title">{isActive ? 'Active' : 'Inactive'}</span>
          </div>
          {toggleError && <Alert variant="error" message={toggleError} />}
          <div className="modal__actions">
            <Button variant="secondary" onClick={handleCancelToggle} disabled={toggling}>
              Cancel
            </Button>
            <Button
              variant={isActive ? 'danger' : 'primary'}
              onClick={handleConfirmToggle}
              loading={toggling}
              disabled={toggling}
            >
              {isActive ? 'Disable' : 'Enable'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
