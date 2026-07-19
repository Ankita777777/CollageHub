import {
  Box, Container, Typography, Grid, Card,
  CardContent, Avatar, Divider
} from '@mui/material'
import SchoolIcon        from '@mui/icons-material/School'
import EmojiEventsIcon   from '@mui/icons-material/EmojiEvents'
import GroupsIcon        from '@mui/icons-material/Groups'
import MenuBookIcon      from '@mui/icons-material/MenuBook'
import VerifiedIcon      from '@mui/icons-material/Verified'
import LocationOnIcon    from '@mui/icons-material/LocationOn'
import Navbar  from '../components/Navbar'
import Footer  from '../components/Footer'

const stats = [
  { icon: <GroupsIcon sx={{ fontSize: 40 }} />,      label: 'Students',      value: '2000+',  color: '#1565C0' },
  { icon: <SchoolIcon sx={{ fontSize: 40 }} />,       label: 'Faculty',       value: '80+',    color: '#2E7D32' },
  { icon: <MenuBookIcon sx={{ fontSize: 40 }} />,     label: 'Programs',      value: '10+',    color: '#E65100' },
  { icon: <EmojiEventsIcon sx={{ fontSize: 40 }} />,  label: 'Awards',        value: '50+',    color: '#6A1B9A' },
]

const values = [
  { title: 'Excellence',  desc: 'We pursue the highest standards in everything we do.',          icon: '🏆' },
  { title: 'Integrity',   desc: 'Honesty and transparency guide all our decisions.',              icon: '✨' },
  { title: 'Innovation',  desc: 'We encourage creative thinking and modern approaches.',         icon: '💡' },
  { title: 'Community',   desc: 'We build an inclusive and supportive campus environment.',      icon: '🤝' },
  { title: 'Growth',      desc: 'We are committed to continuous improvement and development.',   icon: '📈' },
  { title: 'Respect',     desc: 'We treat every individual with dignity and respect.',           icon: '💙' },
]

const team = [
  { name: 'Dr. Ram Sharma',     role: 'Principal',         dept: 'Management'  },
  { name: 'Dr. Sita Poudel',    role: 'Vice Principal',    dept: 'Academics'   },
  { name: 'Mr. Hari Thapa',     role: 'HOD',               dept: 'BCA'         },
  { name: 'Mrs. Gita Basnet',   role: 'HOD',               dept: 'BBA'         },
]

const About = () => {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <Box sx={{
        background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 60%, #1E88E5 100%)',
        color: 'white', py: 10, textAlign: 'center',
      }}>
        <SchoolIcon sx={{ fontSize: 64, mb: 2, opacity: 0.9 }} />
        <Typography variant="h3" fontWeight={800} mb={1}>
          About PMC College
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.8, maxWidth: 600, mx: 'auto' }}>
          Excellence in Education Since 2001 — Shaping Future Leaders
        </Typography>
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
                    <Typography variant="body1" color="text.secondary" fontWeight={500}>
                      {s.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
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
                    that empowers students with knowledge, skills, and values needed
                    to excel professionally and personally. We strive to be a centre
                    of academic excellence in Nepal, producing graduates who are
                    competent, ethical, and socially responsible.
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
                    of higher education, known for producing graduates who contribute
                    meaningfully to society, economy, and global development through
                    innovation, leadership, and ethical conduct.
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
                  p: 1,
                  height: '100%',
                  transition: '0.3s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 },
                }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" mb={1}>{v.icon}</Typography>
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
              <Typography variant="h4" fontWeight={700} mb={3}>
                Why Choose PMC?
              </Typography>
              {[
                'TU & PU Affiliated Programs',
                'Experienced and Qualified Faculty',
                'Modern Labs and Library',
                'Internship and Career Support',
                'Affordable Fee Structure',
                'Scholarships Available',
                'Sports and Cultural Activities',
                'Hostel Facilities',
              ].map((item) => (
                <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <VerifiedIcon color="success" />
                  <Typography variant="body1">{item}</Typography>
                </Box>
              ))}
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ bgcolor: 'primary.main', color: 'white', p: 2 }}>
                <CardContent>
                  <Typography variant="h5" fontWeight={700} mb={3}>
                    📍 Find Us
                  </Typography>
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
                  <Typography variant="body2" sx={{ opacity: 0.85 }}>
                    🕐 Office Hours: Sun-Fri 9AM - 5PM
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Leadership Team */}
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
                <Card sx={{ textAlign: 'center', py: 3 }}>
                  <CardContent>
                    <Avatar
                      sx={{
                        width: 70, height: 70,
                        bgcolor: 'primary.main',
                        fontSize: 28,
                        mx: 'auto', mb: 2,
                      }}
                    >
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