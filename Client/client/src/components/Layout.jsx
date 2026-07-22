import { useState } from 'react'
import {
  Box, Drawer, IconButton, useMediaQuery, useTheme,
  AppBar, Toolbar, Typography, Avatar
} from '@mui/material'
import MenuIcon   from '@mui/icons-material/Menu'
import SchoolIcon from '@mui/icons-material/School'
import { useSelector } from 'react-redux'
import Sidebar from './Sidebar'

const DRAWER_WIDTH = 240

const Layout = ({ role, children }) => {
  const theme    = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { user } = useSelector((state) => state.auth)
  const [open, setOpen] = useState(false)

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>

      {/* Mobile AppBar */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{ zIndex: theme.zIndex.drawer + 1, bgcolor: 'primary.dark' }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={() => setOpen(true)}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
            <SchoolIcon sx={{ mr: 1 }} />
            <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1 }}>
              PMC Portal
            </Typography>
            <Avatar
              src={user?.photo}
              sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}
            >
              {user?.name?.charAt(0)}
            </Avatar>
          </Toolbar>
        </AppBar>
      )}

      {/* Mobile Drawer */}
      {isMobile ? (
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          variant="temporary"
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
            },
          }}
        >
          <Sidebar role={role} onClose={() => setOpen(false)} />
        </Drawer>
      ) : (
        <Box sx={{ width: DRAWER_WIDTH, flexShrink: 0 }}>
          <Sidebar role={role} />
        </Box>
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p:        { xs: 2, sm: 3 },
          mt:       { xs: 8, md: 0 },
          bgcolor:  'background.default',
          minHeight: '100vh',
          overflow: 'auto',
          maxWidth:  '100%',
        }}
      >
        <Box className="fade-in">
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export default Layout