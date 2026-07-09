import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import FormContainer from '../components/form/FormContainer'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import { loginUser } from '../services/user'
import { validateRequired, validateEmail, validateForm } from '../utils/validators'

const initialForm = {
  email: '',
  password: '',
}

function Login() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [loading, setLoading] = useState(false)
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
      password: () => validateRequired(form.password, 'Password'),
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
      await loginUser(form)
      navigate('/dashboard')
    } catch (err) {
      setSubmitError(err.message)
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
          <a href="/register-company" className="form-container__footer-link">Register Company</a>
          {' '}or{' '}
          <a href="/register-user" className="form-container__footer-link">Register User</a>
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
