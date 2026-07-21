import { useState, useEffect } from 'react'
import {
  Box, Card, CardContent, Typography, Grid, Chip,
  CircularProgress, Alert, Button, Dialog,
  DialogTitle, DialogContent, DialogActions,
  TextField, Tabs, Tab
} from '@mui/material'
import SchoolIcon         from '@mui/icons-material/School'
import EmojiEventsIcon    from '@mui/icons-material/EmojiEvents'
import API    from '../../../api/axios'
import Layout from '../../../components/Layout'

const Scholarships = () => {
  const [scholarships, setScholarships] = useState([])
  const [myApps,       setMyApps]       = useState([])
  const [loading,      setLoading]      = useState(true)
  const [selected,     setSelected]     = useState(null)
  const [reason,       setReason]       = useState('')
  const [open,         setOpen]         = useState(false)
  const [success,      setSuccess]      = useState('')
  const [error,        setError]        = useState('')
  const [reasonErr,    setReasonErr]    = useState('')
  const [tab,          setTab]          = useState(0)
  const [applyLoad,    setApplyLoad]    = useState(false)

  const fetchAll = async () => {
    try {
      const [sRes, mRes] = await Promise.all([
        API.get('/scholarships'),
        API.get('/scholarships/my'),
      ])
      setScholarships(sRes.data)
      setMyApps(mRes.data)
    } catch (err) {
      setError('Failed to load scholarships')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const handleApply = async () => {
    setReasonErr('')
    if (!reason.trim() || reason.trim().length < 10) {
      return setReasonErr('Reason must be at least 10 characters')
    }
    setApplyLoad(true)
    try {
      await API.post(`/scholarships/${selected._id}/apply`, { reason })
      setSuccess('Application submitted!')
      setOpen(false)
      setReason('')
      fetchAll()
      setTimeout(() => setSuccess(''), 4000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed')
    } finally {
      setApplyLoad(false)
    }
  }

  const isApplied = (id) => myApps.some((a) => a.scholarship?._id === id)

  const statusColors = { pending: 'warning', approved: 'success', rejected: 'error' }

  return (
    <Layout role="student">
      <Typography variant="h5" fontWeight={700} mb={3}>Scholarships</Typography>

      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error   && <Alert severity="error"   sx={{ mb: 2 }}>{error}</Alert>}

      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Available Scholarships" />
        <Tab label={`My Applications (${myApps.length})`} />
      </Tabs>

      {loading ? (
        <Box textAlign="center" py={6}><CircularProgress /></Box>
      ) : tab === 0 ? (
        <Grid container spacing={3}>
          {scholarships.map((s) => {
            const applied   = isApplied(s._id)
            const isExpired = s.deadline && new Date(s.deadline) < new Date()

            return (
              <Grid item xs={12} sm={6} md={4} key={s._id}>
                <Card sx={{
                  height: '100%',
                  borderTop: '4px solid #6A1B9A',
                  '&:hover': { boxShadow: 6 },
                  transition: '0.2s',
                  opacity: isExpired ? 0.6 : 1,
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <EmojiEventsIcon sx={{ color: '#6A1B9A', fontSize: 32 }} />
                      <Typography variant="subtitle1" fontWeight={700}>{s.name}</Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {s.description}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      {s.amount && (
                        <Typography variant="body2" mb={0.5}>
                          💰 Amount: <strong>Rs. {s.amount}</strong>
                        </Typography>
                      )}
                      {s.percentage && (
                        <Typography variant="body2" mb={0.5}>
                          📊 Fee Discount: <strong>{s.percentage}%</strong>
                        </Typography>
                      )}
                      {s.criteria && (
                        <Typography variant="body2" mb={0.5}>
                          📋 Criteria: <strong>{s.criteria}</strong>
                        </Typography>
                      )}
                      {s.deadline && (
                        <Typography variant="body2"
                          sx={{ color: isExpired ? 'error.main' : 'inherit' }}
                        >
                          📅 Deadline: <strong>{new Date(s.deadline).toLocaleDateString()}</strong>
                        </Typography>
                      )}
                    </Box>

                    {applied ? (
                      <Chip label="Applied" color="success" fullWidth sx={{ width: '100%' }} />
                    ) : isExpired ? (
                      <Chip label="Deadline Passed" color="error" fullWidth sx={{ width: '100%' }} />
                    ) : (
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => { setSelected(s); setReason(''); setReasonErr(''); setOpen(true) }}
                        sx={{ bgcolor: '#6A1B9A', '&:hover': { bgcolor: '#4A148C' } }}
                      >
                        Apply Now
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
          {scholarships.length === 0 && (
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 6 }}>
                  <SchoolIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                  <Typography color="text.secondary">No scholarships available</Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      ) : (
        <Grid container spacing={3}>
          {myApps.map((item, i) => (
            <Grid item xs={12} sm={6} key={i}>
              <Card sx={{ borderLeft: '4px solid #6A1B9A' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {item.scholarship?.name}
                    </Typography>
                    <Chip
                      label={item.application?.status}
                      size="small"
                      color={statusColors[item.application?.status] || 'default'}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    {item.scholarship?.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Applied: {new Date(item.application?.appliedAt).toLocaleDateString()}
                  </Typography>
                  {item.application?.response && (
                    <Box sx={{ mt: 1, p: 1.5, bgcolor: '#f0f7f0', borderRadius: 2 }}>
                      <Typography variant="caption" color="success.main" fontWeight={700}>
                        Admin Response:
                      </Typography>
                      <Typography variant="body2">{item.application.response}</Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
          {myApps.length === 0 && (
            <Grid item xs={12}>
              <Typography textAlign="center" color="text.secondary" py={4}>
                No applications yet
              </Typography>
            </Grid>
          )}
        </Grid>
      )}

      {/* Apply Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>Apply for {selected?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ bgcolor: '#f5f7fa', p: 2, borderRadius: 2, mb: 2 }}>
            {selected?.amount && (
              <Typography variant="body2">Amount: Rs. {selected.amount}</Typography>
            )}
            {selected?.criteria && (
              <Typography variant="body2">Criteria: {selected.criteria}</Typography>
            )}
          </Box>
          <TextField
            label="Why do you deserve this scholarship? *"
            fullWidth multiline rows={4}
            value={reason}
            onChange={(e) => { setReason(e.target.value); setReasonErr('') }}
            error={Boolean(reasonErr)}
            helperText={reasonErr}
            placeholder="Explain your financial situation, academic performance, and why you need this scholarship..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleApply} disabled={applyLoad}
            sx={{ bgcolor: '#6A1B9A' }}>
            {applyLoad ? 'Submitting...' : 'Submit Application'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  )
}

export default Scholarships