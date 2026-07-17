import api from './api'

export function getTransactionSummary() {
  return api.get('/api/analytics/summary')
}

export function getCategoryAnalytics() {
  return api.get('/api/analytics/category')
}
