import { useState } from 'react'
import { Link } from 'react-router-dom'
import FormContainer from './FormContainer'
import Input from '../ui/Input'
import Button from '../ui/Button'
import Alert from '../ui/Alert'
import { validateRequired } from '../../utils/validators'

const typeOptions = [
  { value: '', label: 'Select type\u2026' },
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
]

function validate(form) {
  let titleError = validateRequired(form.title, 'Title')
  if (!titleError && form.title.trim().length < 3) {
    titleError = 'Title must be between 3 and 100 characters'
  }
  if (!titleError && form.title.trim().length > 100) {
    titleError = 'Title must be between 3 and 100 characters'
  }

  let amountError = validateRequired(form.amount, 'Amount')
  if (!amountError && form.amount) {
    const amountNum = parseFloat(form.amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      amountError = 'Amount must be greater than 0'
    }
  }

  const typeError = validateRequired(form.type, 'Type')

  let categoryError = validateRequired(form.category, 'Category')
  if (!categoryError && form.category.trim().length < 2) {
    categoryError = 'Category must be between 2 and 50 characters'
  }
  if (!categoryError && form.category.trim().length > 50) {
    categoryError = 'Category must be between 2 and 50 characters'
  }

  let descriptionError = ''
  if (form.description && form.description.length > 500) {
    descriptionError = 'Description cannot exceed 500 characters'
  }

  const errors = {}
  let isValid = true

  if (titleError) { errors.title = titleError; isValid = false }
  if (amountError) { errors.amount = amountError; isValid = false }
  if (typeError) { errors.type = typeError; isValid = false }
  if (categoryError) { errors.category = categoryError; isValid = false }
  if (descriptionError) { errors.description = descriptionError; isValid = false }

  return { errors, isValid }
}

export default function TransactionForm({
  initialData,
  onSubmit,
  title,
  subtitle,
  submitLabel = 'Save Changes',
  onCancel = '/transactions',
}) {
  const [form, setForm] = useState(initialData)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
    if (submitError) setSubmitError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitError('')

    const { errors: validationErrors, isValid } = validate(form)
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
      await onSubmit(payload)
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
    <FormContainer title={title} subtitle={subtitle}>
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
                placeholder="Add any additional details"
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
            {submitLabel}
          </Button>
          <Link to={onCancel}>
            <Button variant="ghost" fullWidth style={{ marginTop: 'var(--space-3)' }}>
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </FormContainer>
  )
}
