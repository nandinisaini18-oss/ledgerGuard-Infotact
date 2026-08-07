import { useEffect, useState, useCallback } from 'react'
import { getCompanyProfile, updateCompanyProfile } from '../services/company'
import Card from '../components/ui/Card'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import Input from '../components/ui/Input'
import { validateRequired, validateEmail } from '../utils/validators'
import { getInitials } from '../utils/display'
import useIsAdmin from '../hooks/useIsAdmin'

function CompanyProfileSkeleton() {
  return (
    <div className="company-profile" role="status" aria-label="Loading company profile">
      <div className="company-profile__header">
        <div>
          <div className="shimmer" style={{ width: '160px', height: '28px', marginBottom: '8px' }} />
          <div className="shimmer" style={{ width: '240px', height: '16px' }} />
        </div>
      </div>

      <Card className="company-profile__card">
        <div className="company-profile__card-body">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="company-profile__info-row">
              <div className="shimmer" style={{ width: '120px', height: '14px' }} />
              <div className="shimmer" style={{ width: '180px', height: '14px' }} />
            </div>
          ))}
        </div>
      </Card>
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

export default function CompanyProfile() {
  const isAdmin = useIsAdmin();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryKey, setRetryKey] = useState(0);

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ companyName: '', companyEmail: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleRetry = useCallback(() => {
    setLoading(true)
    setError('')
    setRetryKey((k) => k + 1)
  }, [])

  function handleStartEdit() {
    setForm({
      companyName: company?.companyName || '',
      companyEmail: company?.companyEmail || '',
    })
    setFieldErrors({});
    setSubmitError('');
    setSuccess('');
    setIsEditing(true);
  }

  function handleCancelEdit() {
    setFieldErrors({})
    setSubmitError('')
    setIsEditing(false)
  }

  function handleFormChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }))
    }
    if (submitError) setSubmitError('')
  }

  function validateEditForm(current) {
    const errors = {}
    let nameError = validateRequired(current.companyName, 'Company name')
    if (!nameError && current.companyName.trim().length < 3) {
      nameError = 'Company name must be at least 3 characters'
    }
    const emailError = validateEmail(current.companyEmail)
    if (nameError) errors.companyName = nameError
    if (emailError) errors.companyEmail = emailError
    return errors
  }

  async function handleEditSubmit(e) {
    e.preventDefault()
    setSubmitError('')
    setSuccess('')

    const errors = validateEditForm(form)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setSubmitLoading(true)
    try {
      const response = await updateCompanyProfile({
        companyName: form.companyName.trim(),
        companyEmail: form.companyEmail.trim(),
      })
      if (response.data?.success && response.data?.company) {
        setCompany(response.data.company)
        setSuccess('Company profile updated successfully')
        setIsEditing(false)
      } else {
        setSubmitError('Company profile could not be updated')
      }
    } catch (err) {
      if (err.fieldErrors && Object.keys(err.fieldErrors).length > 0) {
        setFieldErrors((prev) => ({ ...prev, ...err.fieldErrors }))
      } else {
        setSubmitError(err.message || 'An unexpected error occurred')
      }
    } finally {
      setSubmitLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false

    async function fetchCompanyProfile() {
      try {
        const response = await getCompanyProfile()
        if (cancelled) return
        if (response.data?.success && response.data?.company) {
          setCompany(response.data.company)
        } else {
          setError('Company profile could not be loaded')
        }
      } catch (err) {
        if (cancelled) return
        setError(err.message || 'An unexpected error occurred')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchCompanyProfile()
    return () => { cancelled = true }
  }, [retryKey])

  if (loading) {
    return <CompanyProfileSkeleton />
  }

  return (
    <div className="company-profile">
      <div className="company-profile__header">
        <div>
          <h1 className="company-profile__title">My Company</h1>
          <p className="company-profile__subtitle">
            View the profile and subscription details for your company
          </p>
        </div>
        {company && !isEditing && isAdmin && (
          <Button variant="secondary" size="sm" onClick={handleStartEdit}>
            Edit
          </Button>
        )}
      </div>

      {company && (
        <div className="company-profile__cover">
          <span
            className={`company-profile__cover-mark ${company.status === 'active' ? 'company-profile__cover-mark--active' : ''}`}
            aria-hidden="true"
          >
            {getInitials(company.companyName)}
          </span>
        </div>
      )}

      {success && (
        <div className="company-profile__notice" role="status">
          <Alert
            variant="success"
            title="Company profile updated"
            message={success}
            onClose={() => setSuccess('')}
          />
        </div>
      )}

      {error && (
        <div className="company-profile__error" role="alert">
          <Alert variant="error" message={error} />
          <div style={{ marginTop: 'var(--space-3)' }}>
            <Button variant="secondary" size="sm" onClick={handleRetry}>
              Retry
            </Button>
          </div>
        </div>
      )}

      {!error && !company ? (
        <Card className="company-profile__empty">
          <EmptyState
            icon={
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 21h18" />
                <path d="M5 21V7l7-4 7 4v14" />
                <path d="M9 21v-4h6v4" />
              </svg>
            }
            title="No company profile"
            description="Company information is not available right now."
          />
        </Card>
      ) : isEditing ? (
        <Card className="company-profile__card">
          <div className="company-profile__card-header">
            <h2 className="company-profile__card-title">Edit Company Details</h2>
          </div>
          <div className="company-profile__card-body company-profile__edit-body">
            <form onSubmit={handleEditSubmit} noValidate>
              {submitError && (
                <div className="form-container__fields" style={{ marginBottom: 'var(--space-5)' }}>
                  <Alert variant="error" message={submitError} />
                </div>
              )}
              <div className="form-container__fields">
                <Input
                  label="Company Name"
                  id="companyName"
                  name="companyName"
                  type="text"
                  placeholder="e.g. Acme Inc."
                  value={form.companyName}
                  onChange={handleFormChange}
                  error={fieldErrors.companyName}
                  autoComplete="off"
                />
                <Input
                  label="Company Email"
                  id="companyEmail"
                  name="companyEmail"
                  type="email"
                  placeholder="e.g. hello@acme.com"
                  value={form.companyEmail}
                  onChange={handleFormChange}
                  error={fieldErrors.companyEmail}
                  autoComplete="off"
                />
              </div>
              <div className="company-profile__edit-actions">
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={submitLoading}
                  disabled={submitLoading}
                >
                  Save Changes
                </Button>
                <Button type="button" variant="ghost" fullWidth onClick={handleCancelEdit}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </Card>
      ) : (
        company && (
          <Card className="company-profile__card">
            <div className="company-profile__card-header">
              <h2 className="company-profile__card-title">Company Details</h2>
            </div>
            <div className="company-profile__card-body">
              <div className="company-profile__info-row">
                <span className="company-profile__info-label">Company Name</span>
                <span className="company-profile__info-value">{company.companyName || '\u2014'}</span>
              </div>
              <div className="company-profile__info-row">
                <span className="company-profile__info-label">Company Email</span>
                <span className="company-profile__info-value">{company.companyEmail || '\u2014'}</span>
              </div>
              <div className="company-profile__info-row">
                <span className="company-profile__info-label">Subscription</span>
                <span className="company-profile__info-value">
                  <span className="company-profile__badge">{company.subscription || '\u2014'}</span>
                </span>
              </div>
              <div className="company-profile__info-row">
                <span className="company-profile__info-label">Status</span>
                <span className="company-profile__info-value">
                  <span className="company-profile__badge">{company.status || '\u2014'}</span>
                </span>
              </div>
              <div className="company-profile__info-row">
                <span className="company-profile__info-label">Created Date</span>
                <span className="company-profile__info-value">{formatDate(company.createdAt)}</span>
              </div>
              <div className="company-profile__info-row">
                <span className="company-profile__info-label">Updated Date</span>
                <span className="company-profile__info-value">{formatDate(company.updatedAt)}</span>
              </div>
            </div>
          </Card>
        )
      )}
    </div>
  )
}
