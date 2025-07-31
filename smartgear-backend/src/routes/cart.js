import express from 'express'
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  cleanupCart,
  getCartCount
} from '../controllers/cartController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// All cart routes require authentication
router.use(protect)

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', getCart)

// @route   GET /api/cart/count
// @desc    Get cart item count
// @access  Private
router.get('/count', getCartCount)

// @route   POST /api/cart/items
// @desc    Add item to cart
// @access  Private
router.post('/items', addToCart)

// @route   POST /api/cart/cleanup
// @desc    Clean up duplicate items in cart
// @access  Private
router.post('/cleanup', cleanupCart)

// @route   PUT /api/cart/items/:productId
// @desc    Update cart item quantity
// @access  Private
router.put('/items/:productId', updateCartItem)

// @route   DELETE /api/cart/items/:productId
// @desc    Remove item from cart
// @access  Private
router.delete('/items/:productId', removeFromCart)

// @route   DELETE /api/cart
// @desc    Clear cart
// @access  Private
router.delete('/', clearCart)

export default router