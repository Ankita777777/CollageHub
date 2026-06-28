import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Box, Card, CardContent, TextField, Button,
  Typography, Alert, CircularProgress, MenuItem
} from '@mui/material'
import SchoolIcon from '@mui/icons-material/School'
import API from '../api/axios'

const Register = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [form,    setForm]    = useState({
    name: '', email: '', password: '', confirmPassword: '', role: 'student'
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match')
    }
    setLoading(true)
    setError('')
    try {
      await API.post('/auth/register', {
        name:     form.name,
        email:    form.email,
        password: form.password,
        role:     form.role,
      })
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Card sx={{ width: 440, p: 2 }}>
        <CardContent>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <SchoolIcon color="primary" sx={{ fontSize: 48 }} />
            <Typography variant="h5" color="primary" mt={1} fontWeight={700}>
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              PMC College Portal
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Full Name" name="name" fullWidth margin="normal"
              value={form.name} onChange={handleChange} required
            />
            <TextField
              label="Email" name="email" type="email" fullWidth margin="normal"
              value={form.email} onChange={handleChange} required
            />
            <TextField
              label="Role" name="role" select fullWidth margin="normal"
              value={form.role} onChange={handleChange}
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="teacher">Teacher</MenuItem>
            </TextField>
            <TextField
              label="Password" name="password" type="password" fullWidth margin="normal"
              value={form.password} onChange={handleChange} required
            />
            <TextField
              label="Confirm Password" name="confirmPassword" type="password"
              fullWidth margin="normal"
              value={form.confirmPassword} onChange={handleChange} required
            />
            <Button
              type="submit" variant="contained" fullWidth size="large"
              sx={{ mt: 2 }} disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
            </Button>
            <Typography variant="body2" textAlign="center" mt={2}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#1565C0', fontWeight: 600 }}>
                Login
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Register