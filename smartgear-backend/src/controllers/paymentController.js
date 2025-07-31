import axios from 'axios'
import { validatePaymentInit } from '../utils/validators.js'
import Cart from '../models/Cart.js'

const PAYSTACK_BASE_URL = 'https://api.paystack.co'

// @desc    Initialize payment
// @route   POST /api/payments/initialize
// @access  Public
export const initializePayment = async (req, res, next) => {
  try {
    // Validate input
    const { error } = validatePaymentInit(req.body)
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: error.details[0].message
      })
    }

    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY
    
    if (!PAYSTACK_SECRET_KEY) {
      console.error('PAYSTACK_SECRET_KEY is not defined!')
      return res.status(500).json({
        status: 'error',
        message: 'Paystack secret key not configured'
      })
    }

    console.log('✅ Paystack secret key loaded successfully')

    const {
      email,
      amount,
      currency = 'GHS',
      productId,
      cartItems,
      customerName,
      phone,
      callback_url,
      metadata = {}
    } = req.body

    // Generate reference if not provided
    const reference = req.body.reference || `smartgear_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Prepare Paystack payload
    const paystackPayload = {
      email,
      amount: parseInt(amount * 100), // Convert to pesewas (smallest currency unit)
      currency,
      reference,
      callback_url,
      metadata: {
        ...metadata,
        customerName,
        phone,
        ...(productId ? { productId } : {}),
        ...(cartItems ? { 
          cartItems,
          totalAmount: amount,
          itemCount: cartItems.reduce((total, item) => total + item.quantity, 0)
        } : {})
      }
    }

    console.log('Initializing Paystack payment:', paystackPayload)

    // Make request to Paystack API
    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      paystackPayload,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (response.data.status) {
      // TODO: Save payment record to database
      
      res.status(200).json({
        status: 'success',
        data: response.data.data
      })
    } else {
      res.status(400).json({
        status: 'error',
        message: response.data.message || 'Failed to initialize payment'
      })
    }
  } catch (error) {
    console.error('Paystack initialization error:', error.response?.data || error.message)
    
    if (error.response?.data) {
      return res.status(error.response.status || 400).json({
        status: 'error',
        message: error.response.data.message || 'Payment initialization failed'
      })
    }
    
    next(error)
  }
}

// @desc    Verify payment
// @route   GET /api/payments/verify/:reference
// @access  Public
export const verifyPayment = async (req, res, next) => {
  try {
    const { reference } = req.params

    if (!reference) {
      return res.status(400).json({
        status: 'error',
        message: 'Payment reference is required'
      })
    }

    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY
    
    if (!PAYSTACK_SECRET_KEY) {
      return res.status(500).json({
        status: 'error',
        message: 'Paystack secret key not configured'
      })
    }

    console.log('Verifying Paystack payment:', reference)

    // Verify payment with Paystack
    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (response.data.status) {
      const paymentData = response.data.data
      
      // Clear user's cart if payment is successful and it's a cart checkout
      try {
        const userId = paymentData.metadata?.user_id
        const checkoutType = paymentData.metadata?.checkout_type
        
        if (userId && checkoutType === 'cart' && paymentData.status === 'success') {
          console.log(`Clearing cart for user ${userId} after successful payment`)
          const cart = await Cart.findByUser(userId)
          if (cart) {
            await cart.clearCart()
            console.log('✅ Cart cleared successfully after payment')
          }
        }
      } catch (cartError) {
        console.error('Error clearing cart after payment:', cartError)
        // Don't fail the payment verification if cart clearing fails
      }
      
      // TODO: Update payment record in database
      
      res.status(200).json({
        status: 'success',
        data: paymentData
      })
    } else {
      res.status(400).json({
        status: 'error',
        message: response.data.message || 'Payment verification failed'
      })
    }
  } catch (error) {
    console.error('Paystack verification error:', error.response?.data || error.message)
    
    if (error.response?.data) {
      return res.status(error.response.status || 400).json({
        status: 'error',
        message: error.response.data.message || 'Payment verification failed'
      })
    }
    
    next(error)
  }
}

// @desc    Handle Paystack webhook
// @route   POST /api/payments/webhook
// @access  Public (Paystack webhook)
export const handleWebhook = async (req, res, next) => {
  try {
    // TODO: Verify webhook signature
    // TODO: Process payment events (charge.success, etc.)
    
    console.log('Webhook received:', req.body)

    res.status(200).json({
      status: 'success',
      message: 'Webhook processed'
    })
  } catch (error) {
    next(error)
  }
}