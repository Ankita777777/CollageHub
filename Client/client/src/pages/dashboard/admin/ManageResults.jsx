import { useEffect, useState } from 'react'
import {
  Box, Card, CardContent, Typography, Table, TableHead,
  TableRow, TableCell, TableBody, Chip, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Alert, MenuItem, Grid, CircularProgress
} from '@mui/material'
import API    from '../../../api/axios'
import Layout from '../../../components/Layout'

const ManageResults = () => {
  const [results,  setResults]  = useState([])
  const [students, setStudents] = useState([])
  const [courses,  setCourses]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [open,     setOpen]     = useState(false)
  const [success,  setSuccess]  = useState('')
  const [error,    setError]    = useState('')
  const [form, setForm] = useState({
    studentId: '', courseId: '', semester: '', marks: ''
  })

  const fetchData = async () => {
    setLoading(true)
    try {
      const [rRes, sRes, cRes] = await Promise.all([
        API.get('/results'),
        API.get('/admin/students'),
        API.get('/admin/courses'),
      ])
      setResults(rRes.data)
      setStudents(sRes.data)
      setCourses(cRes.data)
    } catch (err) {
      setError('Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleSave = async () => {
    setError('')
    if (!form.studentId || !form.courseId || !form.semester || form.marks === '') {
      return setError('Please fill all fields')
    }
    try {
      await API.post('/teachers/results', {
        studentId: form.studentId,
        courseId:  form.courseId,
        semester:  Number(form.semester),
        marks:     Number(form.marks),
      })
      setSuccess('Result saved!')
      setOpen(false)
      setForm({ studentId: '', courseId: '', semester: '', marks: '' })
      fetchData()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this result?')) return
    try {
      await API.delete(`/results/${id}`)
      setResults(results.filter((r) => r._id !== id))
    } catch (err) {
      setError('Failed to delete')
    }
  }

  const getGradeColor = (grade) => {
    if (['A+', 'A'].includes(grade)) return 'success'
    if (['B+', 'B'].includes(grade)) return 'primary'
    if (['C', 'D'].includes(grade))  return 'warning'
    return 'error'
  }

  return (
    <Layout role="admin">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>Manage Results</Typography>
        <Button variant="contained" onClick={() => { setError(''); setOpen(true) }}>
          + Add Result
        </Button>
      </Box>

      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error   && <Alert severity="error"   sx={{ mb: 2 }}>{error}</Alert>}

      <Card>
        <CardContent>
          {loading ? (
            <Box textAlign="center" py={6}><CircularProgress /></Box>
          ) : (
            <Box sx={{ overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                    <TableCell><strong>Student</strong></TableCell>
                    <TableCell><strong>Course</strong></TableCell>
                    <TableCell><strong>Semester</strong></TableCell>
                    <TableCell><strong>Marks</strong></TableCell>
                    <TableCell><strong>Grade</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.map((r) => (
                    <TableRow key={r._id} hover>
                      <TableCell>{r.student?.user?.name}</TableCell>
                      <TableCell>{r.course?.name}</TableCell>
                      <TableCell>Sem {r.semester}</TableCell>
                      <TableCell><strong>{r.marks}</strong>/100</TableCell>
                      <TableCell>
                        <Chip label={r.grade} size="small" color={getGradeColor(r.grade)} />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={r.status}
                          size="small"
                          color={r.status === 'pass' ? 'success' : r.status === 'fail' ? 'error' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Button size="small" color="error" onClick={() => handleDelete(r._id)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!results.length && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                        No results yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Add Result Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700}>Add Result</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                label="Select Student" select fullWidth
                value={form.studentId}
                onChange={(e) => setForm({ ...form, studentId: e.target.value })}
              >
                {students.map((s) => (
                  <MenuItem key={s._id} value={s._id}>
                    {s.user?.name} — {s.rollNo}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Select Course" select fullWidth
                value={form.courseId}
                onChange={(e) => setForm({ ...form, courseId: e.target.value })}
              >
                {courses.map((c) => (
                  <MenuItem key={c._id} value={c._id}>
                    {c.name} ({c.code})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Semester" select fullWidth
                value={form.semester}
                onChange={(e) => setForm({ ...form, semester: e.target.value })}
              >
                {[1,2,3,4,5,6,7,8].map((s) => (
                  <MenuItem key={s} value={s}>Semester {s}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Marks (0-100)" type="number" fullWidth
                value={form.marks}
                onChange={(e) => setForm({ ...form, marks: e.target.value })}
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>
            {form.marks !== '' && (
              <Grid item xs={12}>
                <Alert severity="info">
                  Grade:{' '}
                  <strong>
                    {Number(form.marks) >= 90 ? 'A+' :
                     Number(form.marks) >= 80 ? 'A'  :
                     Number(form.marks) >= 70 ? 'B+' :
                     Number(form.marks) >= 60 ? 'B'  :
                     Number(form.marks) >= 50 ? 'C'  :
                     Number(form.marks) >= 40 ? 'D'  : 'F'}
                  </strong>
                  {' '}| Status:{' '}
                  <strong>{Number(form.marks) >= 40 ? '✅ Pass' : '❌ Fail'}</strong>
                </Alert>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save Result</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  )
}

export default ManageResults