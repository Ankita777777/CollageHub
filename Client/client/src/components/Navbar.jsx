import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { logout } from '../features/auth/authSlice'
import {
  AppBar, Toolbar, Typography, Button, IconButton,
  Menu, MenuItem, Avatar, Box, Drawer, List,
  ListItemButton, ListItemText, useMediaQuery,
  useTheme, Divider, Chip, Badge
} from '@mui/material'
import MenuIcon          from '@mui/icons-material/Menu'
import SchoolIcon        from '@mui/icons-material/School'
import CloseIcon         from '@mui/icons-material/Close'
import DashboardIcon     from '@mui/icons-material/Dashboard'
import LogoutIcon        from '@mui/icons-material/Logout'
import { toast }         from 'react-toastify'

const navLinks = [
  { label: 'Home',         path: '/'               },
  { label: 'About',        path: '/about'          },
  { label: 'Programs',     path: '/courses'        },
  { label: 'Result Check', path: '/results/check'  },
  { label: 'Admissions',   path: '/admissions'     },
  { label: 'Notices',      path: '/notices'        },
  { label: 'Contact',      path: '/contact'        },
]

const Navbar = () => {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const location  = useLocation()
  const { user }  = useSelector((state) => state.auth)
  const theme     = useTheme()
  const isMobile  = useMediaQuery(theme.breakpoints.down('md'))

  const [anchorEl,    setAnchorEl]    = useState(null)
  const [drawerOpen,  setDrawerOpen]  = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out successfully!')
    navigate('/')
    setAnchorEl(null)
  }

  const getDashboardPath = () => {
    if (!user) return '/login'
    return `/${user.role}/dashboard`
  }

  const isActive = (path) => location.pathname === path

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor:      'white',
          borderBottom: '1px solid',
          borderColor:  'divider',
          color:        'text.primary',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
          {/* Logo */}
          <Box
            onClick={() => navigate('/')}
            sx={{
              display: 'flex', alignItems: 'center',
              gap: 1, cursor: 'pointer', mr: 3,
            }}
          >
            <Box sx={{
              bgcolor: 'primary.main', p: 0.8,
              borderRadius: 1.5, color: 'white',
              display: 'flex',
            }}>
              <SchoolIcon sx={{ fontSize: 22 }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                fontWeight={800}
                color="primary.main"
                sx={{ lineHeight: 1.1, fontSize: { xs: 15, md: 18 } }}
              >
                PMC College
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: { xs: 'none', sm: 'block' }, fontSize: 10 }}
              >
                Pokhara Management College
              </Typography>
            </Box>
          </Box>

          {/* Desktop Nav */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexGrow: 1 }}>
              {navLinks.map((link) => (
                <Button
                  key={link.label}
                  component={Link}
                  to={link.path}
                  size="small"
                  sx={{
                    color:       isActive(link.path) ? 'primary.main' : 'text.secondary',
                    fontWeight:  isActive(link.path) ? 700 : 500,
                    borderBottom: isActive(link.path) ? '2px solid' : '2px solid transparent',
                    borderRadius: 0,
                    px: 1.5, pb: 0.5,
                    fontSize: 13,
                    '&:hover': { color: 'primary.main', bgcolor: 'transparent' },
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ flexGrow: isMobile ? 1 : 0 }} />

          {/* User Actions */}
          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {!isMobile && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<DashboardIcon />}
                  onClick={() => navigate(getDashboardPath())}
                  sx={{ fontSize: 12 }}
                >
                  Dashboard
                </Button>
              )}
              <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                size="small"
              >
                <Avatar
                  src={user.photo}
                  sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: 14 }}
                >
                  {user.name?.charAt(0)}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                PaperProps={{ sx: { minWidth: 180, mt: 1 } }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="body2" fontWeight={700}>{user.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                  <Chip
                    label={user.role}
                    size="small"
                    color="primary"
                    sx={{ mt: 0.5, display: 'block', textTransform: 'capitalize' }}
                  />
                </Box>
                <Divider />
                <MenuItem onClick={() => { navigate(getDashboardPath()); setAnchorEl(null) }}>
                  <DashboardIcon fontSize="small" sx={{ mr: 1 }} /> Dashboard
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                  <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            !isMobile && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => navigate('/admissions')}
                >
                  Apply Now
                </Button>
              </Box>
            )
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton onClick={() => setDrawerOpen(true)} sx={{ ml: 1 }}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 280 } }}
      >
        <Box sx={{ bgcolor: 'primary.main', p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={700} color="white">PMC College</Typography>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* User info in drawer */}
        {user && (
          <Box sx={{ p: 2, bgcolor: '#f5f7fa', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar src={user.photo} sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
              {user.name?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={700}>{user.name}</Typography>
              <Chip label={user.role} size="small" color="primary" sx={{ textTransform: 'capitalize' }} />
            </Box>
          </Box>
        )}

        <Divider />

        <List sx={{ flexGrow: 1 }}>
          {navLinks.map((link) => (
            <ListItemButton
              key={link.label}
              component={Link}
              to={link.path}
              onClick={() => setDrawerOpen(false)}
              selected={isActive(link.path)}
            >
              <ListItemText
                primary={link.label}
                primaryTypographyProps={{ fontWeight: isActive(link.path) ? 700 : 500 }}
              />
            </ListItemButton>
          ))}
        </List>

        <Divider />
        <Box sx={{ p: 2 }}>
          {user ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<DashboardIcon />}
                onClick={() => { navigate(getDashboardPath()); setDrawerOpen(false) }}
              >
                My Dashboard
              </Button>
              <Button
                variant="outlined"
                color="error"
                fullWidth
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => { navigate('/login'); setDrawerOpen(false) }}
              >
                Login
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => { navigate('/admissions'); setDrawerOpen(false) }}
              >
                Apply Now
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  )
}

export default Navbar