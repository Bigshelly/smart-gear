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

const router = express.Router()

// Public routes
router.post('/register', register)
router.post('/login', login)
router.post('/refresh-token', refreshToken)

// Protected routes
router.use(protect) // All routes after this middleware are protected

router.post('/logout', logout)
router.get('/me', getMe)
router.put('/me', updateProfile)
router.put('/change-password', changePassword)

export default router