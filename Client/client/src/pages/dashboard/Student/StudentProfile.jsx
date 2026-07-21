import { useState, useRef, useEffect } from 'react'
import {
  Box, Card, CardContent, Typography, TextField,
  Button, Alert, Grid, Divider, Avatar,
  CircularProgress, IconButton, Chip
} from '@mui/material'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProfile } from '../../../features/student/studentSlice'
import { getMe } from '../../../features/auth/authSlice'
import API    from '../../../api/axios'
import Layout from '../../../components/Layout'

const StudentProfile = () => {
  const dispatch   = useDispatch()
  const { user }   = useSelector((state) => state.auth)
  const { profile } = useSelector((state) => state.student)
  const fileRef    = useRef()

  const [preview,     setPreview]     = useState(user?.photo || '')
  const [photoFile,   setPhotoFile]   = useState(null)
  const [form,        setForm]        = useState({ name: '', phone: '', address: '', fatherName: '' })
  const [passForm,    setPassForm]    = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [loading,     setLoading]     = useState(false)
  const [passLoading, setPassLoading] = useState(false)
  const [success,     setSuccess]     = useState('')
  const [passSuccess, setPassSuccess] = useState('')
  const [errors,      setErrors]      = useState({})
  const [passErrors,  setPassErrors]  = useState({})

  useEffect(() => {
    dispatch(fetchProfile())
  }, [dispatch])

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      return setErrors({ photo: 'Photo must be less than 2MB' })
    }
    setPhotoFile(file)
    setPreview(URL.createObjectURL(file))
    setErrors({})
  }

  const validateProfile = () => {
    const errs = {}
    if (form.phone && !/^[0-9]{10}$/.test(form.phone)) {
      errs.phone = 'Enter valid 10-digit phone'
    }
    if (form.name && form.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const validatePassword = () => {
    const errs = {}
    if (!passForm.currentPassword)    errs.currentPassword = 'Required'
    if (!passForm.newPassword)         errs.newPassword     = 'Required'
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
    setLoading(true)
    try {
      const formData = new FormData()
      if (photoFile)        formData.append('photo',      photoFile)
      if (form.name)        formData.append('name',       form.name)
      if (form.phone)       formData.append('phone',      form.phone)
      if (form.address)     formData.append('address',    form.address)
      if (form.fatherName)  formData.append('fatherName', form.fatherName)

      await API.put('/students/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      await dispatch(getMe())
      await dispatch(fetchProfile())
      setSuccess('Profile updated!')
      setPhotoFile(null)
      setTimeout(() => setSuccess(''), 4000)
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Failed' })
    } finally {
      setLoading(false)
    }
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
      setPassSuccess('Password changed!')
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => setPassSuccess(''), 4000)
    } catch (err) {
      setPassErrors({ submit: err.response?.data?.message || 'Failed' })
    } finally {
      setPassLoading(false)
    }
  }

  return (
    <Layout role="student">
      <Typography variant="h5" fontWeight={700} mb={3}>My Profile</Typography>

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                <Avatar
                  src={preview || user?.photo}
                  sx={{ width: 100, height: 100, fontSize: 36, bgcolor: 'primary.main', mx: 'auto' }}
                >
                  {user?.name?.charAt(0)}
                </Avatar>
                <IconButton
                  sx={{
                    position: 'absolute', bottom: 0, right: 0,
                    bgcolor: 'primary.main', color: 'white',
                    width: 32, height: 32,
                    '&:hover': { bgcolor: 'primary.dark' },
                  }}
                  onClick={() => fileRef.current?.click()}
                >
                  <PhotoCameraIcon sx={{ fontSize: 16 }} />
                </IconButton>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  style={{ display: 'none' }}
                  onChange={handlePhotoChange}
                />
              </Box>

              {errors.photo && (
                <Alert severity="error" sx={{ mb: 1 }}>{errors.photo}</Alert>
              )}

              <Typography variant="h6" fontWeight={700}>{user?.name}</Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>{user?.email}</Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, textAlign: 'left', mt: 2 }}>
                {[
                  { label: 'Roll No',   value: profile?.rollNo   || 'N/A' },
                  { label: 'Program',   value: profile?.program  || 'N/A' },
                  { label: 'Semester',  value: `Sem ${profile?.semester || 1}` },
                  { label: 'Batch',     value: profile?.batch    || 'N/A' },
                  { label: 'Fee',       value: profile?.feeStatus || 'N/A' },
                ].map((item) => (
                  <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                    <Typography variant="caption" fontWeight={600}>{item.value}</Typography>
                  </Box>
                ))}
              </Box>

              <Typography variant="caption" color="text.disabled" display="block" mt={2}>
                Click camera icon to change photo
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          {/* Update Profile */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} mb={2}>Update Profile</Typography>
              <Divider sx={{ mb: 2 }} />

              {errors.submit && <Alert severity="error"   sx={{ mb: 2 }}>{errors.submit}</Alert>}
              {success        && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

              <Box component="form" onSubmit={handleUpdateProfile}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Full Name"
                      fullWidth
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      error={Boolean(errors.name)}
                      helperText={errors.name || `Current: ${user?.name}`}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Phone Number"
                      fullWidth
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      error={Boolean(errors.phone)}
                      helperText={errors.phone || `Current: ${profile?.phone || 'Not set'}`}
                      inputProps={{ maxLength: 10 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Father's Name"
                      fullWidth
                      value={form.fatherName}
                      onChange={(e) => setForm({ ...form, fatherName: e.target.value })}
                      helperText={`Current: ${profile?.fatherName || 'Not set'}`}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Address"
                      fullWidth
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      helperText={`Current: ${profile?.address || 'Not set'}`}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading}
                    >
                      {loading
                        ? <CircularProgress size={22} color="inherit" />
                        : 'Update Profile'
                      }
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

              {passErrors.submit && <Alert severity="error"   sx={{ mb: 2 }}>{passErrors.submit}</Alert>}
              {passSuccess        && <Alert severity="success" sx={{ mb: 2 }}>{passSuccess}</Alert>}

              <Box component="form" onSubmit={handleChangePassword}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Current Password"
                      type="password"
                      fullWidth
                      value={passForm.currentPassword}
                      onChange={(e) => setPassForm({ ...passForm, currentPassword: e.target.value })}
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
                      onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })}
                      error={Boolean(passErrors.newPassword)}
                      helperText={passErrors.newPassword}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Confirm New Password"
                      type="password"
                      fullWidth
                      value={passForm.confirmPassword}
                      onChange={(e) => setPassForm({ ...passForm, confirmPassword: e.target.value })}
                      error={Boolean(passErrors.confirmPassword)}
                      helperText={passErrors.confirmPassword}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="warning"
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

export default StudentProfile