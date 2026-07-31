import api from './api'

export function registerCompany(data) {
  return api.post('/api/auth/company/register', data)
}

export function getCompanyProfile() {
  return api.get('/api/company/profile')
}

export function updateCompanyProfile(data) {
  return api.put('/api/company/profile', data)
}
