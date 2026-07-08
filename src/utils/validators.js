export function validateRequired(value, fieldName = 'This field') {
  if (!value || (typeof value === 'string' && value.trim().length === 0)) {
    return `${fieldName} is required.`
  }
  return ''
}

export function validateEmail(email) {
  if (!email || email.trim().length === 0) return 'Email is required.'
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!re.test(email.trim())) return 'Please enter a valid email address.'
  return ''
}

export function validatePassword(password) {
  if (!password) return 'Password is required.'
  if (password.length < 8) return 'Password must be at least 8 characters.'
  return ''
}

export function validatePasswordMatch(password, confirmPassword) {
  if (!confirmPassword) return 'Please confirm your password.'
  if (password !== confirmPassword) return 'Passwords do not match.'
  return ''
}

export function validateForm(fields) {
  const errors = {}
  let isValid = true

  for (const [key, validator] of Object.entries(fields)) {
    const error = validator()
    if (error) {
      errors[key] = error
      isValid = false
    }
  }

  return { errors, isValid }
}
