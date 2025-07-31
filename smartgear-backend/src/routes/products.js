import express from 'express'
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory
} from '../controllers/productController.js'

const router = express.Router()

// Public routes
router.get('/', getProducts)
router.get('/category/:category', getProductsByCategory)
router.get('/:id', getProduct)

// Admin routes (TODO: Add authentication middleware)
router.post('/', createProduct)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)

export default router