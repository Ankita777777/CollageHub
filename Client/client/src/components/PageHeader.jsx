import { Box, Typography, Button, Breadcrumbs, Link } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'

const PageHeader = ({ title, subtitle, action, actionLabel, breadcrumbs }) => {
  return (
    <Box sx={{ mb: 3 }}>
      {breadcrumbs && (
        <Breadcrumbs sx={{ mb: 1 }}>
          <Link href="/" color="inherit" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: 12 }}>
            <HomeIcon sx={{ fontSize: 14 }} /> Home
          </Link>
          {breadcrumbs.map((b, i) => (
            <Typography key={i} variant="caption" color="text.secondary">{b}</Typography>
          ))}
        </Breadcrumbs>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>{title}</Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {action && actionLabel && (
          <Button variant="contained" onClick={action} sx={{ flexShrink: 0 }}>
            {actionLabel}
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default PageHeader