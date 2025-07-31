import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Generate JWT token
export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  })
}

// Generate refresh token
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d'
  })
}

// Verify JWT token
export const verifyToken = (token, secret = process.env.JWT_SECRET) => {
  return jwt.verify(token, secret)
}

// Middleware to protect routes
export const protect = async (req, res, next) => {
  try {
    let token

    // Check for token in header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. No token provided.'
      })
    }

    try {
      // Verify token
      const decoded = verifyToken(token)
      
      // Get user from token
      const user = await User.findById(decoded.id).select('-password -refreshToken')
      
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'Token is valid but user no longer exists'
        })
      }

      if (!user.isActive) {
        return res.status(401).json({
          status: 'error',
          message: 'User account is deactivated'
        })
      }

      // Add user to request
      req.user = user
      next()
    } catch (tokenError) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token'
      })
    }
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Server error in authentication middleware'
    })
  }
}

// Middleware to restrict to specific roles
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Insufficient permissions.'
      })
    }
    next()
  }
}

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuth = async (req, res, next) => {
  try {
    let token

    // Check for token in header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (token) {
      try {
        // Verify token
        const decoded = verifyToken(token)
        
        // Get user from token
        const user = await User.findById(decoded.id).select('-password -refreshToken')
        
        if (user && user.isActive) {
          req.user = user
        }
      } catch (tokenError) {
        // Token invalid, but continue without user
        req.user = null
      }
    }

    next()
  } catch (error) {
    next()
  }
}