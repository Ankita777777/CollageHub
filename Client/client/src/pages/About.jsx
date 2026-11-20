import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNotices } from '../features/notice/noticeSlice'
import { useNavigate } from 'react-router-dom'
import {
  Box, Typography, Button, Grid, Card, CardContent,
  Container, Chip, CircularProgress
} from '@mui/material'
import SchoolIcon      from '@mui/icons-material/School'
import GroupsIcon      from '@mui/icons-material/Groups'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import MenuBookIcon    from '@mui/icons-material/MenuBook'
import Navbar          from '../components/Navbar'
import Footer          from '../components/Footer'
import NoticeCard      from '../components/NoticeCard'

const stats = [
  { icon: <GroupsIcon sx={{ fontSize: 40 }} />,      label: 'Students',  value: '2000+', color: '#1565C0' },
  { icon: <SchoolIcon sx={{ fontSize: 40 }} />,       label: 'Faculty',   value: '80+',   color: '#2E7D32' },
  { icon: <MenuBookIcon sx={{ fontSize: 40 }} />,     label: 'Programs',  value: '10+',   color: '#E65100' },
  { icon: <EmojiEventsIcon sx={{ fontSize: 40 }} />,  label: 'Awards',    value: '50+',   color: '#6A1B9A' },
]

const programs = ['BBA', 'BCA', 'BBS', 'BCIS', 'MBA', 'MBS']

const Home = () => {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { notices, loading } = useSelector((state) => state.notice)

  useEffect(() => {
    dispatch(fetchNotices({ isPublic: true }))
  }, [dispatch])

  return (
    <>
      <Navbar />

      {/* Hero */}
      <Box sx={{
        minHeight: '90vh',
        display: 'flex', alignItems: 'center',
        background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 50%, #1E88E5 100%)',
        color: 'white',
        px: { xs: 3, md: 10 },
        py: { xs: 6, md: 0 },
      }}>
        <Box sx={{ maxWidth: 600 }}>
          <Chip label="Est. 2001 — Lalitpur, Nepal" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', mb: 2 }} />
          <Typography variant="h2" fontWeight={800} sx={{ mb: 2, lineHeight: 1.2, fontSize: { xs: '2rem', md: '3rem' } }}>
           Patan Multiple<br />Campus
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.85, mb: 4, lineHeight: 1.7, fontSize: { xs: '1rem', md: '1.25rem' } }}>
            Shaping future leaders with quality education, modern facilities,
            and experienced faculty in the heart of Lalitpur.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained" size="large"
              onClick={() => navigate('/admissions')}
              sx={{ bgcolor: 'white', color: 'primary.main', fontWeight: 700,
                '&:hover': { bgcolor: '#f0f0f0' } }}
            >
              Apply Now
            </Button>
            <Button
              variant="outlined" size="large"
              onClick={() => navigate('/courses')}
              sx={{ borderColor: 'white', color: 'white',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
            >
              View Programs
            </Button>
            <Button
              variant="outlined" size="large"
              onClick={() => navigate('/results/check')}
              sx={{ borderColor: 'rgba(255,255,255,0.6)', color: 'rgba(255,255,255,0.9)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
            >
              Check Results
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
                <Card sx={{ textAlign: 'center', py: 2, border: `2px solid ${s.color}20` }}>
                  <CardContent>
                    <Box sx={{ color: s.color, mb: 1 }}>{s.icon}</Box>
                    <Typography variant="h3" fontWeight={800} sx={{ color: s.color }}>
                      {s.value}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">{s.label}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Programs */}
      <Box sx={{ bgcolor: '#f5f7fa', py: 6 }}>
        <Container>
          <Typography variant="h4" fontWeight={700} textAlign="center" mb={1}>
            Our Programs
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" mb={4}>
            TU & PU affiliated programs designed for your success
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {programs.map((p) => (
              <Grid item xs={6} sm={4} md={2} key={p}>
                <Card
                  sx={{
                    textAlign: 'center', py: 3, cursor: 'pointer',
                    '&:hover': { boxShadow: 6, transform: 'translateY(-4px)', transition: '0.3s' },
                  }}
                  onClick={() => navigate('/courses')}
                >
                  <CardContent>
                    <MenuBookIcon color="primary" sx={{ fontSize: 36, mb: 1 }} />
                    <Typography variant="h6" fontWeight={700}>{p}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box textAlign="center" mt={3}>
            <Button variant="contained" size="large" onClick={() => navigate('/courses')}>
              View All Programs
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Notices */}
      <Box sx={{ py: 6, bgcolor: 'white' }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" fontWeight={700}>Latest Notices</Typography>
            <Button variant="outlined" onClick={() => navigate('/notices')}>
              View All
            </Button>
          </Box>

          {loading ? (
            <Box textAlign="center" py={4}><CircularProgress /></Box>
          ) : notices.length === 0 ? (
            <Typography textAlign="center" color="text.secondary" py={4}>
              No notices yet
            </Typography>
          ) : (
            notices.slice(0, 5).map((notice) => (
              <NoticeCard key={notice._id} notice={notice} />
            ))
          )}
        </Container>
      </Box>

      {/* CTA */}
      <Box sx={{
        background: 'linear-gradient(135deg, #0D47A1, #1E88E5)',
        color: 'white', py: 8, textAlign: 'center',
      }}>
        <Container>
          <Typography variant="h4" fontWeight={700} mb={2}>
            Ready to Join PMC College?
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.8, mb: 4 }}>
            Applications are open for Academic Year 2081/82
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained" size="large"
              onClick={() => navigate('/admissions')}
              sx={{ bgcolor: 'white', color: 'primary.main', fontWeight: 700 }}
            >
              Apply for Admission
            </Button>
            <Button
              variant="outlined" size="large"
              onClick={() => navigate('/contact')}
              sx={{ borderColor: 'white', color: 'white' }}
            >
              Contact Us
            </Button>
          </Box>
        </Container>
      </Box>

      <Footer />
    </>
  )
}

export default Home