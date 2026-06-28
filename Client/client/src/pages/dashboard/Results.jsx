import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchResults } from '../../../features/student/studentSlice'
import {
  Box, Card, CardContent, Typography, Table, TableHead,
  TableRow, TableCell, TableBody, Chip, CircularProgress,
  Grid, Divider
} from '@mui/material'
import Layout from '../../../components/Layout'

const gradeColor = (grade) => {
  if (['A+', 'A'].includes(grade))  return 'success'
  if (['B+', 'B'].includes(grade))  return 'primary'
  if (['C', 'D'].includes(grade))   return 'warning'
  return 'error'
}

const Results = () => {
  const dispatch = useDispatch()
  const { results, loading } = useSelector((state) => state.student)

  useEffect(() => {
    dispatch(fetchResults())
  }, [dispatch])

  // Group by semester
  const bySemester = results.reduce((acc, r) => {
    const key = `Semester ${r.semester}`
    if (!acc[key]) acc[key] = []
    acc[key].push(r)
    return acc
  }, {})

  // Calculate GPA
  const totalMarks   = results.reduce((sum, r) => sum + (r.marks || 0), 0)
  const avgMarks     = results.length ? (totalMarks / results.length).toFixed(1) : 0
  const passedCount  = results.filter((r) => r.status === 'pass').length

  return (
    <Layout role="student">
      <Typography variant="h5" fontWeight={700} mb={3}>My Results</Typography>

      {loading ? (
        <Box textAlign="center" py={6}><CircularProgress /></Box>
      ) : (
        <>
          {/* Summary */}
          <Grid container spacing={3} mb={4}>
            {[
              { label: 'Total Subjects', value: results.length },
              { label: 'Average Marks',  value: avgMarks },
              { label: 'Passed',         value: passedCount },
              { label: 'Failed',         value: results.length - passedCount },
            ].map((s) => (
              <Grid item xs={6} md={3} key={s.label}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight={700} color="primary.main">
                      {s.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">{s.label}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Results by Semester */}
          {Object.entries(bySemester).map(([sem, semResults]) => (
            <Card key={sem} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2} color="primary.main">
                  {sem}
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Subject</strong></TableCell>
                      <TableCell><strong>Code</strong></TableCell>
                      <TableCell><strong>Credit Hrs</strong></TableCell>
                      <TableCell><strong>Marks</strong></TableCell>
                      <TableCell><strong>Grade</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {semResults.map((r) => (
                      <TableRow key={r._id}>
                        <TableCell>{r.course?.name}</TableCell>
                        <TableCell>{r.course?.code}</TableCell>
                        <TableCell>{r.course?.creditHours}</TableCell>
                        <TableCell><strong>{r.marks}</strong></TableCell>
                        <TableCell>
                          <Chip
                            label={r.grade}
                            size="small"
                            color={gradeColor(r.grade)}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={r.status}
                            size="small"
                            color={r.status === 'pass' ? 'success' : r.status === 'fail' ? 'error' : 'default'}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Semester Average:{' '}
                  <strong>
                    {(semResults.reduce((s, r) => s + (r.marks || 0), 0) / semResults.length).toFixed(1)}
                  </strong>
                </Typography>
              </CardContent>
            </Card>
          ))}

          {!results.length && (
            <Typography textAlign="center" color="text.secondary" py={6}>
              No results published yet.
            </Typography>
          )}
        </>
      )}
    </Layout>
  )
}

export default Results