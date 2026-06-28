import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { forgotPassword, reset } from '../features/auth/authSlice'
import { Link } from 'react-router-dom'
import {
  Box, Card, CardContent, TextField, Button,
  Typography, Alert, CircularProgress
} from '@mui/material'
import SchoolIcon from '@mui/icons-material/School'

const ForgotPassword = () => {
  const dispatch = useDispatch()
  const { loading, error, success, message } = useSelector((state) => state.auth)
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(forgotPassword(email))
  }

  return (
    <Box
      sx={{
        minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #0D47A1, #1E88E5)',
      }}
    >
      <Card sx={{ width: 400, p: 2, mx: 2 }}>
        <CardContent>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <SchoolIcon color="primary" sx={{ fontSize: 48 }} />
            <Typography variant="h5" fontWeight={700} color="primary" mt={1}>
              Forgot Password
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter your email to receive a reset link
            </Typography>
          </Box>

          {error   && <Alert severity="error"   sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

          {!success && (
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                label="Email Address" type="email" fullWidth margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button
                type="submit" variant="contained" fullWidth
                size="large" sx={{ mt: 2 }} disabled={loading}
              >
                {loading
                  ? <CircularProgress size={24} color="inherit" />
                  : 'Send Reset Link'
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

export default ForgotPassword