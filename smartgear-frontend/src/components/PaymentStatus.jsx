import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { CheckCircle, XCircle, Loader2, ArrowLeft, RotateCcw, Share2 } from 'lucide-react'

const PaymentStatus = ({ 
  status = 'loading', // 'loading', 'success', 'error'
  title,
  message,
  details = null,
  showRetry = false,
  onRetry = null,
  showShare = false,
  onShare = null
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-12 w-12 text-green-600" />
      case 'error':
        return <XCircle className="h-12 w-12 text-destructive" />
      case 'loading':
      default:
        return <Loader2 className="h-12 w-12 text-primary animate-spin" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'success'
      case 'error':
        return 'destructive'
      case 'loading':
      default:
        return 'default'
    }
  }

  const getDefaultTitle = () => {
    switch (status) {
      case 'success':
        return 'Payment Successful!'
      case 'error':
        return 'Payment Failed'
      case 'loading':
      default:
        return 'Processing Payment...'
    }
  }

  const getDefaultMessage = () => {
    switch (status) {
      case 'success':
        return 'Your order has been processed successfully. You will receive a confirmation email shortly.'
      case 'error':
        return 'There was an issue processing your payment. Please try again or contact support.'
      case 'loading':
      default:
        return 'Please wait while we process your payment. This may take a few moments.'
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            {getStatusIcon()}
          </div>
          <CardTitle className="text-2xl">
            {title || getDefaultTitle()}
          </CardTitle>
          <CardDescription className="text-base">
            {message || getDefaultMessage()}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Status Alert */}
          <Alert variant={getStatusColor()}>
            <AlertTitle className="flex items-center gap-2">
              {status === 'success' && <CheckCircle className="h-4 w-4" />}
              {status === 'error' && <XCircle className="h-4 w-4" />}
              {status === 'loading' && <Loader2 className="h-4 w-4 animate-spin" />}
              {status === 'success' && 'Order Confirmed'}
              {status === 'error' && 'Payment Error'}
              {status === 'loading' && 'Processing...'}
            </AlertTitle>
            <AlertDescription>
              {status === 'success' && 'Your payment has been processed and your order is confirmed.'}
              {status === 'error' && 'We could not process your payment at this time.'}
              {status === 'loading' && 'Your payment is being processed. Please do not close this page.'}
            </AlertDescription>
          </Alert>

          {/* Order Details */}
          {details && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Order Details</h4>
              <div className="space-y-2 text-sm">
                {details.reference && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reference:</span>
                    <span className="font-mono">{details.reference}</span>
                  </div>
                )}
                {details.amount && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-semibold">GHS {details.amount.toLocaleString()}</span>
                  </div>
                )}
                {details.productName && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Product:</span>
                    <span>{details.productName}</span>
                  </div>
                )}
                {details.customerEmail && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span>{details.customerEmail}</span>
                  </div>
                )}
                {details.transactionDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span>{new Date(details.transactionDate).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {status === 'success' && (
              <>
                <Button asChild className="flex-1">
                  <Link to="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Link>
                </Button>
                {showShare && onShare && (
                  <Button variant="outline" onClick={onShare}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                )}
              </>
            )}

            {status === 'error' && (
              <>
                <Button asChild variant="outline" className="flex-1">
                  <Link to="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Products
                  </Link>
                </Button>
                {showRetry && onRetry && (
                  <Button onClick={onRetry} className="flex-1">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                )}
              </>
            )}

            {status === 'loading' && (
              <div className="text-center text-sm text-muted-foreground">
                <p>Please wait and do not refresh this page...</p>
              </div>
            )}
          </div>

          {/* Support Information */}
          {status === 'error' && (
            <div className="text-center text-sm text-muted-foreground border-t pt-4">
              <p>Need help? Contact our support team:</p>
              <p className="font-medium">support@smartgear.com | +233 20 123 4567</p>
            </div>
          )}

          {/* Next Steps */}
          {status === 'success' && (
            <div className="text-center text-sm text-muted-foreground border-t pt-4">
              <p>What happens next?</p>
              <ul className="mt-2 space-y-1">
                <li>• You'll receive an email confirmation</li>
                <li>• Our team will process your order</li>
                <li>• Delivery updates will be sent to your email</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default PaymentStatus