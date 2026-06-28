import API from '../../api/axios'

// Login user
const login = async (credentials) => {
  const response = await API.post('/auth/login', credentials)
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }
  return response.data
}

// Register user
const register = async (userData) => {
  const response = await API.post('/auth/register', userData)
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }
  return response.data
}

// Logout user
const logout = () => {
  localStorage.removeItem('user')
}

// Get current user profile
const getMe = async () => {
  const response = await API.get('/auth/me')
  return response.data
}

// Forgot password
const forgotPassword = async (email) => {
  const response = await API.post('/auth/forgot-password', { email })
  return response.data
}

// Reset password
const resetPassword = async (token, password) => {
  const response = await API.post(`/auth/reset-password/${token}`, { password })
  return response.data
}

const authService = {
  login,
  register,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
}

export default authService