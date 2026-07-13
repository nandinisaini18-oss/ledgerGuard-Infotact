import api from './api'

export function createTransaction(data) {
  return api.post('/api/transactions', data)
}

export function getTransactions() {
  return api.get('/api/transactions')
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