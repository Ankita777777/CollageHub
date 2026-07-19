import { useEffect, useState } from 'react'
import {
  Box, Card, CardContent, Typography, Table, TableHead,
  TableRow, TableCell, TableBody, Chip, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Alert, CircularProgress, Grid, MenuItem
} from '@mui/material'
import API    from '../../../api/axios'
import Layout from '../../../components/Layout'

const programs  = ['BBA', 'BCA', 'BBS', 'BSC.CIST','BIT', 'MBA', 'MBS']
const semesters = [1, 2, 3, 4, 5, 6, 7, 8]

const ManageCourses = () => {
  const [courses,  setCourses]  = useState([])
  const [teachers, setTeachers] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [open,     setOpen]     = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [success,  setSuccess]  = useState('')
  const [error,    setError]    = useState('')
  const [form, setForm] = useState({
    name:        '',
    code:        '',
    program:     '',
    semester:    '',
    creditHours: 3,
    teacher:     '',
    description: '',
  })

  const fetchData = async () => {
    setLoading(true)
    try {
      const [cRes, tRes] = await Promise.all([
        API.get('/admin/courses'),
        API.get('/admin/teachers'),
      ])
      setCourses(cRes.data)
      setTeachers(tRes.data)
    } catch (err) {
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const resetForm = () => {
    setForm({
      name: '', code: '', program: '', semester: '',
      creditHours: 3, teacher: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Teacher",
  required: false,
  default: null
}, description: '',
    })
    setEditItem(null)
    setError('')
  }

  const openAdd = () => {
    resetForm()
    setOpen(true)
  }

  const openEdit = (course) => {
    setEditItem(course)
    setForm({
      name:        course.name,
      code:        course.code,
      program:     course.program,
      semester:    course.semester,
      creditHours: course.creditHours,
      teacher:     course.teacher?._id || '',
      description: course.description || '',
    })
    setError('')
    setOpen(true)
  }

  const handleSave = async () => {
    setError('')
    if (!form.name || !form.code || !form.program || !form.semester) {
      return setError('Please fill all required fields')
    }
    try {
      if (editItem) {
        await API.put(`/admin/courses/${editItem._id}`, form)
        setSuccess('Course updated successfully!')
      } else {
        await API.post('/admin/courses', form)
        setSuccess('Course created successfully!')
      }
      setOpen(false)
      resetForm()
      fetchData()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save course')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return
    try {
      await API.delete(`/admin/courses/${id}`)
      setCourses(courses.filter((c) => c._id !== id))
      setSuccess('Course deleted!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to delete course')
    }
  }

  return (
    <Layout role="admin">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>Manage Courses</Typography>
        <Button variant="contained" onClick={openAdd}>+ Add Course</Button>
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
                    <TableCell><strong>Course Name</strong></TableCell>
                    <TableCell><strong>Code</strong></TableCell>
                    <TableCell><strong>Program</strong></TableCell>
                    <TableCell><strong>Semester</strong></TableCell>
                    <TableCell><strong>Credit Hrs</strong></TableCell>
                    <TableCell><strong>Teacher</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {courses.map((c) => (
                    <TableRow key={c._id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {c.name}
                        </Typography>
                        {c.description && (
                          <Typography variant="caption" color="text.secondary">
                            {c.description}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip label={c.code} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Chip label={c.program} size="small" color="primary" />
                      </TableCell>
                      <TableCell>Sem {c.semester}</TableCell>
                      <TableCell>{c.creditHours}</TableCell>
                      <TableCell>
                        {c.teacher?.user?.name || (
                          <Typography variant="caption" color="text.secondary">
                            Not assigned
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => openEdit(c)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => handleDelete(c._id)}
                          >
                            Delete
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!courses.length && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        align="center"
                        sx={{ py: 6, color: 'text.secondary' }}
                      >
                        No courses yet. Click Add Course to create one.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog
        open={open}
        onClose={() => { setOpen(false); resetForm() }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle fontWeight={700}>
          {editItem ? 'Edit Course' : 'Add New Course'}
        </DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Course Name *"
                fullWidth
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Mathematics"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Course Code *"
                fullWidth
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                placeholder="e.g. BCA101"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Program *"
                select
                fullWidth
                value={form.program}
                onChange={(e) => setForm({ ...form, program: e.target.value })}
              >
                {programs.map((p) => (
                  <MenuItem key={p} value={p}>{p}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Semester *"
                select
                fullWidth
                value={form.semester}
                onChange={(e) => setForm({ ...form, semester: e.target.value })}
              >
                {semesters.map((s) => (
                  <MenuItem key={s} value={s}>Semester {s}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Credit Hours"
                type="number"
                fullWidth
                value={form.creditHours}
                onChange={(e) => setForm({ ...form, creditHours: e.target.value })}
                inputProps={{ min: 1, max: 6 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Assign Teacher"
                select
                fullWidth
                value={form.teacher}
                onChange={(e) => setForm({ ...form, teacher: e.target.value })}
              >
                <MenuItem value="">None</MenuItem>
                {teachers.map((t) => (
                  <MenuItem key={t._id} value={t._id}>
                    {t.user?.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description (optional)"
                fullWidth
                multiline
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpen(false); resetForm() }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {editItem ? 'Update Course' : 'Create Course'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  )
}

export default ManageCourses
