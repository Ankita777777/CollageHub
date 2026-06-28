import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { resetPassword, reset } from '../features/auth/authSlice'
import { useNavigate, useParams, Link } from 'react-router-dom'
import {
  Box, Card, CardContent, TextField, Button,
  Typography, Alert, CircularProgress, InputAdornment, IconButton
} from '@mui/material'
import SchoolIcon        from '@mui/icons-material/School'
import VisibilityIcon    from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

const ResetPassword = () => {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { token } = useParams()
  const { loading, error, success } = useSelector((state) => state.auth)

  const [form, setForm]         = useState({ password: '', confirmPassword: '' })
  const [showPass, setShowPass] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    if (success) {
      setTimeout(() => navigate('/login'), 2000)
    }
    return () => dispatch(reset())
  }, [success, navigate, dispatch])

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormError('')
    if (form.password !== form.confirmPassword) {
      return setFormError('Passwords do not match')
    }
    if (form.password.length < 6) {
      return setFormError('Password must be at least 6 characters')
    }
    dispatch(resetPassword({ token, password: form.password }))
  }

  return (
    <Box
      sx={{
        minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #0D47A1, #1E88E5)',
      }}
    >
      <Card sx={{ width: 420, p: 2, mx: 2 }}>
        <CardContent>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <SchoolIcon color="primary" sx={{ fontSize: 48 }} />
            <Typography variant="h5" fontWeight={700} color="primary" mt={1}>
              Reset Password
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter your new password
            </Typography>
          </Box>

          {(formError || error) && (
            <Alert severity="error" sx={{ mb: 2 }}>{formError || error}</Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Password reset successful! Redirecting to login...
            </Alert>
          )}

          {!success && (
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                label="New Password"
                type={showPass ? 'text' : 'password'}
                fullWidth margin="normal"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
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
              <TextField
                label="Confirm New Password"
                type={showPass ? 'text' : 'password'}
                fullWidth margin="normal"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                required
              />
              <Button
                type="submit" variant="contained" fullWidth
                size="large" sx={{ mt: 2 }} disabled={loading}
              >
                {loading
                  ? <CircularProgress size={24} color="inherit" />
                  : 'Reset Password'
                }
              </Button>
            </Box>
          )}

          <Typography variant="body2" textAlign="center" mt={3}>
            <Link
              to="/login"
              style={{ color: '#1565C0', textDecoration: 'none', fontWeight: 600 }}
            >
              ← Back to Login
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default ResetPassword