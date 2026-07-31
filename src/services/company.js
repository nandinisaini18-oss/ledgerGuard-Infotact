import api from './api'

export function registerCompany(data) {
  return api.post('/api/auth/company/register', data)
}

export function getCompanies() {
  return api.get('/api/companies')
}

export function getCompanyById(id) {
  return api.get(`/api/companies/${id}`)
}

export function updateCompany(id, data) {
  return api.put(`/api/companies/${id}`, data)
}

export function toggleCompanyStatus(id) {
  return api.patch(`/api/companies/${id}/status`)
}
