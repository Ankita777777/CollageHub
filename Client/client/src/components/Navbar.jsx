import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { logout } from '../features/auth/authSlice'
import {
  AppBar, Toolbar, Typography, Button, IconButton,
  Menu, MenuItem, Avatar, Box, Drawer, List,
  ListItemButton, ListItemText, useMediaQuery, useTheme
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import SchoolIcon from '@mui/icons-material/School'

const navLinks = [
  { label: 'Home',       path: '/' },
  { label: 'About',      path: '/about' },
  { label: 'Courses',    path: '/courses' },
  { label: 'Admissions', path: '/admissions' },
  { label: 'Contact',    path: '/contact' },
]

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [anchorEl, setAnchorEl] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const navLinks = [
  { label: 'Home',         path: '/' },
  { label: 'About',        path: '/about' },
  { label: 'Courses',      path: '/courses' },
  { label: 'Result Check', path: '/results/check' },  // NEW
  { label: 'Admissions',   path: '/admissions' },
  { label: 'Contact',      path: '/contact' },
]
  const getDashboardPath = () => {
    if (!user) return '/login'
    return `/${user.role}/dashboard`
  }

  return (
    <>
      <AppBar position="sticky" elevation={1} sx={{ bgcolor: 'white', color: 'primary.main' }}>
        <Toolbar>
          <SchoolIcon sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1 }}>
            PMC College
          </Typography>

          {isMobile ? (
            <IconButton onClick={() => setDrawerOpen(true)} color="primary">
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {navLinks.map((link) => (
                <Button key={link.label} component={Link} to={link.path} color="inherit">
                  {link.label}
                </Button>
              ))}

              {user ? (
                <>
                  <Button variant="outlined" size="small" onClick={() => navigate(getDashboardPath())}>
                    Dashboard
                  </Button>
                  <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                      {user.name?.charAt(0)}
                    </Avatar>
                  </IconButton>
                  <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                    <MenuItem disabled>{user.name}</MenuItem>
                    <MenuItem onClick={() => navigate(getDashboardPath())}>Dashboard</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <Button variant="contained" onClick={() => navigate('/login')}>Login</Button>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 240, pt: 2 }}>
          <Typography variant="h6" fontWeight={700} sx={{ px: 2, mb: 1 }}>PMC College</Typography>
          <List>
            {navLinks.map((link) => (
              <ListItemButton key={link.label} component={Link} to={link.path}
                onClick={() => setDrawerOpen(false)}>
                <ListItemText primary={link.label} />
              </ListItemButton>
            ))}
            {user ? (
              <>
                <ListItemButton onClick={() => { navigate(getDashboardPath()); setDrawerOpen(false) }}>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
                <ListItemButton onClick={handleLogout}>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </>
            ) : (
              <ListItemButton onClick={() => { navigate('/login'); setDrawerOpen(false) }}>
                <ListItemText primary="Login" />
              </ListItemButton>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  )
}

export default Navbar