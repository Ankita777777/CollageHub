import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProfile } from '../../../features/student/studentSlice'
import {
  Box, Card, CardContent, Typography,
  Button, Avatar, Divider, CircularProgress
} from '@mui/material'
import PrintIcon    from '@mui/icons-material/Print'
import SchoolIcon   from '@mui/icons-material/School'
import Layout       from '../../../components/Layout'

const IDCard = () => {
  const dispatch = useDispatch()
  const cardRef  = useRef()
  const { profile, loading } = useSelector((state) => state.student)

  useEffect(() => {
    dispatch(fetchProfile())
  }, [dispatch])

  const handlePrint = () => {
    const content  = cardRef.current.innerHTML
    const original = document.body.innerHTML
    document.body.innerHTML = content
    window.print()
    document.body.innerHTML = original
    window.location.reload()
  }

  if (loading) {
    return (
      <Layout role="student">
        <Box textAlign="center" py={6}><CircularProgress /></Box>
      </Layout>
    )
  }

  return (
    <Layout role="student">
      <Typography variant="h5" fontWeight={700} mb={3}>My ID Card</Typography>

      <Box sx={{ maxWidth: 400, mx: 'auto' }}>
        {/* ID Card */}
        <Box ref={cardRef}>
          <Card sx={{
            border: '3px solid #1565C0',
            borderRadius: 3,
            overflow: 'hidden',
          }}>
            {/* Header */}
            <Box sx={{
              bgcolor: 'primary.main', color: 'white',
              p: 2, textAlign: 'center'
            }}>
              <SchoolIcon sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h6" fontWeight={700}>PMC College</Typography>
              <Typography variant="caption">Pokhara Management College</Typography>
            </Box>

            <CardContent sx={{ p: 3 }}>
              {/* Photo + Info */}
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', mb: 2 }}>
                <Avatar
                  src={profile?.user?.photo}
                  sx={{
                    width: 90, height: 90,
                    border: '3px solid #1565C0',
                    fontSize: 36,
                  }}
                >
                  {profile?.user?.name?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    {profile?.user?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {profile?.program} — Sem {profile?.semester}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Batch: {profile?.batch}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Details */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {[
                  { label: 'Roll No',  value: profile?.rollNo },
                  { label: 'Program',  value: profile?.program },
                  { label: 'Email',    value: profile?.user?.email },
                  { label: 'Phone',    value: profile?.phone || 'N/A' },
                ].map((item) => (
                  <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                      {item.label}:
                    </Typography>
                    <Typography variant="body2">{item.value}</Typography>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Footer */}
              <Box sx={{
                bgcolor: '#f5f5f5', p: 1.5,
                borderRadius: 1, textAlign: 'center'
              }}>
                <Typography variant="caption" color="text.secondary">
                  Valid for Academic Year {profile?.batch}
                </Typography>
                <br />
                <Typography variant="caption" color="text.secondary">
                  If found please contact: +977-61-XXXXXX
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Print Button */}
        <Button
          variant="contained" fullWidth
          startIcon={<PrintIcon />}
          sx={{ mt: 2 }}
          onClick={handlePrint}
        >
          Print ID Card
        </Button>
      </Box>
    </Layout>
  )
}

export default IDCard