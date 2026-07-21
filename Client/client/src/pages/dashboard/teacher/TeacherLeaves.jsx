import { useEffect, useState } from 'react'
import {
  Box, Card, CardContent, Typography, Table, TableHead,
  TableRow, TableCell, TableBody, Chip, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Alert, CircularProgress, Avatar
} from '@mui/material'
import API    from '../../../api/axios'
import Layout from '../../../components/Layout'

const TeacherLeaves = () => {
  const [leaves,     setLeaves]     = useState([])
  const [loading,    setLoading]    = useState(true)
  const [success,    setSuccess]    = useState('')
  const [open,       setOpen]       = useState(false)
  const [selected,   setSelected]   = useState(null)
  const [reviewNote, setReviewNote] = useState('')
  const [action,     setAction]     = useState('')
  const [error,      setError]      = useState('')
  const [noteError,  setNoteError]  = useState('')

  const fetchLeaves = async () => {
    setLoading(true)
    try {
      const res = await API.get('/teachers/leaves')
      setLeaves(res.data)
    } catch (err) {
      setError('Failed to load leaves')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchLeaves() }, [])

  const openDialog = (leave, act) => {
    setSelected(leave)
    setAction(act)
    setReviewNote('')
    setNoteError('')
    setOpen(true)
  }

  const handleReview = async () => {
    setNoteError('')
    if (action === 'rejected' && !reviewNote.trim()) {
      return setNoteError('Please provide a reason for rejection')
    }
    try {
      await API.put(`/teachers/leaves/${selected._id}`, {
        status:     action,
        reviewNote: reviewNote.trim(),
      })
      setSuccess(`Leave ${action} successfully!`)
      setOpen(false)
      fetchLeaves()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to review leave')
    }
  }

  const getDays = (from, to) => {
    const diff = new Date(to) - new Date(from)
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1
  }

  return (
    <Layout role="teacher">
      <Typography variant="h5" fontWeight={700} mb={3}>
        Leave Requests
        {leaves.length > 0 && (
          <Chip label={leaves.length} size="small" color="warning" sx={{ ml: 1 }} />
        )}
      </Typography>

      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error   && <Alert severity="error"   sx={{ mb: 2 }}>{error}</Alert>}

      <Card>
        <CardContent>
          {loading ? (
            <Box textAlign="center" py={4}><CircularProgress /></Box>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                  <TableCell><strong>Student</strong></TableCell>
                  <TableCell><strong>From</strong></TableCell>
                  <TableCell><strong>To</strong></TableCell>
                  <TableCell><strong>Days</strong></TableCell>
                  <TableCell><strong>Reason</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaves.map((l) => (
                  <TableRow key={l._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 30, height: 30, fontSize: 12, bgcolor: 'primary.main' }}>
                          {l.student?.user?.name?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {l.student?.user?.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {l.student?.rollNo}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{new Date(l.fromDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(l.toDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip label={`${getDays(l.fromDate, l.toDate)} days`} size="small" />
                    </TableCell>
                    <TableCell sx={{ maxWidth: 200 }}>
                      <Typography variant="body2" noWrap>{l.reason}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={l.status}
                        size="small"
                        color={l.status === 'approved' ? 'success' : l.status === 'rejected' ? 'error' : 'warning'}
                      />
                    </TableCell>
                    <TableCell>
                      {l.status === 'pending' && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button size="small" variant="contained" color="success"
                            onClick={() => openDialog(l, 'approved')}>
                            Approve
                          </Button>
                          <Button size="small" variant="outlined" color="error"
                            onClick={() => openDialog(l, 'rejected')}>
                            Reject
                          </Button>
                        </Box>
                      )}
                      {l.status !== 'pending' && l.reviewNote && (
                        <Typography variant="caption" color="text.secondary">
                          Note: {l.reviewNote}
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {leaves.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                      No leave requests
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700} sx={{ textTransform: 'capitalize' }}>
          {action} Leave Request
        </DialogTitle>
        <DialogContent>
          {selected && (
            <Box sx={{ bgcolor: '#f5f7fa', p: 2, borderRadius: 2, mb: 2 }}>
              <Typography variant="body2">
                <strong>Student:</strong> {selected.student?.user?.name}
              </Typography>
              <Typography variant="body2">
                <strong>Period:</strong>{' '}
                {new Date(selected.fromDate).toLocaleDateString()} →{' '}
                {new Date(selected.toDate).toLocaleDateString()}
                {' '}({getDays(selected.fromDate, selected.toDate)} days)
              </Typography>
              <Typography variant="body2">
                <strong>Reason:</strong> {selected.reason}
              </Typography>
            </Box>
          )}
          <TextField
            label={action === 'rejected' ? 'Reason for rejection *' : 'Note (optional)'}
            fullWidth multiline rows={3}
            value={reviewNote}
            onChange={(e) => { setReviewNote(e.target.value); setNoteError('') }}
            error={Boolean(noteError)}
            helperText={noteError}
            placeholder={
              action === 'rejected'
                ? 'e.g. Insufficient reason provided...'
                : 'e.g. Approved. Please submit catch-up work...'
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color={action === 'approved' ? 'success' : 'error'}
            onClick={handleReview}
          >
            Confirm {action}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  )
}

export default TeacherLeaves