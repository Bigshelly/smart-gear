import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

// user model - found this online
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Full name must be at least 2 characters'],
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // dont include password in queries by default
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^(\+233|0)[0-9]{9}$/, 'Please provide a valid Ghana phone number']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  refreshToken: {
    type: String,
    select: false
  }
}, {
  timestamps: true
})

// hash password before saving
userSchema.pre('save', async function(next) {
  // only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next()

  // hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

// instance method to generate jwt payload
userSchema.methods.getJWTPayload = function() {
  return {
    id: this._id,
    email: this.email,
    fullName: this.fullName,
    role: this.role
  }
}

// static method to find user by email with password
userSchema.statics.findByEmailWithPassword = function(email) {
  return this.findOne({ email, isActive: true }).select('+password')
}

const User = mongoose.model('User', userSchema)

export default User