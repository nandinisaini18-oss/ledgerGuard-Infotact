import api from './api'

export function registerCompany(data) {
  return api.post('/api/auth/company/register', data)
}
