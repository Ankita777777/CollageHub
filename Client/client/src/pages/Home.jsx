import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNotices } from '../features/notice/noticeSlice'
import { useNavigate } from 'react-router-dom'
import {
  Box, Typography, Button, Grid, Card, CardContent,
  Container, Chip
} from '@mui/material'
import SchoolIcon from '@mui/icons-material/School'
import GroupsIcon from '@mui/icons-material/Groups'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import NoticeCard from '../components/NoticeCard'

const stats = [
  { icon: <GroupsIcon fontSize="large" />,      label: 'Students',  value: '2000+' },
  { icon: <SchoolIcon fontSize="large" />,       label: 'Faculty',   value: '80+' },
  { icon: <MenuBookIcon fontSize="large" />,     label: 'Programs',  value: '10+' },
  { icon: <EmojiEventsIcon fontSize="large" />,  label: 'Awards',    value: '50+' },
]

const programs = ['BBA', 'BCA', 'BBS', 'MBA', 'MBS', 'BCIS']

const Home = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { notices } = useSelector((state) => state.notice)

  useEffect(() => {
    dispatch(fetchNotices({ isPublic: true }))
  }, [dispatch])

  return (
    <>
      <Navbar />

      {/* Hero */}
      <Box sx={{
        minHeight: '90vh', display: 'flex', alignItems: 'center',
        background: 'linear-gradient(135deg, #a8c6f1 0%, #5c7086 50%, #1E88E5 100%)',
        color: 'white', px: { xs: 3, md: 10 }
      }}>
        <Box>
          <Chip label="Est. 2001" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', mb: 2 }} />
          <Typography variant="h2" fontWeight={800} sx={{ mb: 2, lineHeight: 1.2 }}>
           Patan Multiple<br />Campus
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.85, mb: 4, maxWidth: 500 }}>
            Shaping future leaders with quality education, modern facilities, and experienced faculty.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" size="large"
              sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: '#f5f5f5' } }}
              onClick={() => navigate('/admissions')}>
              Apply Now
            </Button>
            <Button variant="outlined" size="large"
              sx={{ borderColor: 'white', color: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
              onClick={() => navigate('/courses')}>
              View Programs
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Stats */}
      <Box sx={{ bgcolor: 'white', py: 6 }}>
        <Container>
          <Grid container spacing={3}>
            {stats.map((s) => (
              <Grid item xs={6} md={3} key={s.label}>
                <Card sx={{ textAlign: 'center', py: 3 }}>
                  <CardContent>
                    <Box sx={{ color: 'primary.main', mb: 1 }}>{s.icon}</Box>
                    <Typography variant="h4" fontWeight={700}>{s.value}</Typography>
                    <Typography variant="body2" color="text.secondary">{s.label}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Programs */}
      <Box sx={{ bgcolor: '#F5F7FA', py: 6 }}>
        <Container>
          <Typography variant="h4" fontWeight={700} textAlign="center" mb={4}>
            Our Programs
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {programs.map((p) => (
              <Grid item xs={6} sm={4} md={2} key={p}>
                <Card sx={{ textAlign: 'center', py: 3, cursor: 'pointer',
                  '&:hover': { boxShadow: 4, transform: 'translateY(-4px)', transition: '0.3s' } }}>
                  <CardContent>
                    <MenuBookIcon color="primary" sx={{ fontSize: 36, mb: 1 }} />
                    <Typography variant="h6" fontWeight={700}>{p}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Latest Notices */}
      <Box sx={{ py: 6 }}>
        <Container maxWidth="md">
          <Typography variant="h4" fontWeight={700} textAlign="center" mb={4}>
            Latest Notices
          </Typography>
          {notices.slice(0, 4).map((notice) => (
            <NoticeCard key={notice._id} notice={notice} />
          ))}
          <Box textAlign="center" mt={3}>
            <Button variant="outlined" onClick={() => navigate('/notices')}>
              View All Notices
            </Button>
          </Box>
        </Container>
      </Box>

      <Footer />
    </>
  )
}

export default Home