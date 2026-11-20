import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAttendance } from '../../../features/student/studentSlice'
import {
  Box, Card, CardContent, Typography, LinearProgress,
  Table, TableHead, TableRow, TableCell, TableBody,
  Chip, CircularProgress, Alert, Grid
} from '@mui/material'
import Layout from '../../../components/Layout'

const Attendance = () => {
  const dispatch = useDispatch()
  const { attendance, loading, error } = useSelector((state) => state.student)

  useEffect(() => { dispatch(fetchAttendance()) }, [dispatch])

  const overallPct = attendance.summary?.length
    ? (attendance.summary.reduce((s, a) => s + Number(a.percentage), 0) / attendance.summary.length).toFixed(1)
    : 0

  return (
    <Layout role="student">
      <Typography variant="h5" fontWeight={700} mb={3}>My Attendance</Typography>

      {error   && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <Box textAlign="center" py={6}><CircularProgress /></Box>
      ) : (
        <>
          {/* Overall */}
          <Card sx={{ mb: 3, bgcolor: Number(overallPct) >= 75 ? '#f0f7f0' : '#fff3f3', border: '1px solid', borderColor: Number(overallPct) >= 75 ? 'success.light' : 'error.light' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6" fontWeight={700}>Overall Attendance</Typography>
                <Typography variant="h4" fontWeight={800} color={Number(overallPct) >= 75 ? 'success.main' : 'error.main'}>
                  {overallPct}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.min(Number(overallPct), 100)}
                color={Number(overallPct) >= 75 ? 'success' : 'error'}
                sx={{ height: 10, borderRadius: 5 }}
              />
              {Number(overallPct) < 75 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  ⚠️ Your attendance is below 75%. Please attend more classes.
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Subject wise */}
          <Grid container spacing={2} mb={3}>
            {attendance.summary?.map((s) => (
              <Grid item xs={12} sm={6} md={4} key={s.course._id}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" fontWeight={700} mb={0.5} noWrap>
                      {s.course.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                      {s.course.code} | {s.present}/{s.total} classes
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">Attendance</Typography>
                      <Typography variant="caption" fontWeight={700}
                        color={Number(s.percentage) >= 75 ? 'success.main' : 'error.main'}>
                        {s.percentage}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(Number(s.percentage), 100)}
                      color={Number(s.percentage) >= 75 ? 'success' : 'error'}
                      sx={{ borderRadius: 2, height: 6 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
            {!attendance.summary?.length && (
              <Grid item xs={12}>
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary">No attendance records yet</Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>

          {/* Detail table */}
          {attendance.records?.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>Detailed Records</Typography>
                <Box sx={{ overflowX: 'auto' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Subject</strong></TableCell>
                        <TableCell><strong>Date</strong></TableCell>
                        <TableCell><strong>Status</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {attendance.records.slice(0, 20).map((r) => (
                        <TableRow key={r._id} hover>
                          <TableCell>{r.course?.name}</TableCell>
                          <TableCell>{new Date(r.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Chip
                              label={r.status}
                              size="small"
                              color={r.status === 'present' ? 'success' : r.status === 'leave' ? 'warning' : 'error'}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </Layout>
  )
}

export default Attendance