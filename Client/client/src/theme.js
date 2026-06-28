import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main:  '#1565C0',
      light: '#1E88E5',
      dark:  '#0D47A1',
    },
    secondary: {
      main: '#FF6F00',
    },
    background: {
      default: '#F5F7FA',
    },
  },
  typography: {
    fontFamily: `'Poppins', 'Roboto', sans-serif`,
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', borderRadius: 8 }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }
      }
    }
  }
})

export default theme