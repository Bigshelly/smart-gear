import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import PaymentStatus from '../components/PaymentStatus'
import usePaystack from '../hooks/usePaystack'
import { useCart } from '../context/CartContext'

const Success = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { verifyPayment } = usePaystack()
  const { clearCart } = useCart()
  const [paymentStatus, setPaymentStatus] = useState('loading')
  const [paymentDetails, setPaymentDetails] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [cartCleared, setCartCleared] = useState(false)

  useEffect(() => {
    const reference = searchParams.get('reference')
    const trxref = searchParams.get('trxref')
    
    // Get reference from either parameter
    const paymentReference = reference || trxref
    
    if (!paymentReference) {
      setPaymentStatus('error')
      setErrorMessage('No payment reference found')
      return
    }

    const verifyPaymentStatus = async () => {
      try {
        const result = await verifyPayment(paymentReference)
        
        if (result.success) {
          const { data } = result
          
          if (data.status === 'success') {
            setPaymentStatus('success')
            setPaymentDetails({
              reference: data.reference,
              amount: data.amount / 100, // Convert from pesewas to cedis
              productName: data.metadata?.product_name || 'SmartGear Product',
              customerEmail: data.customer?.email || '',
              transactionDate: data.created_at || new Date().toISOString(),
              gateway: data.gateway || 'Paystack',
              channel: data.authorization?.channel || 'card'
            })
            
            // Clear cart after successful payment (only once)
            if (!cartCleared) {
              clearCart(true) // Silent clear - no toast notification
              setCartCleared(true)
            }
          } else {
            setPaymentStatus('error')
            setErrorMessage(`Payment ${data.status}. Please contact support if you believe this is an error.`)
          }
        } else {
          setPaymentStatus('error')
          setErrorMessage(result.error || 'Payment verification failed')
        }
      } catch (error) {
        console.error('Payment verification error:', error)
        setPaymentStatus('error')
        setErrorMessage('Unable to verify payment. Please contact support.')
      }
    }

    verifyPaymentStatus()
  }, [searchParams, verifyPayment])

  const handleShare = () => {
    if (navigator.share && paymentDetails) {
      navigator.share({
        title: 'SmartGear Purchase',
        text: `I just purchased ${paymentDetails.productName} from SmartGear!`,
        url: window.location.origin,
      })
    } else {
      // Fallback to clipboard
      const shareText = `I just purchased ${paymentDetails?.productName || 'a product'} from SmartGear! Check them out at ${window.location.origin}`
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Share text copied to clipboard!')
      })
    }
  }

  const handleRetry = () => {
    navigate('/')
  }

  // Custom messages based on status
  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'success':
        return 'Thank you for your purchase! Your order has been confirmed and you will receive an email confirmation shortly.'
      case 'error':
        return errorMessage || 'There was an issue processing your payment. Please try again or contact our support team.'
      case 'loading':
      default:
        return 'We are verifying your payment with Paystack. This should only take a few seconds...'
    }
  }

  const getStatusTitle = () => {
    switch (paymentStatus) {
      case 'success':
        return 'Payment Successful! 🎉'
      case 'error':
        return 'Payment Verification Failed'
      case 'loading':
      default:
        return 'Verifying Your Payment...'
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <PaymentStatus
        status={paymentStatus}
        title={getStatusTitle()}
        message={getStatusMessage()}
        details={paymentDetails}
        showRetry={paymentStatus === 'error'}
        onRetry={handleRetry}
        showShare={paymentStatus === 'success'}
        onShare={handleShare}
      />
    </div>
  )
}

export default Success