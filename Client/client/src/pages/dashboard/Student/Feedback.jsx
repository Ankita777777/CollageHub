import { useState, useEffect } from 'react'
import {
  Box, Card, CardContent, Typography, TextField,
  Button, Alert, Grid, MenuItem, CircularProgress,
  Rating, Chip, List, ListItem, ListItemText,
  FormControlLabel, Switch, Divider
} from '@mui/material'
import StarIcon   from '@mui/icons-material/Star'
import API    from '../../../api/axios'
import Layout from '../../../components/Layout'

const feedbackTypes = ['course', 'teacher', 'facility', 'general']

const Feedback = () => {
  const [myFeedbacks, setMyFeedbacks] = useState([])
  const [courses,     setCourses]     = useState([])
  const [teachers,    setTeachers]    = useState([])
  const [loading,     setLoading]     = useState(true)
  const [success,     setSuccess]     = useState('')
  const [errors,      setErrors]      = useState({})
  const [submitLoad,  setSubmitLoad]  = useState(false)
  const [form, setForm] = useState({
    type:        'general',
    courseId:    '',
    teacherId:   '',
    rating:      0,
    comment:     '',
    isAnonymous: false,
  })

  const fetchAll = async () => {
    try {
      const [fRes, cRes] = await Promise.all([
        API.get('/feedback/my'),
        API.get('/admin/courses'),
      ])
      setMyFeedbacks(fRes.data)
      setCourses(cRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const validate = () => {
    const errs = {}
    if (!form.rating || form.rating === 0) errs.rating  = 'Please select a rating'
    if (!form.comment.trim() || form.comment.trim().length < 5) {
      errs.comment = 'Comment must be at least 5 characters'
    }
    if (form.type === 'course'  && !form.courseId)  errs.courseId  = 'Please select a course'
    if (form.type === 'teacher' && !form.teacherId) errs.teacherId = 'Please select a teacher'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitLoad(true)
    try {
      await API.post('/feedback', {
        courseId:    form.courseId   || undefined,
        teacherId:   form.teacherId  || undefined,
        type:        form.type,
        rating:      form.rating,
        comment:     form.comment,
        isAnonymous: form.isAnonymous,
      })
      setSuccess('Feedback submitted! Thank you.')
      setForm({ type: 'general', courseId: '', teacherId: '', rating: 0, comment: '', isAnonymous: false })
      fetchAll()
      setTimeout(() => setSuccess(''), 4000)
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Failed' })
    } finally {
      setSubmitLoad(false)
    }
  }

  const getRatingLabel = (rating) => {
    const labels = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent' }
    return labels[rating] || ''
  }

  return (
    <Layout role="student">
      <Typography variant="h5" fontWeight={700} mb={3}>Submit Feedback</Typography>

      <Grid container spacing={3}>
        {/* Submit Form */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>Give Feedback</Typography>

              {errors.submit && <Alert severity="error"   sx={{ mb: 2 }}>{errors.submit}</Alert>}
              {success       && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Feedback Type" select fullWidth
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value, courseId: '', teacherId: '' })}
                    >
                      {feedbackTypes.map((t) => (
                        <MenuItem key={t} value={t} sx={{ textTransform: 'capitalize' }}>
                          {t.charAt(0).toUpperCase() + t.slice(1)} Feedback
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  {form.type === 'course' && (
                    <Grid item xs={12}>
                      <TextField
                        label="Select Course *" select fullWidth
                        value={form.courseId}
                        onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                        error={Boolean(errors.courseId)}
                        helperText={errors.courseId}
                      >
                        {courses.map((c) => (
                          <MenuItem key={c._id} value={c._id}>
                            {c.name} ({c.code})
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Typography variant="body2" fontWeight={600} mb={0.5}>
                      Rating *
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Rating
                        value={form.rating}
                        onChange={(e, val) => {
                          setForm({ ...form, rating: val })
                          setErrors({ ...errors, rating: '' })
                        }}
                        size="large"
                        emptyIcon={<StarIcon fontSize="inherit" />}
                      />
                      {form.rating > 0 && (
                        <Chip
                          label={getRatingLabel(form.rating)}
                          size="small"
                          color={form.rating >= 4 ? 'success' : form.rating >= 3 ? 'warning' : 'error'}
                        />
                      )}
                    </Box>
                    {errors.rating && (
                      <Typography variant="caption" color="error">{errors.rating}</Typography>
                    )}
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Your Comment *"
                      fullWidth multiline rows={4}
                      value={form.comment}
                      onChange={(e) => {
                        setForm({ ...form, comment: e.target.value })
                        setErrors({ ...errors, comment: '' })
                      }}
                      error={Boolean(errors.comment)}
                      helperText={errors.comment}
                      placeholder="Share your experience and suggestions..."
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={form.isAnonymous}
                          onChange={(e) => setForm({ ...form, isAnonymous: e.target.checked })}
                          color="warning"
                        />
                      }
                      label="Submit Anonymously"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      size="large"
                      disabled={submitLoad}
                    >
                      {submitLoad ? 'Submitting...' : 'Submit Feedback'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* My Previous Feedbacks */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                My Previous Feedbacks ({myFeedbacks.length})
              </Typography>

              {loading ? (
                <Box textAlign="center" py={4}><CircularProgress /></Box>
              ) : myFeedbacks.length === 0 ? (
                <Typography color="text.secondary" textAlign="center" py={4}>
                  No feedback submitted yet
                </Typography>
              ) : (
                <List disablePadding>
                  {myFeedbacks.map((fb) => (
                    <Box key={fb._id}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Rating value={fb.rating} readOnly size="small" />
                              <Chip
                                label={fb.type}
                                size="small"
                                variant="outlined"
                                sx={{ textTransform: 'capitalize' }}
                              />
                              {fb.isAnonymous && (
                                <Chip label="Anonymous" size="small" />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box>
                              {fb.course && (
                                <Typography variant="caption" color="primary.main" fontWeight={600}>
                                  {fb.course?.name}
                                </Typography>
                              )}
                              <Typography variant="body2" color="text.secondary">
                                {fb.comment}
                              </Typography>
                              <Typography variant="caption" color="text.disabled">
                                {new Date(fb.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      <Divider />
                    </Box>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  )
}

export default Feedback