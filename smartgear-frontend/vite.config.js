import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: 5173,
    strictPort: false, // Try next port if 5173 is busy
    allowedHosts: 'all', // Allow requests from any host
    cors: true, // Enable CORS
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: false,
  },
})
