import API from '../../api/axios'

const login = async (credentials) => {
  const res = await API.post('/auth/login', credentials)
  if (res.data) localStorage.setItem('user', JSON.stringify(res.data))
  return res.data
}

const register = async (userData) => {
  const res = await API.post('/auth/register', userData)
  if (res.data) localStorage.setItem('user', JSON.stringify(res.data))
  return res.data
}

const logout = () => {
  localStorage.removeItem('user')
}

const getMe = async () => {
  const res = await API.get('/auth/me')
  return res.data
}

// ✅ New — update profile with photo support
const updateProfile = async (formData) => {
  const res = await API.put('/auth/update-profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

const forgotPassword = async (email) => {
  const res = await API.post('/auth/forgot-password', { email })
  return res.data
}

const resetPassword = async (token, password) => {
  const res = await API.post(`/auth/reset-password/${token}`, { password })
  return res.data
}

const authService = {
  login, register, logout, getMe,
  updateProfile, forgotPassword, resetPassword,
}

export default authService