import { Container, Typography, Grid, Card, CardContent, Box, Chip, Button } from '@mui/material'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const courses = [
  { name: 'BBA',  full: 'Bachelor of Business Administration', duration: '4 Years', seats: 60, semester: 8 },
  { name: 'BCA',  full: 'Bachelor of Computer Applications',    duration: '4 Years', seats: 60, semester: 8 },
  { name: 'BBS',  full: 'Bachelor of Business Studies',         duration: '4 Years', seats: 80, semester: 8 },
    { name: 'Political Science',  full: 'Bachelor of Business Studies',         duration: '4 Years', seats: 80, semester: 8 },
  { name: 'BSC.Enviroment',  full: 'Bachelor of Business Studies',         duration: '4 Years', seats: 80, semester:8  },
  { name: 'BSC.CSIT', full: 'Bachelor of Computer Science in Information and Technology',   duration: '4 Years', seats: 141, semester: 8 },
  { name: 'MBA',  full: 'Master of Business Administration',    duration: '2 Years', seats: 40, semester: 4 },
  { name: 'MBS',  full: 'Master of Business Studies',           duration: '2 Years', seats: 40, semester: 4 },

]

const Courses = () => {
  return (
    <>
      <Navbar />
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8, textAlign: 'center' }}>
        <Typography variant="h3" fontWeight={700}>Our Programs</Typography>
        <Typography sx={{ opacity: 0.8, mt: 1 }}>
          TU & PU Affiliated Programs
        </Typography>
      </Box>

      <Container sx={{ py: 6 }}>
        <Grid container spacing={3}>
          {courses.map((c) => (
            <Grid item xs={12} sm={6} md={4} key={c.name}>
              <Card sx={{ height: '100%', '&:hover': { boxShadow: 6, transform: 'translateY(-4px)', transition: '0.3s' } }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ bgcolor: 'primary.light', p: 1.5, borderRadius: 2 }}>
                      <MenuBookIcon sx={{ color: 'white' }} />
                    </Box>
                    <Box>
                      <Typography variant="h5" fontWeight={700}>{c.name}</Typography>
                      <Chip label={c.duration} size="small" color="primary" variant="outlined" />
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" mb={2}>{c.full}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Semesters: <strong>{c.semester}</strong>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Seats: <strong>{c.seats}</strong>
                    </Typography>
                  </Box>
                  <Button variant="contained" fullWidth size="small">
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Footer />
    </>
  )
}

export default Courses