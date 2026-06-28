import { Container, Typography, Grid, Card, CardContent, Box, Avatar } from '@mui/material'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const values = [
  { title: 'Excellence',  desc: 'We pursue the highest academic standards.' },
  { title: 'Integrity',   desc: 'Honesty and transparency in everything we do.' },
  { title: 'Innovation',  desc: 'Encouraging creative thinking and new ideas.' },
  { title: 'Community',   desc: 'Building a strong and inclusive campus community.' },
]

const About = () => {
  return (
    <>
      <Navbar />
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8, textAlign: 'center' }}>
        <Typography variant="h3" fontWeight={700}>About PMC</Typography>
        <Typography variant="h6" sx={{ opacity: 0.8, mt: 1 }}>
          Excellence in Education Since 2001
        </Typography>
      </Box>

      <Container sx={{ py: 6 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight={700} mb={2}>Our Mission</Typography>
            <Typography variant="body1" color="text.secondary" lineHeight={1.9}>
              PMC College is committed to providing quality higher education that empowers
              students with knowledge, skills, and values to excel in their professional
              and personal lives. We strive to be a centre of academic excellence in Nepal.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight={700} mb={2}>Our Vision</Typography>
            <Typography variant="body1" color="text.secondary" lineHeight={1.9}>
              To be a nationally and internationally recognized institution of higher
              education, known for producing graduates who are competent, ethical,
              and socially responsible contributors to society.
            </Typography>
          </Grid>
        </Grid>

        <Typography variant="h4" fontWeight={700} textAlign="center" mt={6} mb={4}>
          Our Core Values
        </Typography>
        <Grid container spacing={3}>
          {values.map((v) => (
            <Grid item xs={12} sm={6} md={3} key={v.title}>
              <Card sx={{ textAlign: 'center', py: 3 }}>
                <CardContent>
                  <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                    {v.title.charAt(0)}
                  </Avatar>
                  <Typography variant="h6" fontWeight={700}>{v.title}</Typography>
                  <Typography variant="body2" color="text.secondary" mt={1}>{v.desc}</Typography>
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

export default About