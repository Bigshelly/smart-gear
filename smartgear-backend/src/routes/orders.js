import express from 'express'
import {
  createOrder,
  getUserOrders,
  getOrder,
  getUserOrderStats,
  updateOrderStatus
} from '../controllers/orderController.js'
import { protect, restrictTo } from '../middleware/auth.js'

const router = express.Router()

// All order routes require authentication
router.use(protect)

// @route   GET /api/orders/stats
// @desc    Get user's order statistics
// @access  Private
router.get('/stats', getUserOrderStats)

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', getUserOrders)

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', createOrder)

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', getOrder)

// @route   PUT /api/orders/:id/status
// @desc    Update order status (admin only)
// @access  Private/Admin
router.put('/:id/status', restrictTo('admin'), updateOrderStatus)

export default router