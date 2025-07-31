import mongoose from 'mongoose'

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    max: [10, 'Maximum quantity per item is 10']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
})

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // One cart per user
  },
  items: [cartItemSchema],
  totalAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  totalItems: {
    type: Number,
    default: 0,
    min: 0
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Calculate totals before saving
cartSchema.pre('save', function(next) {
  if (this.items && this.items.length > 0) {
    this.totalAmount = this.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0)
  } else {
    this.totalAmount = 0
    this.totalItems = 0
  }
  this.lastModified = new Date()
  next()
})

// Instance method to add item to cart
cartSchema.methods.addItem = function(productId, quantity, price) {
  const existingItemIndex = this.items.findIndex(item => {
    const itemProductId = item.product._id ? item.product._id.toString() : item.product.toString()
    return itemProductId === productId.toString()
  })

  if (existingItemIndex >= 0) {
    // Update existing item quantity
    this.items[existingItemIndex].quantity += quantity
    this.items[existingItemIndex].price = price // Update price in case it changed
  } else {
    // Add new item
    this.items.push({
      product: productId,
      quantity,
      price,
      addedAt: new Date()
    })
  }

  return this.save()
}

// Instance method to update item quantity
cartSchema.methods.updateItem = function(productId, quantity) {
  const existingItemIndex = this.items.findIndex(item => {
    const itemProductId = item.product._id ? item.product._id.toString() : item.product.toString()
    return itemProductId === productId.toString()
  })

  if (existingItemIndex >= 0) {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      this.items.splice(existingItemIndex, 1)
    } else {
      // Update quantity
      this.items[existingItemIndex].quantity = quantity
    }
    return this.save()
  } else {
    throw new Error('Item not found in cart')
  }
}

// Instance method to remove item from cart
cartSchema.methods.removeItem = function(productId) {
  this.items = this.items.filter(item => {
    // Handle both ObjectId reference and populated product object
    const itemProductId = item.product._id ? item.product._id.toString() : item.product.toString()
    const targetProductId = productId.toString()
    return itemProductId !== targetProductId
  })
  
  return this.save()
}

// Instance method to clear cart
cartSchema.methods.clearCart = function() {
  this.items = []
  this.totalAmount = 0
  this.totalItems = 0
  return this.save()
}

// Static method to find cart by user
cartSchema.statics.findByUser = function(userId) {
  return this.findOne({ user: userId, isActive: true }).populate('items.product')
}

// Static method to create or get cart for user
cartSchema.statics.findOrCreateByUser = async function(userId) {
  let cart = await this.findByUser(userId)
  
  if (!cart) {
    cart = await this.create({
      user: userId,
      items: []
    })
  }
  
  return cart
}

const Cart = mongoose.model('Cart', cartSchema)

export default Cart