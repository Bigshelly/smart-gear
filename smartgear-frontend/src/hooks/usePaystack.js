import { useState, useCallback } from 'react'
import { initializePayment, verifyPayment } from '../services/api'

const usePaystack = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [paymentData, setPaymentData] = useState(null)

  const initializePaystackPayment = useCallback(async (paymentInfo) => {
    setLoading(true)
    setError(null)
    
    try {
      const paymentPayload = {
        email: paymentInfo.email,
        amount: paymentInfo.amount,
        currency: paymentInfo.currency || 'GHS',
        customerName: paymentInfo.customerName,
        phone: paymentInfo.phone,
        reference: `smartgear_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        callback_url: `${window.location.origin}/success`,
        channels: ['card', 'mobile_money'],
      }

      // Add product or cart items based on payment type
      if (paymentInfo.cartItems) {
        // Cart checkout
        paymentPayload.cartItems = paymentInfo.cartItems
        paymentPayload.metadata = {
          customer_name: paymentInfo.customerName,
          customer_phone: paymentInfo.phone,
          user_id: paymentInfo.userId, // Include user ID for backend cart clearing
          checkout_type: 'cart',
          item_count: paymentInfo.cartItems.length,
        }
      } else if (paymentInfo.productId) {
        // Single product checkout
        paymentPayload.productId = paymentInfo.productId
        paymentPayload.metadata = {
          customer_name: paymentInfo.customerName,
          customer_phone: paymentInfo.phone,
          user_id: paymentInfo.userId, // Include user ID for backend cart clearing
          product_id: paymentInfo.productId,
          product_name: paymentInfo.productName,
          checkout_type: 'single',
        }
      } else {
        throw new Error('Either productId or cartItems must be provided')
      }

      // Initialize payment with backend
      const response = await initializePayment(paymentPayload)
      
      if (response.status && response.data) {
        setPaymentData({
          reference: response.data.reference,
          authorizationUrl: response.data.authorization_url,
          accessCode: response.data.access_code,
        })
        
        // Redirect to Paystack payment page
        window.location.href = response.data.authorization_url
        
        return {
          success: true,
          data: response.data,
        }
      } else {
        throw new Error(response.message || 'Failed to initialize payment')
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Payment initialization failed'
      setError(errorMessage)
      return {
        success: false,
        error: errorMessage,
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const verifyPaystackPayment = useCallback(async (reference) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await verifyPayment(reference)
      
      if (response.status && response.data) {
        return {
          success: true,
          data: response.data,
          status: response.data.status,
        }
      } else {
        throw new Error(response.message || 'Payment verification failed')
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Payment verification failed'
      setError(errorMessage)
      return {
        success: false,
        error: errorMessage,
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const resetPaymentState = useCallback(() => {
    setLoading(false)
    setError(null)
    setPaymentData(null)
  }, [])

  return {
    loading,
    error,
    paymentData,
    initializePayment: initializePaystackPayment,
    verifyPayment: verifyPaystackPayment,
    resetPaymentState,
  }
}

export default usePaystack