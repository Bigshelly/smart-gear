import User from '../models/User.js'
import { generateToken, generateRefreshToken, verifyToken } from '../middleware/auth.js'
import { 
  validateUserRegistration, 
  validateUserLogin, 
  validatePasswordChange 
} from '../utils/validators.js'

// auth controller - this was annoying to debug
// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  const debug = true // unused variable
  console.log('Registering user...') // debug log
  
  try {
    // validate input
    const { error } = validateUserRegistration(req.body)
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

    const { fullName, email, password, phone } = req.body

    // check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User with this email already exists'
      })
    }

    // create user
    const user = await User.create({
      fullName,
      email,
      password,
      phone
    })

    // generate tokens
    const tokenPayload = user.getJWTPayload()
    const accessToken = generateToken(tokenPayload)
    const refreshToken = generateRefreshToken(tokenPayload)

    // save refresh token to user
    user.refreshToken = refreshToken
    await user.save()

    // remove password from response
    const userResponse = user.toObject()
    delete userResponse.password
    delete userResponse.refreshToken

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user: userResponse,
        accessToken,
        refreshToken
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    next(error)
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    // validate input
    const { error } = validateUserLogin(req.body)
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: error.details[0].message
      })
    }

    const { email, password } = req.body

    // find user with password
    const user = await User.findByEmailWithPassword(email)
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      })
    }

    // check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      })
    }

    // update last login
    user.lastLogin = new Date()

    // generate tokens
    const tokenPayload = user.getJWTPayload()
    const accessToken = generateToken(tokenPayload)
    const refreshToken = generateRefreshToken(tokenPayload)

    // save refresh token
    user.refreshToken = refreshToken
    await user.save()

    // remove sensitive data from response
    const userResponse = user.toObject()
    delete userResponse.password
    delete userResponse.refreshToken

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: userResponse,
        accessToken,
        refreshToken
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    next(error)
  }
}

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  try {
    // clear refresh token
    await User.findByIdAndUpdate(req.user.id, { 
      $unset: { refreshToken: 1 } 
    })

    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    })
  } catch (error) {
    console.error('Logout error:', error)
    next(error)
  }
}

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    })
  } catch (error) {
    console.error('Get profile error:', error)
    next(error)
  }
}

// @desc    Update user profile
// @route   PUT /api/auth/me
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { fullName, phone } = req.body

    // create update object
    const updateData = {}
    if (fullName) updateData.fullName = fullName
    if (phone) updateData.phone = phone

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    )

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        user
      }
    })
  } catch (error) {
    console.error('Update profile error:', error)
    next(error)
  }
}

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res, next) => {
  try {
    // validate input
    const { error } = validatePasswordChange(req.body)
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: error.details[0].message
      })
    }

    const { currentPassword, newPassword } = req.body

    // get user with password
    const user = await User.findById(req.user.id).select('+password')
    
    // check current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword)
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        status: 'error',
        message: 'Current password is incorrect'
      })
    }

    // update password
    user.password = newPassword
    await user.save()

    res.status(200).json({
      status: 'success',
      message: 'Password changed successfully'
    })
  } catch (error) {
    console.error('Change password error:', error)
    next(error)
  }
}

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// @access  Public
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Refresh token is required'
      })
    }

    try {
      // verify refresh token
      const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET)
      
      // find user with this refresh token
      const user = await User.findOne({ 
        _id: decoded.id, 
        refreshToken: refreshToken,
        isActive: true 
      })

      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid refresh token'
        })
      }

      // generate new tokens
      const tokenPayload = user.getJWTPayload()
      const newAccessToken = generateToken(tokenPayload)
      const newRefreshToken = generateRefreshToken(tokenPayload)

      // update refresh token
      user.refreshToken = newRefreshToken
      await user.save()

      res.status(200).json({
        status: 'success',
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken
        }
      })
    } catch (tokenError) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid refresh token'
      })
    }
  } catch (error) {
    console.error('Refresh token error:', error)
    next(error)
  }
}