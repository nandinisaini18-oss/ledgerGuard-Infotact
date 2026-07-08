import api from './api'

export function registerUser(data) {
  return api.post('/auth/user/register', data)
}
