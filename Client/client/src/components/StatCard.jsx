import { Card, CardContent, Typography, Box } from '@mui/material'

const StatCard = ({ label, value, icon, color = '#1565C0', onClick, subtitle }) => {
  return (
    <Card
      sx={{
        cursor:     onClick ? 'pointer' : 'default',
        transition: '0.2s',
        '&:hover':  onClick ? { boxShadow: 6, transform: 'translateY(-2px)' } : {},
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              bgcolor:      color + '20',
              color,
              p:            { xs: 1, sm: 1.5 },
              borderRadius: 2,
              display:      'flex',
              alignItems:   'center',
              flexShrink:   0,
            }}
          >
            {icon}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="h5"
              fontWeight={800}
              sx={{ color, fontSize: { xs: 20, sm: 24 } }}
              noWrap
            >
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {label}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.disabled" noWrap>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default StatCard