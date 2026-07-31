import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import FormContainer from '../components/form/FormContainer'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import { getCompanyById, updateCompany } from '../services/company'
import { validateRequired, validateEmail, validateForm } from '../utils/validators'

function validateCompanyName(value) {
  const required = validateRequired(value, 'Company name')
  if (required) return required
  if (value.trim().length < 3) return 'Company name must be at least 3 characters'
  return ''
}

const subscriptionOptions = [
  { value: 'basic', label: 'Basic' },
  { value: 'pro', label: 'Pro' },
  { value: 'enterprise', label: 'Enterprise' },
]

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

function EditCompanySkeleton() {
  return (
    <FormContainer title="Edit company" subtitle="Loading company\u2026">
      <div className="form-container__fields">
        {[
          { width: '110px', height: '12px' },
          { width: '100%', height: '40px' },
          { width: '100px', height: '12px' },
          { width: '100%', height: '40px' },
          { width: '130px', height: '12px' },
          { width: '100%', height: '40px' },
          { width: '60px', height: '12px' },
          { width: '100%', height: '40px' },
        ].map((item, i) => (
          <div key={i} className="form-field">
            <div className="shimmer" style={{ width: item.width, height: item.height === '12px' ? item.height : 0, marginBottom: item.height === '12px' ? '6px' : 0 }} />
            {item.height !== '12px' && (
              <div className="shimmer" style={{ width: '100%', height: item.height }} />
            )}
          </div>
        ))}
      </div>
      <div className="form-container__actions">
        <div className="shimmer" style={{ width: '100%', height: '42px', borderRadius: 'var(--radius-md)' }} />
        <div className="shimmer" style={{ width: '100%', height: '42px', borderRadius: 'var(--radius-md)' }} />
      </div>
    </FormContainer>
  )
}

export default function EditCompany() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [saving, setSaving] = useState(false)
  const [retryKey, setRetryKey] = useState(0)

  const handleRetry = useCallback(() => {
    setLoading(true)
    setLoadError('')
    setRetryKey((k) => k + 1)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function fetchCompany() {
      try {
        const response = await getCompanyById(id)
        if (cancelled) return

        if (response.data?.success && response.data?.company) {
          const c = response.data.company
          setForm({
            companyName: c.companyName || '',
            companyEmail: c.email || '',
            subscriptionPlan: c.subscription || '',
            status: c.status || 'active',
          })
        } else {
          setLoadError('Company not found')
        }
      } catch (err) {
        if (!cancelled) setLoadError(err.message || 'Failed to load company')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchCompany()
    return () => { cancelled = true }
  }, [id, retryKey])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
    if (submitError) setSubmitError('')
  }

  function validate() {
    return validateForm({
      companyName: () => validateCompanyName(form.companyName),
      companyEmail: () => validateEmail(form.companyEmail),
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitError('')

    const { errors: validationErrors, isValid } = validate()
    setErrors(validationErrors)
    if (!isValid) return

    setSaving(true)
    try {
      const payload = {
        companyName: form.companyName.trim(),
        companyEmail: form.companyEmail.trim(),
        subscriptionPlan: form.subscriptionPlan,
        status: form.status,
      }
      await updateCompany(id, payload)
      navigate(`/companies/${id}`, { state: { fromEdit: true } })
    } catch (err) {
      if (err.fieldErrors && Object.keys(err.fieldErrors).length > 0) {
        setErrors((prev) => ({ ...prev, ...err.fieldErrors }))
      } else {
        setSubmitError(err.message)
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <EditCompanySkeleton />
  }

  if (loadError) {
    return (
      <FormContainer title="Edit company" subtitle="Unable to load company">
        <Alert variant="error" message={loadError} />
        <div className="form-container__actions">
          <Link to="/companies">
            <Button variant="secondary" fullWidth>
              Back to Companies
            </Button>
          </Link>
          <Button variant="primary" fullWidth onClick={handleRetry}>
            Retry
          </Button>
        </div>
      </FormContainer>
    )
  }

  return (
    <FormContainer title="Edit company" subtitle="Update the details of this company.">
      <form onSubmit={handleSubmit} noValidate>
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
            placeholder="Acme Inc."
            value={form.companyName}
            onChange={handleChange}
            error={errors.companyName}
            autoComplete="organization"
          />

          <Input
            label="Company Email"
            id="companyEmail"
            name="companyEmail"
            type="email"
            placeholder="hello@acme.com"
            value={form.companyEmail}
            onChange={handleChange}
            error={errors.companyEmail}
            autoComplete="email"
          />

          <div className="form-field">
            <label htmlFor="subscriptionPlan" className="form-field__label">
              Subscription
            </label>
            <div className="form-field__input-wrapper">
              <select
                id="subscriptionPlan"
                name="subscriptionPlan"
                className={`form-field__input ${errors.subscriptionPlan ? 'form-field--error' : ''}`}
                value={form.subscriptionPlan}
                onChange={handleChange}
              >
                {subscriptionOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            {errors.subscriptionPlan && (
              <span className="form-field__error" role="alert">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {errors.subscriptionPlan}
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="status" className="form-field__label">
              Status
            </label>
            <div className="form-field__input-wrapper">
              <select
                id="status"
                name="status"
                className={`form-field__input ${errors.status ? 'form-field--error' : ''}`}
                value={form.status}
                onChange={handleChange}
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            {errors.status && (
              <span className="form-field__error" role="alert">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {errors.status}
              </span>
            )}
          </div>
        </div>

        <div className="form-container__actions">
          <Button type="submit" variant="primary" fullWidth loading={saving} disabled={saving}>
            Save Changes
          </Button>
          <Link to={`/companies/${id}`}>
            <Button variant="ghost" fullWidth style={{ marginTop: 'var(--space-3)' }}>
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </FormContainer>
  )
}
