import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchResults } from '../../../features/student/studentSlice'
import {
  Box, Card, CardContent, Typography, Table, TableHead,
  TableRow, TableCell, TableBody, Chip, CircularProgress,
  Alert, Grid, Divider
} from '@mui/material'
import Layout from '../../../components/Layout'

const gradeColor = (grade) => {
  if (['A+', 'A'].includes(grade)) return 'success'
  if (['B+', 'B'].includes(grade)) return 'primary'
  if (['C', 'D'].includes(grade))  return 'warning'
  return 'error'
}

const Results = () => {
  const dispatch = useDispatch()
  const { results, loading, error } = useSelector((state) => state.student)

  useEffect(() => { dispatch(fetchResults()) }, [dispatch])

  const passed  = results.filter(r => r.status === 'pass').length
  const failed  = results.filter(r => r.status === 'fail').length
  const avgMarks = results.length
    ? (results.reduce((s, r) => s + (r.marks || 0), 0) / results.length).toFixed(1)
    : 0

  const bySemester = results.reduce((acc, r) => {
    const key = `Semester ${r.semester}`
    if (!acc[key]) acc[key] = []
    acc[key].push(r)
    return acc
  }, {})

  return (
    <Layout role="student">
      <Typography variant="h5" fontWeight={700} mb={3}>My Results</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box textAlign="center" py={6}><CircularProgress /></Box>
      ) : (
        <>
          {/* Summary */}
          <Grid container spacing={2} mb={3}>
            {[
              { label: 'Total Subjects', value: results.length,   color: '#1565C0' },
              { label: 'Passed',         value: passed,           color: '#2E7D32' },
              { label: 'Failed',         value: failed,           color: '#C62828' },
              { label: 'Average Marks',  value: avgMarks + '%',   color: '#E65100' },
            ].map((s) => (
              <Grid item xs={6} sm={3} key={s.label}>
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="h4" fontWeight={800} sx={{ color: s.color }}>
                      {s.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* By semester */}
          {Object.keys(bySemester).length === 0 ? (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">No results published yet</Typography>
              </CardContent>
            </Card>
          ) : (
            Object.entries(bySemester).map(([sem, semResults]) => (
              <Card key={sem} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={700} color="primary.main" mb={2}>
                    {sem}
                  </Typography>
                  <Box sx={{ overflowX: 'auto' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Subject</strong></TableCell>
                          <TableCell><strong>Code</strong></TableCell>
                          <TableCell><strong>Credits</strong></TableCell>
                          <TableCell align="center"><strong>Marks</strong></TableCell>
                          <TableCell align="center"><strong>Grade</strong></TableCell>
                          <TableCell align="center"><strong>Status</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {semResults.map((r) => (
                          <TableRow key={r._id} hover
                            sx={{ bgcolor: r.status === 'fail' ? '#fff3f3' : 'inherit' }}
                          >
                            <TableCell>{r.course?.name}</TableCell>
                            <TableCell>
                              <Chip label={r.course?.code} size="small" variant="outlined" />
                            </TableCell>
                            <TableCell>{r.course?.creditHours}</TableCell>
                            <TableCell align="center">
                              <Typography fontWeight={700}>{r.marks}/100</Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Chip label={r.grade} size="small" color={gradeColor(r.grade)} />
                            </TableCell>
                            <TableCell align="center">
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
                  </Box>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    Semester Average:{' '}
                    <strong>
                      {(semResults.reduce((s, r) => s + (r.marks || 0), 0) / semResults.length).toFixed(1)}
                    </strong>
                  </Typography>
                </CardContent>
              </Card>
            ))
          )}
        </>
      )}
    </Layout>
  )
}

export default Results