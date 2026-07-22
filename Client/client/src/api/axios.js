import axios from 'axios'
import { toast } from 'react-toastify'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
})

// Request interceptor
API.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status  = error.response?.status
    const message = error.response?.data?.message || 'Network error'

    if (status === 401) {
      localStorage.removeItem('user')
      window.location.href = '/login'
      toast.error('Session expired. Please login again.')
    } else if (status === 403) {
      toast.error('You do not have permission to do this')
    } else if (status === 429) {
      toast.error('Too many requests. Please wait and try again.')
    } else if (status >= 500) {
      toast.error('Server error. Please try again later.')
    }

    return Promise.reject(error)
  }
)

export default API