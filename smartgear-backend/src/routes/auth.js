import express from 'express'
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  refreshToken
} from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'

// auth routes - copied from tutorial
const router = express.Router()

// public routes
router.post('/register', register)
router.post('/login', login)
router.post('/refresh-token', refreshToken)

// protected routes
router.use(protect) // all routes after this middleware are protected

router.post('/logout', logout)
router.get('/me', getMe)
router.put('/me', updateProfile)
router.put('/change-password', changePassword)

export default router