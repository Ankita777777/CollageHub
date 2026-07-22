import { useState, useEffect } from 'react'
import {
  Box, Card, CardContent, Typography, TextField,
  Button, Alert, Grid, MenuItem, CircularProgress,
  Rating, Chip, List, ListItem, ListItemText,
  FormControlLabel, Switch, Divider, Select,
  FormControl, InputLabel, FormHelperText
} from '@mui/material'
import StarIcon    from '@mui/icons-material/Star'
import FeedbackIcon from '@mui/icons-material/Feedback'
import API    from '../../../api/axios'
import Layout from '../../../components/Layout'

const feedbackTypes = [
  { value: 'general',  label: 'General Feedback' },
  { value: 'course',   label: 'Course Feedback'  },
  { value: 'teacher',  label: 'Teacher Feedback' },
  { value: 'facility', label: 'Facility Feedback' },
]

const ratingLabels = {
  1: '⭐ Poor',
  2: '⭐⭐ Fair',
  3: '⭐⭐⭐ Good',
  4: '⭐⭐⭐⭐ Very Good',
  5: '⭐⭐⭐⭐⭐ Excellent',
}

const Feedback = () => {
  const [myFeedbacks, setMyFeedbacks] = useState([])
  const [courses,     setCourses]     = useState([])
  const [loading,     setLoading]     = useState(true)
  const [success,     setSuccess]     = useState('')
  const [errors,      setErrors]      = useState({})
  const [submitLoad,  setSubmitLoad]  = useState(false)
  const [form, setForm] = useState({
    type:        'general',
    courseId:    '',
    rating:      0,
    comment:     '',
    isAnonymous: false,
  })

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [fRes, cRes] = await Promise.all([
        API.get('/feedback/my'),
        API.get('/admin/courses'),
      ])
      setMyFeedbacks(fRes.data)
      setCourses(cRes.data)
    } catch (err) {
      console.error('fetchAll error:', err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const validate = () => {
    const errs = {}
    if (!form.rating || form.rating === 0) {
      errs.rating = 'Please select a rating'
    }
    if (!form.comment.trim() || form.comment.trim().length < 5) {
      errs.comment = 'Comment must be at least 5 characters'
    }
    if (form.type === 'course' && !form.courseId) {
      errs.courseId = 'Please select a course'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const resetForm = () => {
    setForm({ type: 'general', courseId: '', rating: 0, comment: '', isAnonymous: false })
    setErrors({})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitLoad(true)
    setErrors({})

    try {
      const payload = {
        type:        form.type,
        rating:      form.rating,
        comment:     form.comment.trim(),
        isAnonymous: form.isAnonymous,
      }

      // Only add courseId if type is course and courseId is set
      if (form.type === 'course' && form.courseId) {
        payload.courseId = form.courseId
      }

      await API.post('/feedback', payload)

      setSuccess('Feedback submitted successfully! Thank you.')
      resetForm()
      fetchAll()
      setTimeout(() => setSuccess(''), 5000)
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit feedback'
      setErrors({ submit: msg })
    } finally {
      setSubmitLoad(false)
    }
  }

  return (
    <Layout role="student">
      <Typography variant="h5" fontWeight={700} mb={3}>Feedback</Typography>

      <Grid container spacing={3}>
        {/* Submit Form */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <FeedbackIcon color="primary" />
                <Typography variant="h6" fontWeight={600}>Give Feedback</Typography>
              </Box>

              {errors.submit && (
                <Alert severity="error" sx={{ mb: 2 }}>{errors.submit}</Alert>
              )}
              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  {/* Feedback Type */}
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Feedback Type</InputLabel>
                      <Select
                        value={form.type}
                        label="Feedback Type"
                        onChange={(e) => setForm({ ...form, type: e.target.value, courseId: '' })}
                      >
                        {feedbackTypes.map((t) => (
                          <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Course selector — only for course type */}
                  {form.type === 'course' && (
                    <Grid item xs={12}>
                      <FormControl fullWidth error={Boolean(errors.courseId)}>
                        <InputLabel>Select Course *</InputLabel>
                        <Select
                          value={form.courseId}
                          label="Select Course *"
                          onChange={(e) => {
                            setForm({ ...form, courseId: e.target.value })
                            setErrors({ ...errors, courseId: '' })
                          }}
                        >
                          {courses.length === 0 ? (
                            <MenuItem disabled>No courses available</MenuItem>
                          ) : (
                            courses.map((c) => (
                              <MenuItem key={c._id} value={c._id}>
                                {c.name} ({c.code})
                              </MenuItem>
                            ))
                          )}
                        </Select>
                        {errors.courseId && (
                          <FormHelperText>{errors.courseId}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  )}

                  {/* Rating */}
                  <Grid item xs={12}>
                    <Typography variant="body2" fontWeight={600} mb={1}>
                      Rating *
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Rating
                        value={form.rating}
                        onChange={(e, val) => {
                          setForm({ ...form, rating: val || 0 })
                          setErrors({ ...errors, rating: '' })
                        }}
                        size="large"
                        emptyIcon={<StarIcon style={{ opacity: 0.3 }} fontSize="inherit" />}
                      />
                      {form.rating > 0 && (
                        <Typography variant="body2" color="text.secondary">
                          {ratingLabels[form.rating]}
                        </Typography>
                      )}
                    </Box>
                    {errors.rating && (
                      <Typography variant="caption" color="error">
                        {errors.rating}
                      </Typography>
                    )}
                  </Grid>

                  {/* Comment */}
                  <Grid item xs={12}>
                    <TextField
                      label="Your Comment *"
                      fullWidth
                      multiline
                      rows={4}
                      value={form.comment}
                      onChange={(e) => {
                        setForm({ ...form, comment: e.target.value })
                        setErrors({ ...errors, comment: '' })
                      }}
                      error={Boolean(errors.comment)}
                      helperText={errors.comment || 'Share your experience and suggestions...'}
                    />
                  </Grid>

                  {/* Anonymous */}
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={form.isAnonymous}
                          onChange={(e) => setForm({ ...form, isAnonymous: e.target.checked })}
                          color="warning"
                        />
                      }
                      label={
                        <Typography variant="body2">
                          Submit Anonymously
                        </Typography>
                      }
                    />
                  </Grid>

                  {/* Submit */}
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      size="large"
                      disabled={submitLoad}
                    >
                      {submitLoad
                        ? <CircularProgress size={22} color="inherit" />
                        : 'Submit Feedback'
                      }
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Previous Feedbacks */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                My Previous Feedbacks ({myFeedbacks.length})
              </Typography>

              {loading ? (
                <Box textAlign="center" py={4}><CircularProgress /></Box>
              ) : myFeedbacks.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <FeedbackIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                  <Typography color="text.secondary">
                    No feedback submitted yet
                  </Typography>
                </Box>
              ) : (
                <List disablePadding>
                  {myFeedbacks.map((fb, i) => (
                    <Box key={fb._id}>
                      <Box sx={{ py: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
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
                        {fb.course && (
                          <Typography variant="caption" color="primary.main" fontWeight={600}>
                            {fb.course.name}
                          </Typography>
                        )}
                        <Typography variant="body2" color="text.secondary" mt={0.5}>
                          {fb.comment}
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                          {new Date(fb.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                      {i < myFeedbacks.length - 1 && <Divider />}
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