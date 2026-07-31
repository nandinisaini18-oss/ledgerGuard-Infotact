import { useState } from 'react'
import { Link } from 'react-router-dom'
import FormContainer from '../components/form/FormContainer'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import { createUser } from '../services/user'
import {
  validateFullName,
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateForm,
} from '../utils/validators'

const roleOptions = [
  { value: '', label: 'Select a role\u2026' },
  { value: 'admin', label: 'Admin' },
  { value: 'user', label: 'User' },
]

const initialForm = {
  fullname: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: '',
}

export default function AddUser() {
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
      fullname: () => validateFullName(form.fullname),
      email: () => validateEmail(form.email),
      password: () => validatePassword(form.password),
      confirmPassword: () => validatePasswordMatch(form.password, form.confirmPassword),
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
      const payload = {
        fullname: form.fullname.trim(),
        email: form.email.trim(),
        password: form.password,
      }
      if (form.role) payload.role = form.role
      await createUser(payload)
      setSuccess(true)
      setForm(initialForm)
    } catch (err) {
      if (err.fieldErrors && Object.keys(err.fieldErrors).length > 0) {
        setErrors((prev) => ({ ...prev, ...err.fieldErrors }))
      } else {
        setSubmitError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    const handleAddAnother = () => {
      setSuccess(false)
      setForm(initialForm)
      setErrors({})
      setSubmitError('')
    }

    return (
      <FormContainer
        title="User created"
        subtitle="The user account has been created successfully."
        footer={
          <p className="form-container__footer-text">
            <Link to="/users" className="form-container__footer-link">
              Back to Users
            </Link>
          </p>
        }
      >
        <Alert
          variant="success"
          title="Account created"
          message="The user has been added and can now access the platform."
        />
        <div className="form-container__actions">
          <Button variant="primary" fullWidth onClick={handleAddAnother}>
            Add Another User
          </Button>
          <Link to="/users">
            <Button variant="secondary" fullWidth>
              Back to Users
            </Button>
          </Link>
        </div>
      </FormContainer>
    )
  }

  return (
    <FormContainer
      title="Add user"
      subtitle="Create a new user for your company."
    >
      <form onSubmit={handleSubmit} noValidate>
        {submitError && (
          <div className="form-container__fields" style={{ marginBottom: 'var(--space-5)' }}>
            <Alert variant="error" message={submitError} />
          </div>
        )}

        <div className="form-container__fields">
          <Input
            label="Full Name"
            id="fullname"
            name="fullname"
            type="text"
            placeholder="John Doe"
            value={form.fullname}
            onChange={handleChange}
            error={errors.fullname}
            autoComplete="name"
          />

          <Input
            label="Email"
            id="email"
            name="email"
            type="email"
            placeholder="john@acme.com"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            autoComplete="email"
          />

          <Input
            label="Password"
            id="password"
            name="password"
            type="password"
            placeholder="Min. 6 characters"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="new-password"
          />

          <Input
            label="Confirm Password"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Re-enter your password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            autoComplete="new-password"
          />

          <div className="form-field">
            <label htmlFor="role" className="form-field__label">
              Role
            </label>
            <div className="form-field__input-wrapper">
              <select
                id="role"
                name="role"
                className={`form-field__input ${errors.role ? 'form-field--error' : ''}`}
                value={form.role}
                onChange={handleChange}
              >
                {roleOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.value === ''}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            {errors.role && (
              <span className="form-field__error" role="alert">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {errors.role}
              </span>
            )}
          </div>
        </div>

        <div className="form-container__actions">
          <Button type="submit" variant="primary" fullWidth loading={loading} disabled={loading}>
            Create User
          </Button>
        </div>
      </form>
    </FormContainer>
  )
}
