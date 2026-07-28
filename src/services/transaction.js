import api from './api'

export function createTransaction(data) {
  const idempotencyKey = crypto.randomUUID()
  return api.post('/api/transactions', data, {
    headers: { 'Idempotency-Key': idempotencyKey }
  })
}

export function getTransactions({ page, limit, type, category, search, sort } = {}) {
  const params = new URLSearchParams()

  if (page != null) params.append('page', page)
  if (limit != null) params.append('limit', limit)
  if (type) params.append('type', type)
  if (category) params.append('category', category)
  if (search) params.append('search', search)
  if (sort) params.append('sort', sort)

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