import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login, reset } from '../features/auth/authSlice'
import { useNavigate, Link } from 'react-router-dom'
import {
  Box, Card, CardContent, TextField, Button,
  Typography, Alert, CircularProgress, InputAdornment,
  IconButton, Divider
} from '@mui/material'
import SchoolIcon        from '@mui/icons-material/School'
import VisibilityIcon    from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

const Login = () => {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { user, loading, error } = useSelector((state) => state.auth)

  const [form, setForm]       = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)

  useEffect(() => {
    // If already logged in redirect to dashboard
    if (user) {
      navigate(`/${user.role}/dashboard`, { replace: true })
    }
    return () => dispatch(reset())
  }, [user, navigate, dispatch])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(login(form))
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 50%, #1E88E5 100%)',
      }}
    >
      <Card sx={{ width: 420, p: 2, mx: 2 }}>
        <CardContent>
          {/* Logo */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                bgcolor: 'primary.main', width: 64, height: 64,
                borderRadius: '50%', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                mx: 'auto', mb: 2,
              }}
            >
              <SchoolIcon sx={{ color: 'white', fontSize: 36 }} />
            </Box>
            <Typography variant="h5" color="primary" fontWeight={700}>
              PMC Portal
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Patan Multiple Campus
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Email Address"
              name="email"
              type="email"
              fullWidth
              margin="normal"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
            <TextField
              label="Password"
              name="password"
              type={showPass ? 'text' : 'password'}
              fullWidth
              margin="normal"
              value={form.password}
              onChange={handleChange}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPass(!showPass)} edge="end">
                      {showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ textAlign: 'right', mt: 0.5, mb: 1 }}>
              <Link
                to="/forgot-password"
                style={{ fontSize: 13, color: '#1565C0', textDecoration: 'none' }}
              >
                Forgot Password?
              </Link>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 1, py: 1.4 }}
              disabled={loading}
            >
              {loading
                ? <CircularProgress size={24} color="inherit" />
                : 'Login'
              }
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="body2" textAlign="center">
            Don't have an account?{' '}
            <Link
              to="/register"
              style={{ color: '#1565C0', fontWeight: 600, textDecoration: 'none' }}
            >
              Register here
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Login