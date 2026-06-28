import { useEffect, useState } from 'react'
import {
  Box, Card, CardContent, Typography, Table, TableHead,
  TableRow, TableCell, TableBody, Chip, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Alert, CircularProgress
} from '@mui/material'
import API from '../../../api/axios'
import Layout from '../../../components/Layout'

const TeacherLeaves = () => {
  const [leaves,  setLeaves]  = useState([])
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState('')
  const [open,    setOpen]    = useState(false)
  const [selected, setSelected] = useState(null)
  const [reviewNote, setReviewNote] = useState('')
  const [action,   setAction]  = useState('')

  const fetchLeaves = async () => {
    setLoading(true)
    const res = await API.get('/teachers/leaves')
    setLeaves(res.data)
    setLoading(false)
  }

  useEffect(() => {
    fetchLeaves()
  }, [])

  const openDialog = (leave, act) => {
    setSelected(leave)
    setAction(act)
    setReviewNote('')
    setOpen(true)
  }

  const handleReview = async () => {
    await API.put(`/teachers/leaves/${selected._id}`, {
      status: action,
      reviewNote,
    })
    setSuccess(`Leave ${action} successfully!`)
    setOpen(false)
    fetchLeaves()
    setTimeout(() => setSuccess(''), 3000)
  }

  return (
    <Layout role="teacher">
      <Typography variant="h5" fontWeight={700} mb={3}>Pending Leave Requests</Typography>

      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Card>
        <CardContent>
          {loading ? (
            <Box textAlign="center" py={4}><CircularProgress /></Box>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Student</strong></TableCell>
                  <TableCell><strong>From</strong></TableCell>
                  <TableCell><strong>To</strong></TableCell>
                  <TableCell><strong>Reason</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Action</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaves.map((l) => (
                  <TableRow key={l._id}>
                    <TableCell>{l.student?.user?.name || 'N/A'}</TableCell>
                    <TableCell>{new Date(l.fromDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(l.toDate).toLocaleDateString()}</TableCell>
                    <TableCell sx={{ maxWidth: 200 }}>{l.reason}</TableCell>
                    <TableCell>
                      <Chip
                        label={l.status}
                        size="small"
                        color={
                          l.status === 'approved' ? 'success' :
                          l.status === 'rejected' ? 'error'   : 'warning'
                        }
                      />
                    </TableCell>
                    <TableCell>
                      {l.status === 'pending' && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small" variant="contained" color="success"
                            onClick={() => openDialog(l, 'approved')}
                          >
                            Approve
                          </Button>
                          <Button
                            size="small" variant="outlined" color="error"
                            onClick={() => openDialog(l, 'rejected')}
                          >
                            Reject
                          </Button>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {!leaves.length && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No pending leave requests
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
        <DialogTitle sx={{ textTransform: 'capitalize' }}>
          {action} Leave Request
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Student: <strong>{selected?.student?.user?.name}</strong> |{' '}
            {new Date(selected?.fromDate).toLocaleDateString()} →{' '}
            {new Date(selected?.toDate).toLocaleDateString()}
          </Typography>
          <TextField
            label="Review Note (optional)" fullWidth multiline rows={3}
            value={reviewNote}
            onChange={(e) => setReviewNote(e.target.value)}
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