import api from './api'

export function createTransaction(data) {
  return api.post('/api/transactions', data)
}

export function getTransactions({ page, limit, type, category } = {}) {
  const params = new URLSearchParams()

  if (page != null) params.append('page', page)
  if (limit != null) params.append('limit', limit)
  if (type) params.append('type', type)
  if (category) params.append('category', category)

  const query = params.toString()
  return api.get(`/api/transactions${query ? `?${query}` : ''}`)
}

export function getTransactionById(id) {
  return api.get(`/api/transactions/${id}`)
}

export function updateTransaction(id, data) {
  return api.put(`/api/transactions/${id}`, data)
}

export function deleteTransaction(id) {
  return api.delete(`/api/transactions/${id}`)
}