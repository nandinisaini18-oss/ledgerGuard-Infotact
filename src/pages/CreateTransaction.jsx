import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import FormContainer from '../components/form/FormContainer'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import { createTransaction } from '../services/transaction'
import { validateRequired } from '../utils/validators'

const typeOptions = [
  { value: '', label: 'Select type…' },
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
]

const initialForm = {
  title: '',
  amount: '',
  type: '',
  category: '',
  description: '',
}

export default function CreateTransaction() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showResetMessage, setShowResetMessage] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
    if (submitError) setSubmitError('')
  }

  function validate() {
    const titleError = validateRequired(form.title, 'Title')
    let amountError = validateRequired(form.amount, 'Amount')
    if (!amountError && form.amount) {
      const amountNum = parseFloat(form.amount)
      if (isNaN(amountNum) || amountNum <= 0) {
        amountError = 'Amount must be greater than 0'
      }
    }
    const typeError = validateRequired(form.type, 'Type')
    const categoryError = validateRequired(form.category, 'Category')
    let descriptionError = ''
    if (form.description && form.description.length > 500) {
      descriptionError = 'Description cannot exceed 500 characters'
    }

    const validationErrors = {}
    let isValid = true

    if (titleError) {
      validationErrors.title = titleError
      isValid = false
    }
    if (amountError) {
      validationErrors.amount = amountError
      isValid = false
    }
    if (typeError) {
      validationErrors.type = typeError
      isValid = false
    }
    if (categoryError) {
      validationErrors.category = categoryError
      isValid = false
    }
    if (descriptionError) {
      validationErrors.description = descriptionError
      isValid = false
    }

    return { errors: validationErrors, isValid }
  }

  // Set timeout for success message reset
  useEffect(() => {
    if (success) {
      setShowResetMessage(true)
      const timeout = setTimeout(() => {
        setShowResetMessage(false)
      }, 3000)

      return () => clearTimeout(timeout)
    }
  }, [success])

  function handleReset() {
    setForm(initialForm)
    setErrors({})
    setSubmitError('')
    setShowResetMessage(false)
    setSuccess(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitError('')

    const { errors: validationErrors, isValid } = validate()
    setErrors(validationErrors)
    if (!isValid) return

    setLoading(true)
    try {
      const payload = {
        title: form.title.trim(),
        amount: parseFloat(form.amount),
        type: form.type,
        category: form.category.trim(),
        description: form.description.trim(),
      }
      await createTransaction(payload)
      setSuccess(true)
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <FormContainer
        title="Transaction created"
        subtitle="The transaction has been created successfully."
        footer={
          <p className="form-container__footer-text">
            <Link to="/transactions" className="form-container__footer-link">
              Return to transactions
            </Link>
          </p>
        }
      >
        <Alert
          variant="success"
          title="Transaction created"
          message="The transaction has been added and will appear in your list."
        />
        <div className="form-container__actions">
          <Link to="/transactions/new">
            <Button variant="primary" fullWidth style={{ marginBottom: 'var(--space-4)' }} onClick={handleReset}>
              {showResetMessage ? 'Creating another transaction...' : 'Create Another Transaction'}
            </Button>
          </Link>
          <Link to="/transactions">
            <Button variant="secondary" fullWidth onClick={handleReset}>
              Back to Transactions
            </Button>
          </Link>
        </div>
      </FormContainer>
    )
  }

  return (
    <FormContainer
      title="Create transaction"
      subtitle="Add a new income or expense transaction for your company."
    >
      <form onSubmit={handleSubmit} noValidate>
        {submitError && (
          <div className="form-container__fields" style={{ marginBottom: 'var(--space-5)' }}>
            <Alert variant="error" message={submitError} />
          </div>
        )}

        <div className="form-container__fields">
          <Input
            label="Title"
            id="title"
            name="title"
            type="text"
            placeholder="e.g. Office rent, Client payment"
            value={form.title}
            onChange={handleChange}
            error={errors.title}
            autoComplete="off"
          />

          <Input
            label="Amount"
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={form.amount}
            onChange={handleChange}
            error={errors.amount}
            autoComplete="off"
          />

          <div className="form-field">
            <label htmlFor="type" className="form-field__label">
              Type
            </label>
            <div className="form-field__input-wrapper">
              <select
                id="type"
                name="type"
                className={`form-field__input ${errors.type ? 'form-field--error' : ''}`}
                value={form.type}
                onChange={handleChange}
              >
                {typeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.value === ''}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            {errors.type && (
              <span className="form-field__error" role="alert">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {errors.type}
              </span>
            )}
          </div>

          <Input
            label="Category"
            id="category"
            name="category"
            type="text"
            placeholder="e.g. Rent, Utilities, Sales"
            value={form.category}
            onChange={handleChange}
            error={errors.category}
            autoComplete="off"
          />

          <div className="form-field">
            <label htmlFor="description" className="form-field__label">
              Description (optional)
            </label>
            <div className="form-field__input-wrapper">
              <textarea
                id="description"
                name="description"
                className={`form-field__input ${errors.description ? 'form-field--error' : ''}`}
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Add any additional details…"
                maxLength={500}
              />
            </div>
            {errors.description && (
              <span className="form-field__error" role="alert">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {errors.description}
              </span>
            )}
          </div>
        </div>

        <div className="form-container__actions">
          <Button type="submit" variant="primary" fullWidth loading={loading} disabled={loading}>
            Create Transaction
          </Button>
          <Link to="/transactions">
            <Button variant="ghost" fullWidth style={{ marginTop: 'var(--space-3)' }}>
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </FormContainer>
  )
}