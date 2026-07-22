import { useState, useRef, useEffect } from 'react'
import {
  Box, Card, CardContent, Typography, TextField,
  Button, Alert, Grid, Divider, Avatar,
  CircularProgress, IconButton, Chip, Tab, Tabs,
  LinearProgress, MenuItem
} from '@mui/material'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import EditIcon        from '@mui/icons-material/Edit'
import LockIcon        from '@mui/icons-material/Lock'
import SchoolIcon      from '@mui/icons-material/School'
import { useSelector, useDispatch } from 'react-redux'
import { getMe } from '../../../features/auth/authSlice'
import Layout from '../../../components/Layout'
import API    from '../../../api/axios'

const designations = [
  'Lecturer', 'Assistant Professor',
  'Associate Professor', 'Professor', 'HOD'
]

const TeacherSettings = () => {
  const dispatch   = useDispatch()
  const { user }   = useSelector((state) => state.auth)
  const fileRef    = useRef()
  const [tab,      setTab]      = useState(0)
  const [preview,  setPreview]  = useState(user?.photo || '')
  const [teacherProfile, setTeacherProfile] = useState(null)

  const [profileForm, setProfileForm] = useState({
    name: '', phone: '', address: '', qualification: '',
    department: '', designation: 'Lecturer',
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
    if (user?.photo) setPreview(user.photo)

    // Load teacher profile
    API.get('/teachers/profile').then((res) => {
      setTeacherProfile(res.data)
      setProfileForm({
        name:          user?.name              || '',
        phone:         res.data?.phone         || '',
        address:       res.data?.address       || '',
        qualification: res.data?.qualification || '',
        department:    res.data?.department    || '',
        designation:   res.data?.designation  || 'Lecturer',
      })
    }).catch(console.error)
  }, [user])

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      return setProfileErrors({ photo: 'Photo must be less than 2MB' })
    }

    setPreview(URL.createObjectURL(file))
    setPhotoLoading(true)

    try {
      const formData = new FormData()
      formData.append('photo', file)
      formData.append('name',  user?.name || '')

      await API.put('/auth/update-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      await API.put('/teachers/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      dispatch(getMe())
      setProfileSuccess('Photo updated!')
      setTimeout(() => setProfileSuccess(''), 3000)
    } catch (err) {
      setProfileErrors({ photo: err.response?.data?.message || 'Failed to upload' })
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
      errs.phone = 'Enter valid 10-digit phone'
    }
    setProfileErrors(errs)
    return Object.keys(errs).length === 0
  }

  const validatePassword = () => {
    const errs = {}
    if (!passForm.currentPassword) errs.currentPassword = 'Required'
    if (!passForm.newPassword)      errs.newPassword     = 'Required'
    else if (passForm.newPassword.length < 6) errs.newPassword = 'Min 6 characters'
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
      // Update teacher profile
      await API.put('/teachers/profile', {
        phone:         profileForm.phone,
        address:       profileForm.address,
        qualification: profileForm.qualification,
        department:    profileForm.department,
        designation:   profileForm.designation,
      })

      // Update user name if changed
      if (profileForm.name !== user?.name) {
        const fd = new FormData()
        fd.append('name', profileForm.name)
        await API.put('/auth/update-profile', fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }

      dispatch(getMe())
      setProfileSuccess('Profile updated successfully!')
      setTimeout(() => setProfileSuccess(''), 4000)
    } catch (err) {
      setProfileErrors({ submit: err.response?.data?.message || 'Failed' })
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
      setPassErrors({ submit: err.response?.data?.message || 'Failed' })
    } finally {
      setPassLoading(false)
    }
  }

  return (
    <Layout role="teacher">
      <Typography variant="h5" fontWeight={700} mb={3}>Settings</Typography>

      <Grid container spacing={3}>

        {/* LEFT — Profile Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <Box sx={{
              background: 'linear-gradient(135deg, #1B5E20, #2E7D32)',
              height: 80,
              borderRadius: '12px 12px 0 0',
            }} />
            <CardContent sx={{ textAlign: 'center', pt: 0, mt: -5 }}>
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                <Avatar
                  src={preview}
                  sx={{
                    width: 90, height: 90,
                    fontSize: 32,
                    bgcolor: 'success.main',
                    border: '4px solid white',
                    boxShadow: 3,
                  }}
                >
                  {user?.name?.charAt(0)?.toUpperCase()}
                </Avatar>
                <IconButton
                  onClick={() => fileRef.current?.click()}
                  disabled={photoLoading}
                  sx={{
                    position: 'absolute', bottom: 0, right: -4,
                    bgcolor:  'success.main', color: 'white',
                    width: 28, height: 28,
                    '&:hover': { bgcolor: 'success.dark' },
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
                  accept="image/jpeg,image/png"
                  style={{ display: 'none' }}
                  onChange={handlePhotoChange}
                />
              </Box>

              {profileErrors.photo && (
                <Alert severity="error" sx={{ mb: 1 }}>{profileErrors.photo}</Alert>
              )}

              <Typography variant="h6" fontWeight={700}>{user?.name}</Typography>
              <Typography variant="body2" color="text.secondary" mb={1}>
                {user?.email}
              </Typography>
              <Chip label="Teacher" color="success" size="small" icon={<SchoolIcon />} />

              <Divider sx={{ my: 2 }} />

              <Box sx={{ textAlign: 'left' }}>
                {[
                  { label: 'Employee ID',    value: teacherProfile?.employeeId  || 'N/A' },
                  { label: 'Department',     value: teacherProfile?.department   || 'Not set' },
                  { label: 'Designation',    value: teacherProfile?.designation  || 'N/A' },
                  { label: 'Qualification',  value: teacherProfile?.qualification || 'Not set' },
                  { label: 'Phone',          value: teacherProfile?.phone        || 'Not set' },
                ].map((item) => (
                  <Box
                    key={item.label}
                    sx={{
                      display: 'flex', justifyContent: 'space-between',
                      mb: 1, py: 0.5, borderBottom: '1px solid #f0f0f0',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      {item.label}
                    </Typography>
                    <Typography variant="caption" fontWeight={600}>
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Typography variant="caption" color="text.disabled" mt={2} display="block">
                Click camera icon to change photo
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* RIGHT — Edit Forms */}
        <Grid item xs={12} md={8}>
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ px: 2 }}>
                <Tab icon={<EditIcon />}  iconPosition="start" label="Edit Profile" />
                <Tab icon={<LockIcon />}  iconPosition="start" label="Change Password" />
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
                    Update your profile details
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
                          label="Department"
                          fullWidth
                          value={profileForm.department}
                          onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                          placeholder="e.g. Computer Science"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Designation"
                          select
                          fullWidth
                          value={profileForm.designation}
                          onChange={(e) => setProfileForm({ ...profileForm, designation: e.target.value })}
                        >
                          {designations.map((d) => (
                            <MenuItem key={d} value={d}>{d}</MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Qualification"
                          fullWidth
                          value={profileForm.qualification}
                          onChange={(e) => setProfileForm({ ...profileForm, qualification: e.target.value })}
                          placeholder="e.g. M.Sc. Computer Science"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Address"
                          fullWidth
                          value={profileForm.address}
                          onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Button
                            type="submit"
                            variant="contained"
                            color="success"
                            size="large"
                            disabled={profileLoading}
                            sx={{ minWidth: 160 }}
                          >
                            {profileLoading
                              ? <CircularProgress size={22} color="inherit" />
                              : 'Save Changes'
                            }
                          </Button>
                          <Button variant="outlined" size="large" onClick={() => dispatch(getMe())}>
                            Cancel
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
                    Use a strong password with letters, numbers and symbols
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
                          helperText={passErrors.newPassword || 'Min 6 characters'}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Confirm Password"
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

                      {passForm.newPassword && (
                        <Grid item xs={12}>
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

export default TeacherSettings