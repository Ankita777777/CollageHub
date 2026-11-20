import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    rolldownOptions: {
      output: {
        advancedChunks: {
          groups: [
            { name: 'vendor', test: /node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/ },
            { name: 'mui',    test: /node_modules[\\/]@mui[\\/]/ },
            { name: 'redux',  test: /node_modules[\\/](@reduxjs[\\/]toolkit|react-redux|redux|immer|reselect)[\\/]/ },
            { name: 'charts', test: /node_modules[\\/](recharts|d3-[^\\/]+|victory-vendor)[\\/]/ },
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})