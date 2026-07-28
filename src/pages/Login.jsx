import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormContainer from '../components/form/FormContainer'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import { loginUser } from '../services/user'
import { validateRequired, validateEmail, validatePassword, validateForm } from '../utils/validators'
import { useAuth } from '../context'

const initialForm = {
  email: '',
  password: '',
  companyName: '',
}

function Login() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setUser } = useAuth()
  const navigate = useNavigate()

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
      email: () => validateEmail(form.email),
      password: () => validatePassword(form.password),
      companyName: () => validateRequired(form.companyName, 'Company name'),
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitError('')

    const { errors: validationErrors, isValid } = validate()
    setErrors(validationErrors)
    if (!isValid) return

    setLoading(true)
    try {
      const response = await loginUser(form)
      if (response.data?.success && response.data?.user) {
        setUser(response.data.user)
        navigate('/dashboard')
      } else {
        setSubmitError('Login failed. Please try again.')
      }
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

  return (
    <FormContainer
      title="Login to your account"
      subtitle="Enter your credentials to access your dashboard."
      footer={
        <p className="form-container__footer-text">
          Need to register a company or user first?{' '}
          <Link to="/register-company" className="form-container__footer-link">Register Company</Link>
          {' '}or{' '}
          <Link to="/register-user" className="form-container__footer-link">Register User</Link>
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
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="current-password"
          />

          <Input
            label="Company Name"
            id="companyName"
            name="companyName"
            type="text"
            placeholder="e.g. Acme Inc."
            value={form.companyName}
            onChange={handleChange}
            error={errors.companyName}
            autoComplete="organization"
          />
        </div>

        <div className="form-container__actions">
          <Button type="submit" variant="primary" fullWidth loading={loading} disabled={loading}>
            Login
          </Button>
        </div>
      </form>
    </FormContainer>
  )
}

export default Login
