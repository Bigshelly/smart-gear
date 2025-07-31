import Cart from '../models/Cart.js'
import Product from '../models/Product.js'
import { validateCartItem, validateCartUpdate } from '../utils/validators.js'

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findByUser(req.user.id)
    
    if (!cart) {
      return res.status(200).json({
        status: 'success',
        data: {
          cart: {
            items: [],
            totalAmount: 0,
            totalItems: 0
          }
        }
      })
    }

    res.status(200).json({
      status: 'success',
      data: {
        cart: {
          id: cart._id,
          items: cart.items,
          totalAmount: cart.totalAmount,
          totalItems: cart.totalItems,
          lastModified: cart.lastModified
        }
      }
    })
  } catch (error) {
    console.error('Get cart error:', error)
    next(error)
  }
}

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
export const addToCart = async (req, res, next) => {
  try {
    // Validate input
    const { error } = validateCartItem(req.body)
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: error.details[0].message,
        errors: error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
      })
    }

    const { productId, quantity = 1 } = req.body

    // Check if product exists and is in stock
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      })
    }

    if (!product.inStock) {
      return res.status(400).json({
        status: 'error',
        message: 'Product is out of stock'
      })
    }

    // Check if requested quantity is available
    if (product.stockQuantity && quantity > product.stockQuantity) {
      return res.status(400).json({
        status: 'error',
        message: `Only ${product.stockQuantity} items available in stock`
      })
    }

    // Get or create cart for user
    const cart = await Cart.findOrCreateByUser(req.user.id)

    // Check if adding this quantity would exceed limits
    const existingItem = cart.items.find(item => 
      item.product.toString() === productId.toString()
    )
    
    const newQuantity = existingItem ? existingItem.quantity + quantity : quantity
    if (newQuantity > 10) {
      return res.status(400).json({
        status: 'error',
        message: 'Maximum 10 items per product allowed'
      })
    }

    // Add item to cart
    await cart.addItem(productId, quantity, product.price)

    // Populate the cart with product details
    const updatedCart = await Cart.findByUser(req.user.id)

    res.status(200).json({
      status: 'success',
      message: `${product.name} added to cart`,
      data: {
        cart: {
          id: updatedCart._id,
          items: updatedCart.items,
          totalAmount: updatedCart.totalAmount,
          totalItems: updatedCart.totalItems,
          lastModified: updatedCart.lastModified
        }
      }
    })
  } catch (error) {
    console.error('Add to cart error:', error)
    next(error)
  }
}

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:productId
// @access  Private
export const updateCartItem = async (req, res, next) => {
  try {
    // Validate input
    const { error } = validateCartUpdate(req.body)
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: error.details[0].message
      })
    }

    const { productId } = req.params
    const { quantity } = req.body

    // Check if product exists
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      })
    }

    // Get user's cart
    const cart = await Cart.findByUser(req.user.id)
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart not found'
      })
    }

    // Check if item exists in cart
    const existingItem = cart.items.find(item => 
      item.product._id.toString() === productId.toString()
    )
    
    if (!existingItem) {
      return res.status(404).json({
        status: 'error',
        message: 'Item not found in cart'
      })
    }

    // Check stock availability
    if (quantity > 0 && product.stockQuantity && quantity > product.stockQuantity) {
      return res.status(400).json({
        status: 'error',
        message: `Only ${product.stockQuantity} items available in stock`
      })
    }

    // Update item quantity
    await cart.updateItem(productId, quantity)

    // Get updated cart
    const updatedCart = await Cart.findByUser(req.user.id)

    res.status(200).json({
      status: 'success',
      message: quantity > 0 ? 'Cart item updated' : 'Item removed from cart',
      data: {
        cart: {
          id: updatedCart._id,
          items: updatedCart.items,
          totalAmount: updatedCart.totalAmount,
          totalItems: updatedCart.totalItems,
          lastModified: updatedCart.lastModified
        }
      }
    })
  } catch (error) {
    console.error('Update cart item error:', error)
    next(error)
  }
}

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:productId
// @access  Private
export const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params

    // Get user's cart
    const cart = await Cart.findByUser(req.user.id)
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart not found'
      })
    }

    // Check if item exists in cart
    const existingItem = cart.items.find(item => 
      item.product._id.toString() === productId.toString()
    )
    
    if (!existingItem) {
      return res.status(404).json({
        status: 'error',
        message: 'Item not found in cart'
      })
    }

    // Remove item from cart
    await cart.removeItem(productId)

    // Get updated cart
    const updatedCart = await Cart.findByUser(req.user.id)

    res.status(200).json({
      status: 'success',
      message: 'Item removed from cart',
      data: {
        cart: {
          id: updatedCart._id,
          items: updatedCart.items,
          totalAmount: updatedCart.totalAmount,
          totalItems: updatedCart.totalItems,
          lastModified: updatedCart.lastModified
        }
      }
    })
  } catch (error) {
    console.error('Remove from cart error:', error)
    next(error)
  }
}

// @desc    Clean up duplicate items in cart
// @route   POST /api/cart/cleanup
// @access  Private
export const cleanupCart = async (req, res, next) => {
  try {
    const cart = await Cart.findByUser(req.user.id)
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart not found'
      })
    }

    // Group items by product ID and merge duplicates
    const productMap = new Map()

    cart.items.forEach(item => {
      const productId = item.product._id.toString()
      if (productMap.has(productId)) {
        // Add quantity to existing item
        const existingItem = productMap.get(productId)
        existingItem.quantity += item.quantity
      } else {
        // Add new item to map
        productMap.set(productId, {
          product: item.product._id,
          quantity: item.quantity,
          price: item.price,
          addedAt: item.addedAt
        })
      }
    })

    // Convert map back to array
    cart.items = Array.from(productMap.values())
    await cart.save()

    // Get updated cart with populated products
    const updatedCart = await Cart.findByUser(req.user.id)

    res.status(200).json({
      status: 'success',
      message: 'Cart cleaned up successfully',
      data: {
        cart: {
          id: updatedCart._id,
          items: updatedCart.items,
          totalAmount: updatedCart.totalAmount,
          totalItems: updatedCart.totalItems,
          lastModified: updatedCart.lastModified
        }
      }
    })
  } catch (error) {
    console.error('Cleanup cart error:', error)
    next(error)
  }
}

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res, next) => {
  try {
    // Get user's cart
    const cart = await Cart.findByUser(req.user.id)
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart not found'
      })
    }

    // Clear cart
    await cart.clearCart()

    res.status(200).json({
      status: 'success',
      message: 'Cart cleared successfully',
      data: {
        cart: {
          id: cart._id,
          items: [],
          totalAmount: 0,
          totalItems: 0,
          lastModified: cart.lastModified
        }
      }
    })
  } catch (error) {
    console.error('Clear cart error:', error)
    next(error)
  }
}

// @desc    Get cart item count
// @route   GET /api/cart/count
// @access  Private
export const getCartCount = async (req, res, next) => {
  try {
    const cart = await Cart.findByUser(req.user.id)
    
    const count = cart ? cart.totalItems : 0

    res.status(200).json({
      status: 'success',
      data: {
        count
      }
    })
  } catch (error) {
    console.error('Get cart count error:', error)
    next(error)
  }
}