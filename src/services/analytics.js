import api from './api'

export function getTransactionSummary() {
  return api.get('/api/analytics/summary')
}

export function getCategoryAnalytics() {
  return api.get('/api/analytics/category')
}

export const getTrends = (range = "30d") => {
  return api.get(`/api/analytics/trends?range=${range}`);
};
