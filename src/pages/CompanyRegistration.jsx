import { useState } from 'react'
import { Link } from 'react-router-dom'
import FormContainer from '../components/form/FormContainer'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import { registerCompany } from '../services/company'
import { validateRequired, validateEmail, validateForm } from '../utils/validators'

const subscriptionOptions = [
  { value: '', label: 'Select a plan\u2026' },
  { value: 'basic', label: 'Basic' },
  { value: 'pro', label: 'Pro' },
  { value: 'enterprise', label: 'Enterprise' },
]

const initialForm = {
  companyName: '',
  companyEmail: '',
  subscriptionPlan: '',
}

function CompanyRegistration() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

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
      companyName: () => validateRequired(form.companyName, 'Company name'),
      companyEmail: () => validateEmail(form.companyEmail),
      subscriptionPlan: () => validateRequired(form.subscriptionPlan, 'Subscription plan'),
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitError('')
    setSuccess(false)

    const { errors: validationErrors, isValid } = validate()
    setErrors(validationErrors)
    if (!isValid) return

    setLoading(true)
    try {
      await registerCompany(form)
      setSuccess(true)
      setForm(initialForm)
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <FormContainer
        title="Company registered"
        subtitle="Your company has been registered successfully."
        footer={
          <p className="form-container__footer-text">
            Next,{' '}
            <Link to="/register-user" className="form-container__footer-link">
              register a user account
            </Link>{' '}
            for your company.
          </p>
        }
      >
        <Alert
          variant="success"
          title="Registration complete"
          message="Your company has been registered. You can now create user accounts to access the platform."
        />
        <div className="form-container__actions">
          <Link to="/register-user">
            <Button variant="primary" fullWidth>
              Register User
            </Button>
          </Link>
          <Link to="/">
            <Button variant="secondary" fullWidth>
              Back to Home
            </Button>
          </Link>
        </div>
      </FormContainer>
    )
  }

  return (
    <FormContainer
      title="Register your company"
      subtitle="Create your organization to get started with LedgerGuard."
      footer={
        <p className="form-container__footer-text">
          Already have a company?{' '}
          <Link to="/register-user" className="form-container__footer-link">
            Register a user
          </Link>
        </p>
      }
    >
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
              Subscription Plan
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
                  <option key={opt.value} value={opt.value} disabled={opt.value === ''}>
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
        </div>

        <div className="form-container__actions">
          <Button type="submit" variant="primary" fullWidth loading={loading}>
            Register Company
          </Button>
        </div>
      </form>
    </FormContainer>
  )
}

export default CompanyRegistration
