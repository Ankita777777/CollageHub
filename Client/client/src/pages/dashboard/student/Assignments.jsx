import { useState, useEffect, useRef } from 'react'
import {
  Box, Card, CardContent, Typography, Button, Alert,
  CircularProgress, Chip, Grid, Dialog, DialogTitle,
  DialogContent, DialogActions, LinearProgress
} from '@mui/material'
import AssignmentIcon from '@mui/icons-material/Assignment'
import UploadIcon     from '@mui/icons-material/Upload'
import CheckIcon      from '@mui/icons-material/Check'
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

  const fetchAssignments = async () => {
    setLoading(true)
    try {
      const res = await API.get('/assignments/my')
      setAssignments(res.data)
    } catch (err) {
      console.error('fetchAssignments error:', err.response?.data?.message || err.message)
      setError(err.response?.data?.message || 'Failed to load assignments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAssignments() }, [])

  const getDaysLeft = (dueDate) => {
    const diff = new Date(dueDate) - new Date()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  const handleOpenSubmit = (assignment) => {
    setSelected(assignment)
    setFile(null)
    setError('')
    setOpenSubmit(true)
  }

  const handleSubmit = async () => {
    if (!file) {
      return setError('Please select a file to submit')
    }

    setSubmitLoad(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await API.post(
        `/assignments/${selected._id}/submit`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )

      setSuccess(res.data.message || 'Assignment submitted successfully!')
      setOpenSubmit(false)
      setFile(null)
      fetchAssignments()
      setTimeout(() => setSuccess(''), 5000)
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Try again.')
    } finally {
      setSubmitLoad(false)
    }
  }

  return (
    <Layout role="student">
      <Typography variant="h5" fontWeight={700} mb={3}>My Assignments</Typography>

      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error && !openSubmit && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}

      {loading ? (
        <Box textAlign="center" py={6}><CircularProgress /></Box>
      ) : assignments.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <AssignmentIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography color="text.secondary" mb={1}>
              No assignments yet
            </Typography>
            <Typography variant="caption" color="text.disabled">
              Your teachers will post assignments here
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {assignments.map((a) => {
            const daysLeft  = getDaysLeft(a.dueDate)
            const isOverdue = daysLeft < 0
            const isUrgent  = daysLeft >= 0 && daysLeft <= 2

            const borderColor = isOverdue ? '#C62828' : isUrgent ? '#E65100' : '#1565C0'

            return (
              <Grid item xs={12} sm={6} md={4} key={a._id}>
                <Card sx={{
                  height: '100%',
                  borderTop: `4px solid ${borderColor}`,
                  '&:hover': { boxShadow: 6 },
                  transition: '0.2s',
                }}>
                  <CardContent>
                    {/* Header chips */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                      <Chip
                        label={a.course?.name}
                        size="small"
                        color="primary"
                      />
                      {isOverdue ? (
                        <Chip label="Overdue" size="small" color="error" />
                      ) : daysLeft === 0 ? (
                        <Chip label="Due Today!" size="small" color="error" />
                      ) : isUrgent ? (
                        <Chip label={`${daysLeft}d left!`} size="small" color="warning" />
                      ) : (
                        <Chip label={`${daysLeft} days left`} size="small" />
                      )}
                    </Box>

                    {/* Title */}
                    <Typography variant="subtitle1" fontWeight={700} mb={1}>
                      {a.title}
                    </Typography>

                    {/* Description */}
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {a.description}
                    </Typography>

                    {/* Details */}
                    <Box sx={{ mb: 2, p: 1.5, bgcolor: '#f5f7fa', borderRadius: 2 }}>
                      <Typography variant="caption" display="block" color="text.secondary">
                        📅 Due: <strong>{new Date(a.dueDate).toLocaleDateString()}</strong>
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        📊 Total Marks: <strong>{a.totalMarks}</strong>
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        👨‍🏫 Teacher: <strong>{a.teacher?.user?.name || 'N/A'}</strong>
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        📝 Course: <strong>{a.course?.code}</strong>
                      </Typography>
                    </Box>

                    {/* Download button */}
                    {a.file && (
                      <Button
                        variant="outlined"
                        size="small"
                        fullWidth
                        href={a.file}
                        target="_blank"
                        sx={{ mb: 1 }}
                      >
                        📄 Download Assignment File
                      </Button>
                    )}

                    {/* Submit button */}
                    <Button
                      variant="contained"
                      size="small"
                      fullWidth
                      startIcon={<UploadIcon />}
                      disabled={isOverdue}
                      onClick={() => handleOpenSubmit(a)}
                      sx={{ bgcolor: borderColor, '&:hover': { bgcolor: borderColor } }}
                    >
                      {isOverdue ? '⏰ Overdue' : 'Submit Assignment'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      )}

      {/* Submit Dialog */}
      <Dialog
        open={openSubmit}
        onClose={() => { setOpenSubmit(false); setFile(null); setError('') }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle fontWeight={700}>
          Submit Assignment
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f7fa', borderRadius: 2 }}>
            <Typography variant="body2" fontWeight={600}>{selected?.title}</Typography>
            <Typography variant="caption" color="text.secondary">
              Due: {selected && new Date(selected.dueDate).toLocaleDateString()}
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {/* File Upload Area */}
          <Box
            onClick={() => fileRef.current?.click()}
            sx={{
              border: '2px dashed',
              borderColor: file ? 'success.main' : 'grey.400',
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              bgcolor: file ? '#f0f7f0' : '#fafafa',
              transition: '0.2s',
              '&:hover': { borderColor: 'primary.main', bgcolor: '#f0f4ff' },
            }}
          >
            <input
              ref={fileRef}
              type="file"
              style={{ display: 'none' }}
              onChange={(e) => {
                const f = e.target.files[0]
                if (f) {
                  setFile(f)
                  setError('')
                }
              }}
            />
            {file ? (
              <Box>
                <CheckIcon sx={{ fontSize: 36, color: 'success.main', mb: 1 }} />
                <Typography variant="body2" color="success.main" fontWeight={600}>
                  {file.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {(file.size / 1024).toFixed(1)} KB — Click to change
                </Typography>
              </Box>
            ) : (
              <Box>
                <UploadIcon sx={{ fontSize: 36, color: 'text.disabled', mb: 1 }} />
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  Click to select your file
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  PDF, DOC, DOCX, ZIP or any format
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => { setOpenSubmit(false); setFile(null); setError('') }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!file || submitLoad}
            startIcon={submitLoad ? <CircularProgress size={16} color="inherit" /> : <UploadIcon />}
          >
            {submitLoad ? 'Submitting...' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  )
}

export default Assignments