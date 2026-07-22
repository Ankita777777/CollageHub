import { useState, useRef, useEffect } from 'react'
import {
  Box, Card, CardContent, Typography, TextField,
  Button, Alert, Grid, Divider, Avatar,
  CircularProgress, IconButton, Chip, Tab, Tabs,
  LinearProgress
} from '@mui/material'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import EditIcon        from '@mui/icons-material/Edit'
import LockIcon        from '@mui/icons-material/Lock'
import PersonIcon      from '@mui/icons-material/Person'
import SchoolIcon      from '@mui/icons-material/School'
import { useSelector, useDispatch } from 'react-redux'
import { updateUserProfile, changePassword as changePass, getMe } from '../../../features/auth/authSlice'
import { fetchProfile, fetchAttendance, fetchResults } from '../../../features/student/studentSlice'
import Layout from '../../../components/Layout'
import API    from '../../../api/axios'

const StudentProfile = () => {
  const dispatch    = useDispatch()
  const { user, loading: authLoading } = useSelector((state) => state.auth)
  const { profile, attendance, results } = useSelector((state) => state.student)
  const fileRef     = useRef()
  const [tab,       setTab]       = useState(0)
  const [preview,   setPreview]   = useState('')

  const [profileForm, setProfileForm] = useState({
    name: '', phone: '', address: '', fatherName: ''
  })
  const [passForm, setPassForm] = useState({
    currentPassword: '', newPassword: '', confirmPassword: ''
  })

  const [profileLoading, setProfileLoading] = useState(false)
  const [passLoading,    setPassLoading]    = useState(false)
  const [photoLoading,   setPhotoLoading]   = useState(false)
  const [profileSuccess, setProfileSuccess] = useState('')
  const [passSuccess,    setPassSuccess]    = useState('')
  const [profileErrors,  setProfileErrors]  = useState({})
  const [passErrors,     setPassErrors]     = useState({})

  useEffect(() => {
    dispatch(fetchProfile())
    dispatch(fetchAttendance())
    dispatch(fetchResults())
  }, [dispatch])

  // Set preview from user photo
  useEffect(() => {
    if (user?.photo) setPreview(user.photo)
  }, [user?.photo])

  // Fill form with current values
  useEffect(() => {
    if (profile || user) {
      setProfileForm({
        name:       user?.name        || '',
        phone:      profile?.phone     || '',
        address:    profile?.address   || '',
        fatherName: profile?.fatherName || '',
      })
    }
  }, [profile, user])

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setProfileErrors({ photo: 'Photo must be less than 2MB' })
      return
    }

    // Show preview immediately
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    setPhotoLoading(true)

    try {
      const formData = new FormData()
      formData.append('photo', file)
      formData.append('name',  user?.name || '')

      // Update auth profile (photo goes to User model)
      const res = await API.put('/auth/update-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      // Also update student profile
      await API.put('/students/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      // Update redux + localStorage
      dispatch(getMe())
      setProfileSuccess('Photo updated successfully!')
      setTimeout(() => setProfileSuccess(''), 3000)
    } catch (err) {
      setProfileErrors({ photo: err.response?.data?.message || 'Failed to upload photo' })
      setPreview(user?.photo || '')
    } finally {
      setPhotoLoading(false)
    }
  }

  const validateProfile = () => {
    const errs = {}
    if (!profileForm.name?.trim() || profileForm.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters'
    }
    if (profileForm.phone && !/^[0-9]{10}$/.test(profileForm.phone)) {
      errs.phone = 'Enter valid 10-digit phone number'
    }
    setProfileErrors(errs)
    return Object.keys(errs).length === 0
  }

  const validatePassword = () => {
    const errs = {}
    if (!passForm.currentPassword) errs.currentPassword = 'Current password is required'
    if (!passForm.newPassword)      errs.newPassword     = 'New password is required'
    else if (passForm.newPassword.length < 6) errs.newPassword = 'Minimum 6 characters'
    if (passForm.newPassword !== passForm.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match'
    }
    setPassErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    if (!validateProfile()) return
    setProfileLoading(true)
    setProfileErrors({})

    try {
      // Update student profile
      await API.put('/students/profile', {
        phone:      profileForm.phone,
        address:    profileForm.address,
        fatherName: profileForm.fatherName,
      })

      // Update user name
      if (profileForm.name !== user?.name) {
        const formData = new FormData()
        formData.append('name', profileForm.name)
        await API.put('/auth/update-profile', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }

      // Refresh redux state
      await dispatch(getMe())
      await dispatch(fetchProfile())

      setProfileSuccess('Profile updated successfully!')
      setTimeout(() => setProfileSuccess(''), 4000)
    } catch (err) {
      setProfileErrors({ submit: err.response?.data?.message || 'Failed to update profile' })
    } finally {
      setProfileLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (!validatePassword()) return
    setPassLoading(true)
    setPassErrors({})

    try {
      await API.put('/auth/change-password', {
        currentPassword: passForm.currentPassword,
        newPassword:     passForm.newPassword,
      })
      setPassSuccess('Password changed successfully!')
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => setPassSuccess(''), 4000)
    } catch (err) {
      setPassErrors({ submit: err.response?.data?.message || 'Failed to change password' })
    } finally {
      setPassLoading(false)
    }
  }

  // Attendance summary
  const avgAttendance = attendance.summary?.length
    ? (attendance.summary.reduce((s, a) => s + Number(a.percentage), 0) / attendance.summary.length).toFixed(1)
    : 0

  const passedSubjects = results.filter((r) => r.status === 'pass').length
  const avgMarks       = results.length
    ? (results.reduce((s, r) => s + (r.marks || 0), 0) / results.length).toFixed(1)
    : 0

  return (
    <Layout role="student">
      <Typography variant="h5" fontWeight={700} mb={3}>My Profile</Typography>

      <Grid container spacing={3}>

        {/* LEFT — Profile Card */}
        <Grid item xs={12} md={4}>

          {/* Main Profile Card */}
          <Card sx={{ mb: 2, overflow: 'visible' }}>
            <Box sx={{
              background: 'linear-gradient(135deg, #0D47A1, #1565C0)',
              height: 80,
              borderRadius: '12px 12px 0 0',
            }} />
            <CardContent sx={{ textAlign: 'center', pt: 0, mt: -5 }}>
              {/* Photo */}
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                <Avatar
                  src={preview}
                  sx={{
                    width: 90, height: 90,
                    fontSize: 32,
                    bgcolor: 'primary.main',
                    border: '4px solid white',
                    boxShadow: 3,
                  }}
                >
                  {user?.name?.charAt(0)?.toUpperCase()}
                </Avatar>

                {/* Camera button */}
                <IconButton
                  onClick={() => fileRef.current?.click()}
                  disabled={photoLoading}
                  sx={{
                    position: 'absolute',
                    bottom: 0, right: -4,
                    bgcolor: 'primary.main',
                    color:   'white',
                    width: 28, height: 28,
                    '&:hover': { bgcolor: 'primary.dark' },
                    boxShadow: 2,
                  }}
                >
                  {photoLoading
                    ? <CircularProgress size={12} color="inherit" />
                    : <PhotoCameraIcon sx={{ fontSize: 14 }} />
                  }
                </IconButton>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  style={{ display: 'none' }}
                  onChange={handlePhotoChange}
                />
              </Box>

              {profileErrors.photo && (
                <Alert severity="error" sx={{ mb: 1, textAlign: 'left' }}>
                  {profileErrors.photo}
                </Alert>
              )}

              <Typography variant="h6" fontWeight={700}>{user?.name}</Typography>
              <Typography variant="body2" color="text.secondary" mb={1}>
                {user?.email}
              </Typography>
              <Chip
                label="Student"
                color="primary"
                size="small"
                icon={<PersonIcon />}
              />

              <Divider sx={{ my: 2 }} />

              {/* Student Info */}
              <Box sx={{ textAlign: 'left' }}>
                {[
                  { label: 'Roll No',   value: profile?.rollNo    || 'N/A' },
                  { label: 'Program',   value: profile?.program   || 'N/A' },
                  { label: 'Semester',  value: `Semester ${profile?.semester || 1}` },
                  { label: 'Batch',     value: profile?.batch     || 'N/A' },
                  { label: 'Phone',     value: profile?.phone     || 'Not set' },
                  { label: 'Address',   value: profile?.address   || 'Not set' },
                  { label: 'Father',    value: profile?.fatherName || 'Not set' },
                  { label: 'Fee',       value: profile?.feeStatus || 'N/A' },
                ].map((item) => (
                  <Box
                    key={item.label}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 1, py: 0.5,
                      borderBottom: '1px solid #f0f0f0',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      {item.label}
                    </Typography>
                    <Typography variant="caption" fontWeight={600} sx={{ textAlign: 'right', maxWidth: '60%' }}>
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Academic Stats Card */}
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <SchoolIcon color="primary" fontSize="small" />
                <Typography variant="subtitle1" fontWeight={700}>Academic Summary</Typography>
              </Box>

              {[
                { label: 'Avg Attendance', value: `${avgAttendance}%`, color: Number(avgAttendance) >= 75 ? 'success.main' : 'error.main', progress: Number(avgAttendance) },
                { label: 'Subjects Passed', value: `${passedSubjects}/${results.length}`, color: 'primary.main', progress: results.length ? (passedSubjects / results.length) * 100 : 0 },
                { label: 'Average Marks',   value: `${avgMarks}%`, color: Number(avgMarks) >= 50 ? 'success.main' : 'warning.main', progress: Number(avgMarks) },
              ].map((stat) => (
                <Box key={stat.label} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                    <Typography variant="caption" fontWeight={700} sx={{ color: stat.color }}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(stat.progress, 100)}
                    sx={{ borderRadius: 2, height: 6 }}
                    color={stat.progress >= 75 ? 'success' : stat.progress >= 50 ? 'warning' : 'error'}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* RIGHT — Edit Forms */}
        <Grid item xs={12} md={8}>
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ px: 2 }}>
                <Tab icon={<EditIcon />} iconPosition="start" label="Edit Profile" />
                <Tab icon={<LockIcon />} iconPosition="start" label="Change Password" />
              </Tabs>
            </Box>

            <CardContent sx={{ p: 4 }}>

              {/* Tab 0 — Edit Profile */}
              {tab === 0 && (
                <Box>
                  <Typography variant="h6" fontWeight={700} mb={0.5}>
                    Personal Information
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={3}>
                    Update your profile details. Changes are saved immediately.
                  </Typography>

                  {profileErrors.submit && (
                    <Alert severity="error" sx={{ mb: 2 }}>{profileErrors.submit}</Alert>
                  )}
                  {profileSuccess && (
                    <Alert severity="success" sx={{ mb: 2 }}>{profileSuccess}</Alert>
                  )}

                  <Box component="form" onSubmit={handleUpdateProfile}>
                    <Grid container spacing={2.5}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Full Name"
                          fullWidth
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          error={Boolean(profileErrors.name)}
                          helperText={profileErrors.name}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Email Address"
                          fullWidth
                          value={user?.email || ''}
                          disabled
                          helperText="Email cannot be changed"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Phone Number"
                          fullWidth
                          value={profileForm.phone}
                          onChange={(e) => {
                            setProfileForm({ ...profileForm, phone: e.target.value })
                            setProfileErrors({ ...profileErrors, phone: '' })
                          }}
                          error={Boolean(profileErrors.phone)}
                          helperText={profileErrors.phone || '10-digit number'}
                          inputProps={{ maxLength: 10 }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Father's Name"
                          fullWidth
                          value={profileForm.fatherName}
                          onChange={(e) => setProfileForm({ ...profileForm, fatherName: e.target.value })}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Address"
                          fullWidth
                          multiline
                          rows={2}
                          value={profileForm.address}
                          onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                          placeholder="e.g. Pokhara-10, Gandaki Province"
                        />
                      </Grid>

                      {/* Read-only fields */}
                      <Grid item xs={12}>
                        <Divider sx={{ my: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Academic Info (Read Only)
                          </Typography>
                        </Divider>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="Roll Number"
                          fullWidth
                          value={profile?.rollNo || 'N/A'}
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="Program"
                          fullWidth
                          value={profile?.program || 'N/A'}
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="Semester"
                          fullWidth
                          value={`Semester ${profile?.semester || 1}`}
                          disabled
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={profileLoading}
                            sx={{ minWidth: 160 }}
                          >
                            {profileLoading
                              ? <CircularProgress size={22} color="inherit" />
                              : 'Save Changes'
                            }
                          </Button>
                          <Button
                            variant="outlined"
                            size="large"
                            onClick={() => setProfileForm({
                              name:       user?.name         || '',
                              phone:      profile?.phone     || '',
                              address:    profile?.address   || '',
                              fatherName: profile?.fatherName || '',
                            })}
                          >
                            Reset
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              )}

              {/* Tab 1 — Change Password */}
              {tab === 1 && (
                <Box>
                  <Typography variant="h6" fontWeight={700} mb={0.5}>
                    Change Password
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={3}>
                    Make sure your new password is strong and at least 6 characters.
                  </Typography>

                  {passErrors.submit && (
                    <Alert severity="error" sx={{ mb: 2 }}>{passErrors.submit}</Alert>
                  )}
                  {passSuccess && (
                    <Alert severity="success" sx={{ mb: 2 }}>{passSuccess}</Alert>
                  )}

                  <Box component="form" onSubmit={handleChangePassword}>
                    <Grid container spacing={2.5}>
                      <Grid item xs={12}>
                        <TextField
                          label="Current Password"
                          type="password"
                          fullWidth
                          value={passForm.currentPassword}
                          onChange={(e) => {
                            setPassForm({ ...passForm, currentPassword: e.target.value })
                            setPassErrors({ ...passErrors, currentPassword: '' })
                          }}
                          error={Boolean(passErrors.currentPassword)}
                          helperText={passErrors.currentPassword}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="New Password"
                          type="password"
                          fullWidth
                          value={passForm.newPassword}
                          onChange={(e) => {
                            setPassForm({ ...passForm, newPassword: e.target.value })
                            setPassErrors({ ...passErrors, newPassword: '' })
                          }}
                          error={Boolean(passErrors.newPassword)}
                          helperText={passErrors.newPassword || 'At least 6 characters'}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Confirm New Password"
                          type="password"
                          fullWidth
                          value={passForm.confirmPassword}
                          onChange={(e) => {
                            setPassForm({ ...passForm, confirmPassword: e.target.value })
                            setPassErrors({ ...passErrors, confirmPassword: '' })
                          }}
                          error={Boolean(passErrors.confirmPassword)}
                          helperText={passErrors.confirmPassword}
                        />
                      </Grid>

                      {/* Password strength indicator */}
                      {passForm.newPassword && (
                        <Grid item xs={12}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Password Strength:
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={
                                passForm.newPassword.length >= 10 ? 100 :
                                passForm.newPassword.length >= 8  ? 66  :
                                passForm.newPassword.length >= 6  ? 33  : 10
                              }
                              color={
                                passForm.newPassword.length >= 10 ? 'success' :
                                passForm.newPassword.length >= 8  ? 'warning' : 'error'
                              }
                              sx={{ mt: 0.5, borderRadius: 2, height: 6 }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {passForm.newPassword.length >= 10 ? 'Strong'  :
                               passForm.newPassword.length >= 8  ? 'Medium' : 'Weak'}
                            </Typography>
                          </Box>
                        </Grid>
                      )}

                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="warning"
                          size="large"
                          disabled={passLoading}
                          sx={{ minWidth: 180 }}
                        >
                          {passLoading
                            ? <CircularProgress size={22} color="inherit" />
                            : 'Change Password'
                          }
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  )
}

export default StudentProfile