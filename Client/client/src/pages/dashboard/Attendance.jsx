import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAttendance } from '../../../features/student/studentSlice'
import {
  Box, Card, CardContent, Typography, LinearProgress,
  Table, TableHead, TableRow, TableCell, TableBody,
  Chip, CircularProgress, Alert
} from '@mui/material'
import Layout from '../../../components/Layout'

const Attendance = () => {
  const dispatch = useDispatch()
  const { attendance, loading } = useSelector((state) => state.student)

  useEffect(() => {
    dispatch(fetchAttendance())
  }, [dispatch])

  return (
    <Layout role="student">
      <Typography variant="h5" fontWeight={700} mb={3}>My Attendance</Typography>

      {loading ? (
        <Box textAlign="center" py={6}><CircularProgress /></Box>
      ) : (
        <>
          {/* Summary Cards */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
            {attendance.summary?.map((s) => (
              <Card key={s.course._id} sx={{ minWidth: 220, flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600} mb={1}>
                    {s.course.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                    {s.course.code}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">
                      {s.present} / {s.total} classes
                    </Typography>
                    <Typography
                      variant="body2" fontWeight={700}
                      color={s.percentage < 75 ? 'error.main' : 'success.main'}
                    >
                      {s.percentage}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Number(s.percentage)}
                    color={s.percentage < 75 ? 'error' : 'success'}
                    sx={{ borderRadius: 2, height: 8 }}
                  />
                  {s.percentage < 75 && (
                    <Alert severity="warning" sx={{ mt: 1, py: 0, fontSize: 12 }}>
                      Below 75% attendance!
                    </Alert>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Detailed Table */}
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Detailed Records
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Subject</strong></TableCell>
                    <TableCell><strong>Date</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendance.records?.map((r) => (
                    <TableRow key={r._id}>
                      <TableCell>{r.course?.name}</TableCell>
                      <TableCell>
                        {new Date(r.date).toLocaleDateString('en-NP')}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={r.status}
                          size="small"
                          color={
                            r.status === 'present' ? 'success' :
                            r.status === 'absent'  ? 'error'   : 'warning'
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {!attendance.records?.length && (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                        No records found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </Layout>
  )
}

export default Attendance