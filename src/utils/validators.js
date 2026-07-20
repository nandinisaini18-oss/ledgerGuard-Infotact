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

export function validateFullName(fullname) {
  if (!fullname || fullname.trim().length === 0) return 'Full name is required.'
  if (fullname.trim().length < 4) return 'Full name must be at least 4 characters.'
  return ''
}

export function validatePassword(password) {
  if (!password) return 'Password is required.'
  if (password.length < 6) return 'Password must be at least 6 characters.'
  return ''
}

export function validatePasswordMatch(password, confirmPassword) {
  if (!confirmPassword) return 'Please confirm your password.'
  if (password !== confirmPassword) return 'Passwords do not match.'
  return ''
}

export function validateMongoId(value, fieldName = 'ID') {
  if (!value || value.trim().length === 0) return `${fieldName} is required.`
  if (!/^[0-9a-fA-F]{24}$/.test(value.trim())) return `${fieldName} must be a valid ${fieldName}.`
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
