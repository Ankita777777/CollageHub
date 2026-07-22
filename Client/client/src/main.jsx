import React              from 'react'
import ReactDOM           from 'react-dom/client'
import App                from './App'
import { Provider }       from 'react-redux'
import { store }          from './store/store'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { HelmetProvider } from 'react-helmet-async'
import { ToastContainer } from 'react-toastify'
import theme              from './theme'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            draggable
            theme="colored"
          />
        </ThemeProvider>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
)