import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login, reset } from '../features/auth/authSlice'
import { useNavigate, Link } from 'react-router-dom'
import {
  Box, Card, CardContent, TextField, Button,
  Typography, Alert, CircularProgress,
  InputAdornment, IconButton, Divider
} from '@mui/material'
import SchoolIcon        from '@mui/icons-material/School'
import VisibilityIcon    from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import EmailIcon         from '@mui/icons-material/Email'
import LockIcon          from '@mui/icons-material/Lock'
import PageMeta          from '../components/PageMeta'
import { toast }         from 'react-toastify'

const Login = () => {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { user, loading, error } = useSelector((state) => state.auth)
  const [form,    setForm]    = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [errors,   setErrors]   = useState({})

  useEffect(() => {
    if (user) {
      toast.success(`Welcome back, ${user.name}!`)
      navigate(`/${user.role}/dashboard`, { replace: true })
    }
    return () => dispatch(reset())
  }, [user, navigate, dispatch])

  const validate = () => {
    const errs = {}
    if (!form.email)    errs.email    = 'Email is required'
    if (!form.password) errs.password = 'Password is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    dispatch(login(form))
  }

  return (
    <>
      <PageMeta title="Login" description="Login to PMC College Portal" />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 60%, #1E88E5 100%)',
          p: 2,
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 420 }}>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            {/* Logo */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box sx={{
                bgcolor: 'primary.main', width: 60, height: 60,
                borderRadius: 3, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                mx: 'auto', mb: 2, boxShadow: 3,
              }}>
                <SchoolIcon sx={{ color: 'white', fontSize: 32 }} />
              </Box>
              <Typography variant="h5" fontWeight={800} color="primary.main">
                Welcome Back
              </Typography>
              <Typography variant="body2" color="text.secondary">
                PMC College Portal
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                label="Email Address"
                type="email"
                fullWidth
                margin="normal"
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value })
                  setErrors({ ...errors, email: '' })
                }}
                error={Boolean(errors.email)}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Password"
                type={showPass ? 'text' : 'password'}
                fullWidth
                margin="normal"
                value={form.password}
                onChange={(e) => {
                  setForm({ ...form, password: e.target.value })
                  setErrors({ ...errors, password: '' })
                }}
                error={Boolean(errors.password)}
                helperText={errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPass(!showPass)} edge="end" size="small">
                        {showPass ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ textAlign: 'right', mt: 0.5, mb: 2 }}>
                <Link to="/forgot-password" style={{ fontSize: 13, color: '#1565C0', textDecoration: 'none' }}>
                  Forgot Password?
                </Link>
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{ py: 1.4 }}
              >
                {loading
                  ? <CircularProgress size={22} color="inherit" />
                  : 'Login to Portal'
                }
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="body2" textAlign="center">
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#1565C0', fontWeight: 700, textDecoration: 'none' }}>
                Register here
              </Link>
            </Typography>

            <Typography variant="body2" textAlign="center" mt={1}>
              <Link to="/results/check" style={{ color: '#E65100', fontSize: 13, textDecoration: 'none' }}>
                🔍 Check Result Without Login
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </>
  )
}

export default Login