import { useEffect, useState } from 'react'
import {
  Box, Grid, Card, CardContent, Typography,
  Table, TableHead, TableRow, TableCell, TableBody,
  Button, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, MenuItem, Alert
} from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import SchoolIcon from '@mui/icons-material/School'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import PaymentIcon from '@mui/icons-material/Payment'
import Sidebar from '../../components/Sidebar'
import API from '../../api/axios'

const AdminDashboard = () => {
  const [stats, setStats]     = useState({})
  const [students, setStudents] = useState([])
  const [open, setOpen]       = useState(false)
  const [success, setSuccess] = useState('')
  const [form, setForm]       = useState({
    name: '', email: '', password: '', rollNo: '',
    semester: '', program: '', batch: '', phone: ''
  })

  useEffect(() => {
    API.get('/admin/stats').then((res) => setStats(res.data))
    API.get('/admin/students').then((res) => setStudents(res.data))
  }, [])

  const handleCreate = async () => {
    try {
      await API.post('/admin/students', form)
      setSuccess('Student created!')
      setOpen(false)
      const res = await API.get('/admin/students')
      setStudents(res.data)
    } catch (err) {
      alert(err.response?.data?.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this student?')) return
    await API.delete(`/admin/students/${id}`)
    setStudents(students.filter((s) => s._id !== id))
  }

  const statCards = [
    { label: 'Total Students', value: stats.totalStudents, icon: <PeopleIcon />,   color: '#1565C0' },
    { label: 'Total Teachers', value: stats.totalTeachers, icon: <SchoolIcon />,   color: '#2E7D32' },
    { label: 'Total Courses',  value: stats.totalCourses,  icon: <MenuBookIcon />, color: '#E65100' },
    { label: 'Total Revenue',  value: `Rs. ${stats.totalRevenue || 0}`, icon: <PaymentIcon />, color: '#6A1B9A' },
  ]

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar role="admin" />
      <Box sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
        <Typography variant="h5" fontWeight={700} mb={3}>Admin Dashboard</Typography>

        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Grid container spacing={3} mb={4}>
          {statCards.map((s) => (
            <Grid item xs={12} sm={6} md={3} key={s.label}>
              <Card>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ bgcolor: s.color + '20', p: 1.5, borderRadius: 2, color: s.color }}>
                    {s.icon}
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight={700}>{s.value}</Typography>
                    <Typography variant="body2" color="text.secondary">{s.label}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Students Table */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>Manage Students</Typography>
              <Button variant="contained" onClick={() => setOpen(true)}>+ Add Student</Button>
            </Box>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Roll No</TableCell>
                  <TableCell>Program</TableCell>
                  <TableCell>Semester</TableCell>
                  <TableCell>Fee</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((s) => (
                  <TableRow key={s._id}>
                    <TableCell>{s.user?.name}</TableCell>
                    <TableCell>{s.user?.email}</TableCell>
                    <TableCell>{s.rollNo}</TableCell>
                    <TableCell>{s.program}</TableCell>
                    <TableCell>{s.semester}</TableCell>
                    <TableCell>{s.feeStatus}</TableCell>
                    <TableCell>
                      <Button size="small" color="error" onClick={() => handleDelete(s._id)}>
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add Student Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {[
                { name: 'name',     label: 'Full Name' },
                { name: 'email',    label: 'Email' },
                { name: 'password', label: 'Password' },
                { name: 'rollNo',   label: 'Roll No' },
                { name: 'phone',    label: 'Phone' },
                { name: 'batch',    label: 'Batch (e.g. 2022-2026)' },
              ].map((f) => (
                <Grid item xs={12} sm={6} key={f.name}>
                  <TextField label={f.label} fullWidth
                    type={f.name === 'password' ? 'password' : 'text'}
                    value={form[f.name]}
                    onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
                </Grid>
              ))}
              <Grid item xs={12} sm={6}>
                <TextField select label="Program" fullWidth value={form.program}
                  onChange={(e) => setForm({ ...form, program: e.target.value })}>
                  {['BBA', 'BCA', 'BBS', 'BCIS', 'MBA', 'MBS'].map((p) => (
                    <MenuItem key={p} value={p}>{p}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField select label="Semester" fullWidth value={form.semester}
                  onChange={(e) => setForm({ ...form, semester: e.target.value })}>
                  {[1,2,3,4,5,6,7,8].map((s) => (
                    <MenuItem key={s} value={s}>Semester {s}</MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleCreate}>Create Student</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  )
}

export default AdminDashboard