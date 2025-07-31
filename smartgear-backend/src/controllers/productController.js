import Product from '../models/Product.js'
import { validateProduct } from '../utils/validators.js'

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      inStock,
      featured,
      search,
      sort = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 20
    } = req.query

    // Build query
    const query = {}

    if (category) {
      query.category = category.toLowerCase()
    }

    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number(minPrice)
      if (maxPrice) query.price.$lte = Number(maxPrice)
    }

    if (inStock !== undefined) {
      query.inStock = inStock === 'true'
    }

    if (featured !== undefined) {
      query.featured = featured === 'true'
    }

    if (search) {
      query.$text = { $search: search }
    }

    // Execute query
    const sortOrder = order === 'desc' ? -1 : 1
    const sortObj = { [sort]: sortOrder }

    const pageNum = Math.max(1, Number(page))
    const limitNum = Math.min(50, Math.max(1, Number(limit)))
    const skip = (pageNum - 1) * limitNum

    const products = await Product.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .lean()

    const total = await Product.countDocuments(query)
    const totalPages = Math.ceil(total / limitNum)

    res.status(200).json({
      status: 'success',
      data: {
        products,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params

    // Check if ID is a valid MongoDB ObjectId
    if (!id || id === 'undefined' || id.length !== 24) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid product ID'
      })
    }

    const product = await Product.findById(id)

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      })
    }

    res.status(200).json({
      status: 'success',
      data: { product }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Admin)
export const createProduct = async (req, res, next) => {
  try {
    // Validate input
    const { error } = validateProduct(req.body)
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: error.details[0].message
      })
    }

    const product = await Product.create(req.body)

    res.status(201).json({
      status: 'success',
      data: { product }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin)
export const updateProduct = async (req, res, next) => {
  try {
    // Validate input
    const { error } = validateProduct(req.body)
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: error.details[0].message
      })
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      })
    }

    res.status(200).json({
      status: 'success',
      data: { product }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin)
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      })
    }

    res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
export const getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params
    const { limit = 20, sort = 'createdAt', order = 'desc' } = req.query

    const products = await Product.find({ 
      category: category.toLowerCase(),
      inStock: true 
    })
      .sort({ [sort]: order === 'desc' ? -1 : 1 })
      .limit(Number(limit))
      .lean()

    res.status(200).json({
      status: 'success',
      data: { products, count: products.length }
    })
  } catch (error) {
    next(error)
  }
}