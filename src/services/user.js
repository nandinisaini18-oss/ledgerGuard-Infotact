import api from './api'

export function registerUser(data) {
  return api.post('/api/auth/user/register', data)
}

export function loginUser(data) {
  return api.post('/api/auth/user/login', data)
}

export function logoutUser() {
  return api.post('/api/auth/user/logout')
}

export function getMe() {
  return api.get('/api/auth/user/get-me')
}
