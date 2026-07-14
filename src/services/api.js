import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response
      const message =
        data?.message ||
        data?.error ||
        (status === 403 && 'You do not have permission to perform this action.') ||
        (status === 409 && 'Resource already exists.') ||
        (status === 400 && 'Invalid request. Please check your input.') ||
        (status === 404 && 'The requested resource was not found.') ||
        (status >= 500 && 'A server error occurred. Please try again later.') ||
        'An unexpected error occurred.'
      return Promise.reject(new Error(message))
    }
    if (error.request) {
      return Promise.reject(
        new Error('Unable to connect to the server. Please check your connection.')
      )
    }
    return Promise.reject(error)
  }
)

export default api
