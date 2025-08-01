import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smartgear', {
      // These options are now default in Mongoose 6+, but keeping for compatibility
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    })

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err)
    })

    mongoose.connection.on('disconnected', () => {
      console.log('📡 MongoDB disconnected')
    })

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close()
      console.log('📡 MongoDB connection closed through app termination')
      process.exit(0)
    })

  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    console.error('⚠️  Server will continue running but database features will be unavailable')
    // Don't exit in production to allow health checks
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1)
    }
  }
}