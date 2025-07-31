import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { connectDB } from './src/config/database.js'
import { errorHandler } from './src/middleware/errorHandler.js'

// Import routes
import productRoutes from './src/routes/products.js'
import paymentRoutes from './src/routes/payments.js'
import authRoutes from './src/routes/auth.js'
import cartRoutes from './src/routes/cart.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Connect to database
connectDB()

// Middleware
app.use(helmet())
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://10.228.1.91:5173',
      process.env.FRONTEND_URL
    ].filter(Boolean)
    
    // Remove trailing slashes and check
    const normalizedOrigin = origin.replace(/\/$/, '')
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      const normalizedAllowed = allowedOrigin.replace(/\/$/, '')
      return normalizedAllowed === normalizedOrigin
    })
    
    if (isAllowed) {
      callback(null, true)
    } else {
      console.log('CORS blocked origin:', origin)
      console.log('Allowed origins:', allowedOrigins)
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning']
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/products', productRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/cart', cartRoutes)

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'SmartGear API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT
  })
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'SmartGear API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// Basic health check without database dependency
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`
  })
})

// Global error handler
app.use(errorHandler)

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 SmartGear API server running on port ${PORT}`)
  console.log(`🔧 PORT from env: ${process.env.PORT || 'undefined'}`)
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🌐 Server listening on 0.0.0.0:${PORT}`)
})

export default app