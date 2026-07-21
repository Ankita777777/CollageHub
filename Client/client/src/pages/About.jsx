import {
  Box, Container, Typography, Grid, Card,
  CardContent, Avatar, Divider, Button
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import SchoolIcon      from '@mui/icons-material/School'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import GroupsIcon      from '@mui/icons-material/Groups'
import MenuBookIcon    from '@mui/icons-material/MenuBook'
import VerifiedIcon    from '@mui/icons-material/Verified'
import LocationOnIcon  from '@mui/icons-material/LocationOn'
import Navbar  from '../components/Navbar'
import Footer  from '../components/Footer'

const stats = [
  { icon: <GroupsIcon sx={{ fontSize: 36 }} />,      label: 'Students',  value: '2000+', color: '#1565C0' },
  { icon: <SchoolIcon sx={{ fontSize: 36 }} />,       label: 'Faculty',   value: '80+',   color: '#2E7D32' },
  { icon: <MenuBookIcon sx={{ fontSize: 36 }} />,     label: 'Programs',  value: '10+',   color: '#E65100' },
  { icon: <EmojiEventsIcon sx={{ fontSize: 36 }} />,  label: 'Awards',    value: '50+',   color: '#6A1B9A' },
]

const values = [
  { title: 'Excellence',  desc: 'Highest academic standards in everything we do.',       icon: '🏆' },
  { title: 'Integrity',   desc: 'Honesty and transparency guide all our decisions.',      icon: '✨' },
  { title: 'Innovation',  desc: 'Encouraging creative thinking and modern approaches.',  icon: '💡' },
  { title: 'Community',   desc: 'Inclusive and supportive campus environment.',          icon: '🤝' },
  { title: 'Growth',      desc: 'Committed to continuous improvement and development.',  icon: '📈' },
  { title: 'Respect',     desc: 'Treating every individual with dignity and care.',      icon: '💙' },
]

const team = [
  { name: 'Dr. Ram Sharma',   role: 'Principal',      dept: 'Management' },
  { name: 'Dr. Sita Poudel',  role: 'Vice Principal', dept: 'Academics'  },
  { name: 'Mr. Hari Thapa',   role: 'HOD',            dept: 'BCA'        },
  { name: 'Mrs. Gita Basnet', role: 'HOD',            dept: 'BBA'        },
]

const About = () => {
  const navigate = useNavigate()

  return (
    <>
      <Navbar />

      {/* Hero — completely redesigned */}
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <Box sx={{
          background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 50%, #1E88E5 100%)',
          pt: { xs: 8, md: 12 }, pb: { xs: 6, md: 10 },
        }}>
          <Container>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={7}>
                <Typography
                  variant="overline"
                  sx={{ color: '#90CAF9', letterSpacing: 3, fontWeight: 600 }}
                >
                  ESTABLISHED 2001
                </Typography>
                <Typography
                  variant="h2"
                  fontWeight={800}
                  color="white"
                  sx={{ mb: 2, lineHeight: 1.2 }}
                >
                  Shaping Leaders,<br />
                  Building Futures
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: 'rgba(255,255,255,0.8)', mb: 4, lineHeight: 1.7 }}
                >
                  PMC College has been committed to providing quality higher
                  education in Nepal for over two decades. We combine academic
                  excellence with real-world skills to prepare graduates for success.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/admissions')}
                    sx={{ bgcolor: 'white', color: 'primary.main', fontWeight: 700,
                      '&:hover': { bgcolor: '#f5f5f5' } }}
                  >
                    Apply Now
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/courses')}
                    sx={{ borderColor: 'white', color: 'white',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                  >
                    View Programs
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={5}>
                <Grid container spacing={2}>
                  {stats.map((s) => (
                    <Grid item xs={6} key={s.label}>
                      <Box sx={{
                        bgcolor: 'rgba(255,255,255,0.12)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 3, p: 2.5,
                        textAlign: 'center',
                        border: '1px solid rgba(255,255,255,0.2)',
                        transition: '0.3s',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                      }}>
                        <Box sx={{ color: 'white', mb: 1 }}>{s.icon}</Box>
                        <Typography variant="h4" fontWeight={800} color="white">
                          {s.value}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
                          {s.label}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Wave bottom */}
        <Box sx={{ bgcolor: '#f5f7fa', height: 40, mt: -1 }} />
      </Box>

      {/* Mission Vision */}
      <Box sx={{ bgcolor: '#f5f7fa', py: 8 }}>
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', borderTop: '4px solid #1565C0' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" fontWeight={700} color="primary.main" mb={2}>
                    🎯 Our Mission
                  </Typography>
                  <Typography variant="body1" color="text.secondary" lineHeight={1.9}>
                    PMC College is committed to providing quality higher education
                    that empowers students with knowledge, skills, and values to
                    excel professionally and personally. We strive to be a centre
                    of academic excellence in Nepal.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', borderTop: '4px solid #2E7D32' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" fontWeight={700} color="success.main" mb={2}>
                    🔭 Our Vision
                  </Typography>
                  <Typography variant="body1" color="text.secondary" lineHeight={1.9}>
                    To be a nationally and internationally recognized institution
                    producing graduates who contribute meaningfully to society,
                    economy, and global development through innovation, leadership,
                    and ethical conduct.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Core Values */}
      <Box sx={{ py: 8, bgcolor: 'white' }}>
        <Container>
          <Typography variant="h4" fontWeight={700} textAlign="center" mb={1}>
            Our Core Values
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" mb={5}>
            The principles that guide everything we do
          </Typography>
          <Grid container spacing={3}>
            {values.map((v) => (
              <Grid item xs={12} sm={6} md={4} key={v.title}>
                <Card sx={{
                  height: '100%',
                  transition: '0.3s',
                  '&:hover': { transform: 'translateY(-6px)', boxShadow: 8 },
                }}>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Typography variant="h2" mb={1}>{v.icon}</Typography>
                    <Typography variant="h6" fontWeight={700} mb={1}>{v.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{v.desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Why Choose PMC */}
      <Box sx={{ bgcolor: '#f5f7fa', py: 8 }}>
        <Container>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h4" fontWeight={700} mb={3}>Why Choose PMC?</Typography>
              {[
                'TU & PU Affiliated Programs',
                'Experienced and Qualified Faculty',
                'Modern Labs and Library',
                'Internship and Career Support',
                'Affordable Fee Structure',
                'Scholarships for Meritorious Students',
                'Sports and Cultural Activities',
                'Hostel Facilities Available',
              ].map((item) => (
                <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <VerifiedIcon color="success" />
                  <Typography variant="body1">{item}</Typography>
                </Box>
              ))}
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" fontWeight={700} mb={2}>📍 Find Us</Typography>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <LocationOnIcon />
                    <Box>
                      <Typography variant="body1" fontWeight={600}>Address</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.85 }}>
                        Pokhara-8, Gandaki Province, Nepal
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.3)', my: 2 }} />
                  <Typography variant="body2" sx={{ opacity: 0.85, mb: 1 }}>
                    📞 Phone: +977-61-XXXXXX
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.85, mb: 1 }}>
                    📧 Email: info@pmccollege.edu.np
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.85, mb: 2 }}>
                    🕐 Office Hours: Sun-Fri 9AM - 5PM
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate('/contact')}
                    sx={{ bgcolor: 'white', color: 'primary.main', fontWeight: 700,
                      '&:hover': { bgcolor: '#f5f5f5' } }}
                  >
                    Contact Us
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Leadership */}
      <Box sx={{ py: 8, bgcolor: 'white' }}>
        <Container>
          <Typography variant="h4" fontWeight={700} textAlign="center" mb={1}>
            Our Leadership
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" mb={5}>
            Meet the people guiding PMC College
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {team.map((t) => (
              <Grid item xs={12} sm={6} md={3} key={t.name}>
                <Card sx={{
                  textAlign: 'center', py: 3,
                  '&:hover': { boxShadow: 6, transform: 'translateY(-4px)', transition: '0.3s' },
                }}>
                  <CardContent>
                    <Avatar sx={{
                      width: 72, height: 72,
                      bgcolor: 'primary.main',
                      fontSize: 28, mx: 'auto', mb: 2,
                    }}>
                      {t.name.charAt(0)}
                    </Avatar>
                    <Typography variant="subtitle1" fontWeight={700}>{t.name}</Typography>
                    <Typography variant="body2" color="primary.main" fontWeight={600}>
                      {t.role}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">{t.dept}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Footer />
    </>
  )
}

export default About