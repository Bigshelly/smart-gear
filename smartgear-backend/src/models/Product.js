import mongoose from 'mongoose'

// product model - found this online
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    maxlength: [1000, 'Product description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  currency: {
    type: String,
    default: 'GHS',
    enum: ['GHS', 'USD', 'EUR'],
    uppercase: true
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['smartphones', 'laptops', 'audio', 'tablets', 'wearables'],
    lowercase: true
  },
  image: {
    type: String,
    required: [true, 'Product image URL is required'],
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v)
      },
      message: 'Please provide a valid image URL'
    }
  },
  specs: [{
    type: String,
    trim: true,
    maxlength: [200, 'Spec cannot exceed 200 characters']
  }],
  inStock: {
    type: Boolean,
    default: true
  },
  stockQuantity: {
    type: Number,
    default: 0,
    min: [0, 'Stock quantity cannot be negative']
  },
  featured: {
    type: Boolean,
    default: false
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// indexes for better query performance
productSchema.index({ category: 1 })
productSchema.index({ price: 1 })
productSchema.index({ inStock: 1 })
productSchema.index({ featured: 1 })
productSchema.index({ name: 'text', description: 'text' })

// virtual for formatted price
productSchema.virtual('formattedPrice').get(function() {
  return `${this.currency} ${this.price.toLocaleString('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`
})

// update instock based on stockquantity
productSchema.pre('save', function(next) {
  if (this.stockQuantity <= 0) {
    this.inStock = false
  }
  next()
})

const Product = mongoose.model('Product', productSchema)

export default Product