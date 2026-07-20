import { useState } from 'react'
import {
  Box, Card, CardContent, Typography, TextField,
  Button, Alert, Grid, Divider, Avatar, CircularProgress
} from '@mui/material'
import { useSelector } from 'react-redux'
import API    from '../../../api/axios'
import Layout from '../../../components/Layout'

const AdminSettings = () => {
  const { user } = useSelector((state) => state.auth)

  const [passForm, setPassForm] = useState({
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
  })
  const [passLoading, setPassLoading] = useState(false)
  const [passSuccess, setPassSuccess] = useState('')
  const [passError,   setPassError]   = useState('')

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPassError('')
    setPassSuccess('')

    if (!passForm.currentPassword || !passForm.newPassword || !passForm.confirmPassword) {
      return setPassError('Please fill all fields')
    }
    if (passForm.newPassword !== passForm.confirmPassword) {
      return setPassError('New passwords do not match')
    }
    if (passForm.newPassword.length < 6) {
      return setPassError('Password must be at least 6 characters')
    }

    setPassLoading(true)
    try {
      await API.put('/auth/change-password', {
        currentPassword: passForm.currentPassword,
        newPassword:     passForm.newPassword,
      })
      setPassSuccess('Password changed successfully!')
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => setPassSuccess(''), 4000)
    } catch (err) {
      setPassError(err.response?.data?.message || 'Failed to change password')
    } finally {
      setPassLoading(false)
    }
  }

  return (
    <Layout role="admin">
      <Typography variant="h5" fontWeight={700} mb={3}>Settings</Typography>

      <Grid container spacing={3}>
        {/* Profile Info */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Avatar
                sx={{
                  width: 80, height: 80,
                  bgcolor: 'primary.main',
                  fontSize: 32, mx: 'auto', mb: 2,
                }}
              >
                {user?.name?.charAt(0)}
              </Avatar>
              <Typography variant="h6" fontWeight={700}>{user?.name}</Typography>
              <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
              <Box sx={{
                mt: 2, bgcolor: 'primary.main',
                color: 'white', py: 0.5, px: 2,
                borderRadius: 5, display: 'inline-block',
              }}>
                <Typography variant="caption" fontWeight={700}>ADMIN</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Change Password */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={700} mb={0.5}>
                Change Password
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Make sure your new password is strong and secure
              </Typography>
              <Divider sx={{ mb: 3 }} />

              {passSuccess && <Alert severity="success" sx={{ mb: 2 }}>{passSuccess}</Alert>}
              {passError   && <Alert severity="error"   sx={{ mb: 2 }}>{passError}</Alert>}

              <Box component="form" onSubmit={handleChangePassword}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Current Password"
                      type="password"
                      fullWidth
                      required
                      value={passForm.currentPassword}
                      onChange={(e) => setPassForm({ ...passForm, currentPassword: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="New Password"
                      type="password"
                      fullWidth
                      required
                      value={passForm.newPassword}
                      onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Confirm New Password"
                      type="password"
                      fullWidth
                      required
                      value={passForm.confirmPassword}
                      onChange={(e) => setPassForm({ ...passForm, confirmPassword: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={passLoading}
                    >
                      {passLoading
                        ? <CircularProgress size={22} color="inherit" />
                        : 'Change Password'
                      }
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  )
}

export default AdminSettings