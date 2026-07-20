import { useEffect, useState } from 'react'
import {
  Box, Card, CardContent, Typography, Table, TableHead,
  TableRow, TableCell, TableBody, Chip, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Alert, CircularProgress, Grid, Avatar,
  MenuItem, InputAdornment
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import API    from '../../../api/axios'
import Layout from '../../../components/Layout'

const designations = ['Lecturer', 'Assistant Professor', 'Associate Professor', 'Professor', 'HOD']

const ManageTeachers = () => {
  const [teachers, setTeachers] = useState([])
  const [courses,  setCourses]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [open,     setOpen]     = useState(false)
  const [success,  setSuccess]  = useState('')
  const [error,    setError]    = useState('')
  const [search,   setSearch]   = useState('')
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    employeeId: '', department: '',
    designation: 'Lecturer', phone: '',
  })

  const fetchData = async () => {
    setLoading(true)
    try {
      const [tRes, cRes] = await Promise.all([
        API.get('/admin/teachers'),
        API.get('/admin/courses'),
      ])
      setTeachers(tRes.data)
      setCourses(cRes.data)
    } catch (err) {
      setError('Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const resetForm = () => {
    setForm({ name: '', email: '', password: '', employeeId: '', department: '', designation: 'Lecturer', phone: '' })
    setError('')
  }

  const handleCreate = async () => {
    setError('')
    if (!form.name || !form.email || !form.password) {
      return setError('Name, email and password are required')
    }
    try {
      await API.post('/admin/teachers', form)
      setSuccess('Teacher created!')
      setOpen(false)
      resetForm()
      fetchData()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed')
    }
  }

  const filtered = teachers.filter((t) =>
    t.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
    t.department?.toLowerCase().includes(search.toLowerCase())
  )

  // Count courses per teacher
  const getCourseCount = (teacherId) =>
    courses.filter((c) => c.teacher?._id === teacherId).length

  return (
    <Layout role="admin">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>Manage Teachers</Typography>
        <Button variant="contained" onClick={() => { resetForm(); setOpen(true) }}>
          + Add Teacher
        </Button>
      </Box>

      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error   && <Alert severity="error"   sx={{ mb: 2 }}>{error}</Alert>}

      {/* Stats */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" fontWeight={700} color="primary.main">
                {teachers.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">Total Teachers</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" fontWeight={700} color="success.main">
                {[...new Set(teachers.map((t) => t.department).filter(Boolean))].length}
              </Typography>
              <Typography variant="body2" color="text.secondary">Departments</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" fontWeight={700} color="warning.main">
                {courses.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">Total Courses</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search */}
      <TextField
        placeholder="Search by name, email or department..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        size="small"
        sx={{ mb: 2, width: 350 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />

      <Card>
        <CardContent>
          {loading ? (
            <Box textAlign="center" py={6}><CircularProgress /></Box>
          ) : (
            <Box sx={{ overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                    <TableCell><strong>Teacher</strong></TableCell>
                    <TableCell><strong>Employee ID</strong></TableCell>
                    <TableCell><strong>Department</strong></TableCell>
                    <TableCell><strong>Designation</strong></TableCell>
                    <TableCell><strong>Phone</strong></TableCell>
                    <TableCell><strong>Courses</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((t) => (
                    <TableRow key={t._id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 36, height: 36, bgcolor: 'success.main', fontSize: 14 }}>
                            {t.user?.name?.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {t.user?.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {t.user?.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{t.employeeId || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip label={t.department || 'General'} size="small" color="primary" />
                      </TableCell>
                      <TableCell>{t.designation || 'Lecturer'}</TableCell>
                      <TableCell>{t.phone || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip
                          label={`${getCourseCount(t._id)} courses`}
                          size="small"
                          color={getCourseCount(t._id) > 0 ? 'success' : 'default'}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                        No teachers found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Add Teacher Dialog */}
      <Dialog open={open} onClose={() => { setOpen(false); resetForm() }} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>Add New Teacher</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField label="Full Name *" fullWidth value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Email *" fullWidth type="email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Password *" fullWidth type="password" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Phone" fullWidth value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Employee ID" fullWidth value={form.employeeId}
                placeholder="e.g. EMP001"
                onChange={(e) => setForm({ ...form, employeeId: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Department" fullWidth value={form.department}
                placeholder="e.g. Computer Science"
                onChange={(e) => setForm({ ...form, department: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Designation" select fullWidth value={form.designation}
                onChange={(e) => setForm({ ...form, designation: e.target.value })}>
                {designations.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpen(false); resetForm() }}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>Create Teacher</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  )
}

export default ManageTeachers