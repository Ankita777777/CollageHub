import { useState } from 'react'
import {
  Box, Card, CardContent, Typography, TextField,
  Button, Alert, Grid, Divider, Avatar, CircularProgress
} from '@mui/material'
import { useSelector } from 'react-redux'
import API    from '../../../api/axios'
import Layout from '../../../components/Layout'

const TeacherSettings = () => {
  const { user } = useSelector((state) => state.auth)

  const [passForm, setPassForm] = useState({
    currentPassword: '', newPassword: '', confirmPassword: ''
  })
  const [profileForm, setProfileForm] = useState({
    phone: '', address: '', qualification: '', department: ''
  })
  const [passLoading,    setPassLoading]    = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)
  const [passSuccess,    setPassSuccess]    = useState('')
  const [passErrors,     setPassErrors]     = useState({})
  const [profileSuccess, setProfileSuccess] = useState('')
  const [profileErrors,  setProfileErrors]  = useState({})

  const validatePassword = () => {
    const errs = {}
    if (!passForm.currentPassword)   errs.currentPassword = 'Current password required'
    if (!passForm.newPassword)        errs.newPassword     = 'New password required'
    else if (passForm.newPassword.length < 6) errs.newPassword = 'Minimum 6 characters'
    if (passForm.newPassword !== passForm.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match'
    }
    setPassErrors(errs)
    return Object.keys(errs).length === 0
  }

  const validateProfile = () => {
    const errs = {}
    if (profileForm.phone && !/^[0-9]{10}$/.test(profileForm.phone)) {
      errs.phone = 'Valid 10-digit phone required'
    }
    setProfileErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (!validatePassword()) return
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
      setPassErrors({ submit: err.response?.data?.message || 'Failed' })
    } finally {
      setPassLoading(false)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    if (!validateProfile()) return
    setProfileLoading(true)
    try {
      await API.put('/teachers/profile', profileForm)
      setProfileSuccess('Profile updated!')
      setTimeout(() => setProfileSuccess(''), 4000)
    } catch (err) {
      setProfileErrors({ submit: err.response?.data?.message || 'Failed' })
    } finally {
      setProfileLoading(false)
    }
  }

  return (
    <Layout role="teacher">
      <Typography variant="h5" fontWeight={700} mb={3}>Settings</Typography>

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: 'success.main', fontSize: 32, mx: 'auto', mb: 2 }}>
                {user?.name?.charAt(0)}
              </Avatar>
              <Typography variant="h6" fontWeight={700}>{user?.name}</Typography>
              <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
              <Box sx={{ mt: 1, bgcolor: 'success.main', color: 'white', py: 0.5, px: 2, borderRadius: 5, display: 'inline-block' }}>
                <Typography variant="caption" fontWeight={700}>TEACHER</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          {/* Update Profile */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} mb={2}>Update Profile</Typography>
              <Divider sx={{ mb: 2 }} />
              {profileErrors.submit && <Alert severity="error" sx={{ mb: 2 }}>{profileErrors.submit}</Alert>}
              {profileSuccess && <Alert severity="success" sx={{ mb: 2 }}>{profileSuccess}</Alert>}
              <Box component="form" onSubmit={handleUpdateProfile}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Phone" fullWidth
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      error={Boolean(profileErrors.phone)}
                      helperText={profileErrors.phone || '10-digit number'}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Department" fullWidth
                      value={profileForm.department}
                      onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Qualification" fullWidth
                      value={profileForm.qualification}
                      onChange={(e) => setProfileForm({ ...profileForm, qualification: e.target.value })}
                      placeholder="e.g. M.Sc. Computer Science"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Address" fullWidth
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" disabled={profileLoading}>
                      {profileLoading ? <CircularProgress size={22} color="inherit" /> : 'Update Profile'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} mb={2}>Change Password</Typography>
              <Divider sx={{ mb: 2 }} />
              {passErrors.submit && <Alert severity="error" sx={{ mb: 2 }}>{passErrors.submit}</Alert>}
              {passSuccess && <Alert severity="success" sx={{ mb: 2 }}>{passSuccess}</Alert>}
              <Box component="form" onSubmit={handleChangePassword}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Current Password" type="password" fullWidth
                      value={passForm.currentPassword}
                      onChange={(e) => setPassForm({ ...passForm, currentPassword: e.target.value })}
                      error={Boolean(passErrors.currentPassword)}
                      helperText={passErrors.currentPassword}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="New Password" type="password" fullWidth
                      value={passForm.newPassword}
                      onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })}
                      error={Boolean(passErrors.newPassword)}
                      helperText={passErrors.newPassword}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Confirm Password" type="password" fullWidth
                      value={passForm.confirmPassword}
                      onChange={(e) => setPassForm({ ...passForm, confirmPassword: e.target.value })}
                      error={Boolean(passErrors.confirmPassword)}
                      helperText={passErrors.confirmPassword}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="warning" disabled={passLoading}>
                      {passLoading ? <CircularProgress size={22} color="inherit" /> : 'Change Password'}
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

export default TeacherSettings