import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Container, Typography, Grid, Card, CardContent,
  Button, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, List, ListItem, ListItemIcon, ListItemText,
  Divider
} from '@mui/material'
import MenuBookIcon   from '@mui/icons-material/MenuBook'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import GroupsIcon     from '@mui/icons-material/Groups'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Navbar  from '../components/Navbar'
import Footer  from '../components/Footer'

const courses = [
  {
    name:     'BBA',
    full:     'Bachelor of Business Administration',
    duration: '4 Years',
    seats:    60,
    semester: 8,
    color:    '#1565C0',
    subjects: ['Business Mathematics', 'Accounting', 'Marketing', 'Economics', 'Management'],
    eligibility: 'Passed 10+2 or equivalent with minimum 45%',
    career: ['Business Manager', 'Entrepreneur', 'HR Manager', 'Marketing Executive'],
  },
  {
    name:     'BCA',
    full:     'Bachelor of Computer Applications',
    duration: '4 Years',
    seats:    60,
    semester: 8,
    color:    '#2E7D32',
    subjects: ['Programming in C', 'Data Structures', 'Web Development', 'Database', 'Networks'],
    eligibility: 'Passed 10+2 with Mathematics, minimum 45%',
    career: ['Software Developer', 'Web Developer', 'System Analyst', 'IT Manager'],
  },
  {
    name:     'BBS',
    full:     'Bachelor of Business Studies',
    duration: '4 Years',
    seats:    80,
    semester: 8,
    color:    '#E65100',
    subjects: ['Business Statistics', 'Financial Accounting', 'Business Law', 'Management'],
    eligibility: 'Passed 10+2 or equivalent',
    career: ['Accountant', 'Business Analyst', 'Finance Officer', 'Bank Officer'],
  },
  {
    name:     'BCIS',
    full:     'Bachelor of Computer Information Systems',
    duration: '4 Years',
    seats:    40,
    semester: 8,
    color:    '#6A1B9A',
    subjects: ['Information Systems', 'Database Management', 'Business Intelligence', 'E-Commerce'],
    eligibility: 'Passed 10+2 with Mathematics, minimum 50%',
    career: ['IT Consultant', 'System Analyst', 'Database Admin', 'Project Manager'],
  },
  {
    name:     'MBA',
    full:     'Master of Business Administration',
    duration: '2 Years',
    seats:    40,
    semester: 4,
    color:    '#C62828',
    subjects: ['Strategic Management', 'Corporate Finance', 'Leadership', 'Research Methods'],
    eligibility: "Bachelor's degree in any discipline with minimum 50%",
    career: ['CEO', 'Business Consultant', 'Operations Manager', 'Finance Director'],
  },
  {
    name:     'MBS',
    full:     'Master of Business Studies',
    duration: '2 Years',
    seats:    40,
    semester: 4,
    color:    '#00695C',
    subjects: ['Advanced Accounting', 'Business Research', 'Tax Management', 'Audit'],
    eligibility: "Bachelor's degree in Business or related field",
    career: ['Tax Consultant', 'Auditor', 'Financial Analyst', 'CFO'],
  },
]

const Courses = () => {
  const navigate     = useNavigate()
  const [selected, setSelected] = useState(null)

  return (
    <>
      <Navbar />

      {/* Hero */}
      <Box sx={{
        background: 'linear-gradient(135deg, #0D47A1, #1E88E5)',
        color: 'white', py: 8, textAlign: 'center',
      }}>
        <Typography variant="h3" fontWeight={800} mb={1}>Our Programs</Typography>
        <Typography variant="h6" sx={{ opacity: 0.8 }}>
          TU & PU Affiliated — Quality Education for Your Future
        </Typography>
      </Box>

      <Container sx={{ py: 6 }}>
        <Grid container spacing={3}>
          {courses.map((c) => (
            <Grid item xs={12} sm={6} md={4} key={c.name}>
              <Card sx={{
                height: '100%',
                borderTop: `4px solid ${c.color}`,
                transition: '0.3s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 8 },
              }}>
                <CardContent sx={{ p: 3 }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{
                      bgcolor: c.color + '15',
                      p: 1.5, borderRadius: 2,
                      color: c.color,
                    }}>
                      <MenuBookIcon sx={{ fontSize: 28 }} />
                    </Box>
                    <Box>
                      <Typography variant="h5" fontWeight={800} sx={{ color: c.color }}>
                        {c.name}
                      </Typography>
                      <Chip
                        label={c.duration}
                        size="small"
                        sx={{ bgcolor: c.color + '15', color: c.color, fontWeight: 600 }}
                      />
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" fontWeight={500} mb={2}>
                    {c.full}
                  </Typography>

                  <Divider sx={{ my: 1.5 }} />

                  {/* Info */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTimeIcon fontSize="small" color="action" />
                      <Typography variant="caption">{c.semester} Semesters</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <GroupsIcon fontSize="small" color="action" />
                      <Typography variant="caption">{c.seats} Seats</Typography>
                    </Box>
                  </Box>

                  {/* Buttons */}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      size="small"
                      onClick={() => setSelected(c)}
                      sx={{ borderColor: c.color, color: c.color }}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="contained"
                      fullWidth
                      size="small"
                      onClick={() => navigate('/admissions')}
                      sx={{ bgcolor: c.color }}
                    >
                      Apply Now
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Course Detail Dialog */}
      <Dialog
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        maxWidth="sm"
        fullWidth
      >
        {selected && (
          <>
            <DialogTitle sx={{ bgcolor: selected.color, color: 'white', pb: 2 }}>
              <Typography variant="h5" fontWeight={700}>{selected.name}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>{selected.full}</Typography>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <Grid container spacing={2} mb={2}>
                {[
                  { label: 'Duration',  value: selected.duration },
                  { label: 'Semesters', value: selected.semester },
                  { label: 'Seats',     value: selected.seats },
                ].map((info) => (
                  <Grid item xs={4} key={info.label}>
                    <Box sx={{ textAlign: 'center', bgcolor: '#f5f7fa', p: 1.5, borderRadius: 2 }}>
                      <Typography variant="h6" fontWeight={700} sx={{ color: selected.color }}>
                        {info.value}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {info.label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Typography variant="subtitle1" fontWeight={700} mb={1}>
                📚 Key Subjects
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {selected.subjects.map((s) => (
                  <Chip key={s} label={s} size="small" variant="outlined" />
                ))}
              </Box>

              <Typography variant="subtitle1" fontWeight={700} mb={1}>
                ✅ Eligibility
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                {selected.eligibility}
              </Typography>

              <Typography variant="subtitle1" fontWeight={700} mb={1}>
                💼 Career Opportunities
              </Typography>
              <List dense>
                {selected.career.map((c) => (
                  <ListItem key={c} sx={{ py: 0.3 }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <CheckCircleIcon fontSize="small" sx={{ color: selected.color }} />
                    </ListItemIcon>
                    <ListItemText primary={c} />
                  </ListItem>
                ))}
              </List>
            </DialogContent>
            <DialogActions sx={{ p: 2, gap: 1 }}>
              <Button onClick={() => setSelected(null)} variant="outlined">
                Close
              </Button>
              <Button
                variant="contained"
                onClick={() => { setSelected(null); navigate('/admissions') }}
                sx={{ bgcolor: selected.color }}
              >
                Apply for {selected.name}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Footer />
    </>
  )
}

export default Courses