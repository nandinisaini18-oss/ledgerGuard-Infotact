import api from './api'

export function registerCompany(data) {
  return api.post('/auth/company/register', data)
}
