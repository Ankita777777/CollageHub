import { useState, useEffect, useRef } from 'react'
import {
  Box, Card, CardContent, Typography, Button, Alert,
  CircularProgress, Chip, Grid, Dialog, DialogTitle,
  DialogContent, DialogActions, LinearProgress
} from '@mui/material'
import AssignmentIcon from '@mui/icons-material/Assignment'
import UploadIcon     from '@mui/icons-material/Upload'
import API    from '../../../api/axios'
import Layout from '../../../components/Layout'

const Assignments = () => {
  const fileRef        = useRef()
  const [assignments,  setAssignments]  = useState([])
  const [loading,      setLoading]      = useState(true)
  const [selected,     setSelected]     = useState(null)
  const [file,         setFile]         = useState(null)
  const [success,      setSuccess]      = useState('')
  const [error,        setError]        = useState('')
  const [submitLoad,   setSubmitLoad]   = useState(false)
  const [openSubmit,   setOpenSubmit]   = useState(false)

  useEffect(() => {
    API.get('/assignments/my')
      .then((res) => setAssignments(res.data))
      .catch(() => setError('Failed to load assignments'))
      .finally(() => setLoading(false))
  }, [])

  const getDaysLeft = (dueDate) => {
    const diff = new Date(dueDate) - new Date()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return days
  }

  const handleSubmit = async () => {
    if (!file) return setError('Please select a file to submit')
    setSubmitLoad(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      await API.post(`/assignments/${selected._id}/submit`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setSuccess('Assignment submitted successfully!')
      setOpenSubmit(false)
      setFile(null)
      // Refresh
      const res = await API.get('/assignments/my')
      setAssignments(res.data)
      setTimeout(() => setSuccess(''), 4000)
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed')
    } finally {
      setSubmitLoad(false)
    }
  }

  return (
    <Layout role="student">
      <Typography variant="h5" fontWeight={700} mb={3}>My Assignments</Typography>

      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error   && <Alert severity="error"   sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box textAlign="center" py={6}><CircularProgress /></Box>
      ) : assignments.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <AssignmentIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography color="text.secondary">No assignments yet</Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {assignments.map((a) => {
            const daysLeft   = getDaysLeft(a.dueDate)
            const isOverdue  = daysLeft < 0
            const isUrgent   = daysLeft >= 0 && daysLeft <= 2

            return (
              <Grid item xs={12} sm={6} md={4} key={a._id}>
                <Card sx={{
                  borderTop: `4px solid ${isOverdue ? '#C62828' : isUrgent ? '#E65100' : '#1565C0'}`,
                  height: '100%',
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Chip
                        label={a.course?.name}
                        size="small"
                        color="primary"
                      />
                      {isOverdue ? (
                        <Chip label="Overdue" size="small" color="error" />
                      ) : (
                        <Chip
                          label={`${daysLeft}d left`}
                          size="small"
                          color={isUrgent ? 'warning' : 'default'}
                        />
                      )}
                    </Box>

                    <Typography variant="subtitle1" fontWeight={700} mb={1}>
                      {a.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {a.description}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Due: <strong>{new Date(a.dueDate).toLocaleDateString()}</strong>
                      </Typography>
                      <br />
                      <Typography variant="caption" color="text.secondary">
                        Total Marks: <strong>{a.totalMarks}</strong>
                      </Typography>
                      <br />
                      <Typography variant="caption" color="text.secondary">
                        Teacher: <strong>{a.teacher?.user?.name}</strong>
                      </Typography>
                    </Box>

                    {a.file && (
                      <Button
                        variant="outlined"
                        size="small"
                        fullWidth
                        href={a.file}
                        target="_blank"
                        sx={{ mb: 1 }}
                      >
                        📄 Download Assignment
                      </Button>
                    )}

                    <Button
                      variant="contained"
                      size="small"
                      fullWidth
                      startIcon={<UploadIcon />}
                      disabled={isOverdue}
                      onClick={() => { setSelected(a); setError(''); setFile(null); setOpenSubmit(true) }}
                    >
                      {isOverdue ? 'Overdue' : 'Submit'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      )}

      {/* Submit Dialog */}
      <Dialog open={openSubmit} onClose={() => setOpenSubmit(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700}>Submit Assignment</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            {selected?.title} — Due: {new Date(selected?.dueDate).toLocaleDateString()}
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box
            sx={{
              border: '2px dashed',
              borderColor: file ? 'success.main' : '#ccc',
              borderRadius: 2, p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              bgcolor: file ? '#f0f7f0' : '#fafafa',
            }}
            onClick={() => fileRef.current?.click()}
          >
            <input
              ref={fileRef}
              type="file"
              style={{ display: 'none' }}
              onChange={(e) => { setFile(e.target.files[0]); setError('') }}
            />
            {file ? (
              <Typography variant="body2" color="success.main" fontWeight={600}>
                ✅ {file.name}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Click to select your assignment file
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSubmit(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!file || submitLoad}
          >
            {submitLoad ? <CircularProgress size={20} color="inherit" /> : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  )
}

export default Assignments