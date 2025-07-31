import express from 'express'
import {
  initializePayment,
  verifyPayment,
  handleWebhook
} from '../controllers/paymentController.js'

const router = express.Router()

// Payment routes
router.post('/initialize', initializePayment)
router.get('/verify/:reference', verifyPayment)
router.post('/webhook', handleWebhook)

export default router