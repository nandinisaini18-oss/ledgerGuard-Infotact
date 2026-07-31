import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import FormContainer from '../components/form/FormContainer'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import { getUserById, updateUser } from '../services/user'
import { validateFullName, validateEmail, validateForm } from '../utils/validators'

function EditUserSkeleton() {
  return (
    <FormContainer title="Edit user" subtitle="Loading user\u2026">
      <div className="form-container__fields">
        {[
          { width: '60px', height: '12px' },
          { width: '100%', height: '40px' },
          { width: '40px', height: '12px' },
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

export default function EditUser() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullname: '', email: '' })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryKey, setRetryKey] = useState(0)

  const handleRetry = useCallback(() => {
    setLoading(true)
    setError('')
    setRetryKey((k) => k + 1)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function fetchUser() {
      try {
        const response = await getUserById(id)
        if (cancelled) return
        if (response.data?.success && response.data?.user) {
          const u = response.data.user
          setForm({ fullname: u.fullname || '', email: u.email || '' })
        } else {
          setError('User not found')
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load user')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchUser()
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
      fullname: () => validateFullName(form.fullname),
      email: () => validateEmail(form.email),
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitError('')

    const { errors: validationErrors, isValid } = validate()
    setErrors(validationErrors)
    if (!isValid) return

    setSubmitLoading(true)
    try {
      await updateUser(id, {
        fullname: form.fullname.trim(),
        email: form.email.trim(),
      })
      navigate('/users', { state: { fromEdit: true } })
    } catch (err) {
      if (err.fieldErrors && Object.keys(err.fieldErrors).length > 0) {
        setErrors((prev) => ({ ...prev, ...err.fieldErrors }))
      } else {
        setSubmitError(err.message)
      }
    } finally {
      setSubmitLoading(false)
    }
  }

  if (loading) {
    return <EditUserSkeleton />
  }

  if (error) {
    return (
      <FormContainer title="Edit user" subtitle="Unable to load user">
        <Alert variant="error" message={error} />
        <div className="form-container__actions">
          <Link to="/users">
            <Button variant="secondary" fullWidth>
              Back to Users
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
    <FormContainer title="Edit user" subtitle="Update the details of this user.">
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
        </div>

        <div className="form-container__actions">
          <Button type="submit" variant="primary" fullWidth loading={submitLoading} disabled={submitLoading}>
            Save Changes
          </Button>
          <Link to="/users">
            <Button variant="ghost" fullWidth style={{ marginTop: 'var(--space-3)' }}>
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </FormContainer>
  )
}
