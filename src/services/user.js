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

export function getUsers({ page, limit, search } = {}) {
  const params = new URLSearchParams()

  if (page != null) params.append('page', page)
  if (limit != null) params.append('limit', limit)
  if (search) params.append('search', search)

  const query = params.toString()
  return api.get(`/api/users${query ? `?${query}` : ''}`)
}

export function getUserById(id) {
  return api.get(`/api/users/${id}`)
}

export function createUser(data) {
  return api.post('/api/users', data)
}

export function updateUser(id, data) {
  return api.put(`/api/users/${id}`, data)
}

export function updateUserRole(id, role) {
  return api.patch(`/api/users/${id}/role`, { role })
}
