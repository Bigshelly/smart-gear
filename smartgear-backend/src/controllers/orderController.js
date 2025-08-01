import Order from '../models/Order.js'
import Cart from '../models/Cart.js'
import Product from '../models/Product.js'

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentReference, notes } = req.body
    
    // Validate required fields
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || 
        !shippingAddress.address || !shippingAddress.city || !shippingAddress.region) {
      return res.status(400).json({
        status: 'error',
        message: 'Complete shipping address is required'
      })
    }
    
    // Get user's cart
    const cart = await Cart.findByUser(req.user.id)
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Cart is empty'
      })
    }
    
    // Verify all products are still available and get current prices
    const orderItems = []
    let totalAmount = 0
    
    for (const cartItem of cart.items) {
      const product = await Product.findById(cartItem.product)
      if (!product) {
        return res.status(400).json({
          status: 'error',
          message: `Product ${cartItem.name} no longer exists`
        })
      }
      
      if (!product.inStock || product.stockQuantity < cartItem.quantity) {
        return res.status(400).json({
          status: 'error',
          message: `Product ${product.name} is out of stock`
        })
      }
      
      const orderItem = {
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price, // Use current price
        quantity: cartItem.quantity
      }
      
      orderItems.push(orderItem)
      totalAmount += product.price * cartItem.quantity
    }
    
    // Create order
    const order = new Order({
      user: req.user.id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentReference,
      notes,
      status: paymentReference ? 'processing' : 'pending',
      paymentStatus: paymentReference ? 'paid' : 'pending'
    })
    
    await order.save()
    
    // Update product stock quantities
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stockQuantity: -item.quantity } }
      )
    }
    
    // Clear user's cart
    await Cart.findOneAndDelete({ user: req.user.id })
    
    // Populate order data
    await order.populate('items.product', 'name image category')
    
    res.status(201).json({
      status: 'success',
      data: {
        order
      }
    })
  } catch (error) {
    console.error('Create order error:', error)
    next(error)
  }
}

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
export const getUserOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query
    
    const orders = await Order.findByUser(req.user.id, {
      page: parseInt(page),
      limit: parseInt(limit),
      status
    })
    
    // Get total count for pagination
    const query = { user: req.user.id }
    if (status) query.status = status
    const total = await Order.countDocuments(query)
    
    res.status(200).json({
      status: 'success',
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    })
  } catch (error) {
    console.error('Get user orders error:', error)
    next(error)
  }
}

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('items.product', 'name image category')
    
    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      })
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        order
      }
    })
  } catch (error) {
    console.error('Get order error:', error)
    next(error)
  }
}

// @desc    Get user's order statistics
// @route   GET /api/orders/stats
// @access  Private
export const getUserOrderStats = async (req, res, next) => {
  try {
    const stats = await Order.getUserStats(req.user.id)
    
    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    })
  } catch (error) {
    console.error('Get user stats error:', error)
    next(error)
  }
}

// @desc    Update order status (admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body
    
    if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid status'
      })
    }
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('items.product', 'name image')
    
    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      })
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        order
      }
    })
  } catch (error) {
    console.error('Update order status error:', error)
    next(error)
  }
}