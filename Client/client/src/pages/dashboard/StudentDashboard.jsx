import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProfile, fetchAttendance, fetchResults, fetchFeeStatus } from '../../features/student/studentSlice'
import { fetchNotices } from '../../features/notice/noticeSlice'
import {
  Box, Grid, Card, CardContent, Typography,
  LinearProgress, Table, TableHead, TableRow,
  TableCell, TableBody, Chip
} from '@mui/material'
import EventNoteIcon from '@mui/icons-material/EventNote'
import AssignmentIcon from '@mui/icons-material/Assignment'
import PaymentIcon from '@mui/icons-material/Payment'
import PersonIcon from '@mui/icons-material/Person'
import Sidebar from '../../components/Sidebar'
import NoticeCard from '../../components/NoticeCard'

const StudentDashboard = () => {
  const dispatch = useDispatch()
  const { profile, attendance, results, fee } = useSelector((state) => state.student)
  const { notices } = useSelector((state) => state.notice)

  useEffect(() => {
    dispatch(fetchProfile())
    dispatch(fetchAttendance())
    dispatch(fetchResults())
    dispatch(fetchFeeStatus())
    dispatch(fetchNotices({}))
  }, [dispatch])

  const statCards = [
    { label: 'Program',    value: profile?.program || '-',     icon: <PersonIcon />,     color: '#1565C0' },
    { label: 'Semester',   value: profile?.semester || '-',    icon: <AssignmentIcon />, color: '#2E7D32' },
    { label: 'Fee Status', value: fee?.feeStatus || '-',       icon: <PaymentIcon />,    color: '#E65100' },
    { label: 'Roll No',    value: profile?.rollNo || '-',      icon: <EventNoteIcon />,  color: '#6A1B9A' },
  ]

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar role="student" />
      <Box sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
        <Typography variant="h5" fontWeight={700} mb={1}>
          Welcome, {profile?.user?.name || 'Student'} 👋
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          {new Date().toDateString()}
        </Typography>

        {/* Stats */}
        <Grid container spacing={3} mb={4}>
          {statCards.map((s) => (
            <Grid item xs={12} sm={6} md={3} key={s.label}>
              <Card>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ bgcolor: s.color + '20', p: 1.5, borderRadius: 2, color: s.color }}>
                    {s.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={700}>{s.value}</Typography>
                    <Typography variant="body2" color="text.secondary">{s.label}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* Attendance */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>Attendance</Typography>
                {attendance.summary?.map((s) => (
                  <Box key={s.course._id} mb={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">{s.course.name}</Typography>
                      <Typography variant="body2" fontWeight={600}
                        color={s.percentage < 75 ? 'error.main' : 'success.main'}>
                        {s.percentage}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Number(s.percentage)}
                      color={s.percentage < 75 ? 'error' : 'success'}
                      sx={{ borderRadius: 2, height: 8 }}
                    />
                  </Box>
                ))}
                {!attendance.summary?.length && (
                  <Typography variant="body2" color="text.secondary">No attendance records yet.</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Results */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>Results</Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Subject</TableCell>
                      <TableCell>Marks</TableCell>
                      <TableCell>Grade</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {results.map((r) => (
                      <TableRow key={r._id}>
                        <TableCell>{r.course?.name}</TableCell>
                        <TableCell>{r.marks}</TableCell>
                        <TableCell>{r.grade}</TableCell>
                        <TableCell>
                          <Chip
                            label={r.status}
                            size="small"
                            color={r.status === 'pass' ? 'success' : 'error'}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {!results.length && (
                  <Typography variant="body2" color="text.secondary" mt={1}>No results published yet.</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Notices */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>Latest Notices</Typography>
                {notices.slice(0, 3).map((n) => (
                  <NoticeCard key={n._id} notice={n} />
                ))}
                {!notices.length && (
                  <Typography variant="body2" color="text.secondary">No notices available.</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default StudentDashboard