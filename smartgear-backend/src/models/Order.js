import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
})

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentReference: {
    type: String,
    sparse: true
  },
  shippingAddress: {
    fullName: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    region: {
      type: String,
      required: true
    }
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
})

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments()
    this.orderNumber = `ORD-${String(count + 1).padStart(6, '0')}`
  }
  next()
})

// Virtual for formatted order number
orderSchema.virtual('formattedOrderNumber').get(function() {
  return `#${this.orderNumber}`
})

// Static method to get user's orders
orderSchema.statics.findByUser = function(userId, options = {}) {
  const { page = 1, limit = 10, status } = options
  const query = { user: userId }
  
  if (status) {
    query.status = status
  }
  
  const skip = (page - 1) * limit
  
  return this.find(query)
    .populate('items.product', 'name image')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
}

// Static method to get user's order statistics
orderSchema.statics.getUserStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: '$totalAmount' },
        pendingOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        completedOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
        }
      }
    }
  ])
  
  return stats[0] || {
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
    completedOrders: 0
  }
}

const Order = mongoose.model('Order', orderSchema)

export default Order