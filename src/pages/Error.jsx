import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import PaymentStatus from '../components/PaymentStatus'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { ArrowLeft, RefreshCw, MessageCircle } from 'lucide-react'

const Error = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  
  // Get error details from URL parameters
  const errorType = searchParams.get('type') || 'payment'
  const errorMessage = searchParams.get('message') || 'An unexpected error occurred'
  const reference = searchParams.get('reference')
  const productId = searchParams.get('product')

  const handleRetry = () => {
    if (productId) {
      navigate(`/checkout/${productId}`)
    } else {
      navigate('/')
    }
  }

  const getErrorTitle = () => {
    switch (errorType) {
      case 'payment':
        return 'Payment Failed'
      case 'network':
        return 'Connection Error'
      case 'timeout':
        return 'Request Timeout'
      case 'server':
        return 'Server Error'
      default:
        return 'Something Went Wrong'
    }
  }

  const getErrorMessage = () => {
    switch (errorType) {
      case 'payment':
        return 'Your payment could not be processed. This might be due to insufficient funds, incorrect card details, or a temporary issue with your payment method.'
      case 'network':
        return 'We could not connect to our payment servers. Please check your internet connection and try again.'
      case 'timeout':
        return 'The payment request timed out. This might be due to a slow connection or server overload.'
      case 'server':
        return 'Our servers are experiencing temporary issues. Please try again in a few minutes.'
      default:
        return errorMessage || 'An unexpected error occurred while processing your request.'
    }
  }

  const getErrorSolutions = () => {
    switch (errorType) {
      case 'payment':
        return [
          'Check your card details and try again',
          'Ensure you have sufficient funds',
          'Try a different payment method',
          'Contact your bank if the issue persists'
        ]
      case 'network':
        return [
          'Check your internet connection',
          'Try refreshing the page',
          'Switch to a different network if possible',
          'Wait a few minutes and try again'
        ]
      case 'timeout':
        return [
          'Try the transaction again',
          'Ensure you have a stable internet connection',
          'Avoid clicking multiple times during processing',
          'Contact support if the issue continues'
        ]
      case 'server':
        return [
          'Wait a few minutes and try again',
          'Check our status page for updates',
          'Try again during off-peak hours',
          'Contact support if urgent'
        ]
      default:
        return [
          'Refresh the page and try again',
          'Clear your browser cache',
          'Try using a different browser',
          'Contact our support team'
        ]
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Error Display */}
        <div className="lg:col-span-2">
          <PaymentStatus
            status="error"
            title={getErrorTitle()}
            message={getErrorMessage()}
            details={reference ? { reference } : null}
            showRetry={true}
            onRetry={handleRetry}
          />
        </div>

        {/* Sidebar with help */}
        <div className="space-y-6">
          {/* What to try next */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                What to try next
              </CardTitle>
              <CardDescription>
                Here are some steps that might help resolve the issue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {getErrorSolutions().map((solution, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    {solution}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Still need help?
              </CardTitle>
              <CardDescription>
                Our support team is here to help you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Email Support</p>
                  <p className="text-sm text-muted-foreground">support@smartgear.com</p>
                  <p className="text-xs text-muted-foreground">Response within 2 hours</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Phone Support</p>
                  <p className="text-sm text-muted-foreground">+233 20 123 4567</p>
                  <p className="text-xs text-muted-foreground">Mon-Fri 9AM-6PM</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Live Chat</p>
                  <p className="text-sm text-muted-foreground">Available on our website</p>
                  <p className="text-xs text-muted-foreground">Mon-Fri 9AM-6PM</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  When contacting support, please include:
                </p>
                <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                  <li>• Error type: {errorType}</li>
                  {reference && <li>• Reference: {reference}</li>}
                  <li>• Time of error: {new Date().toLocaleString()}</li>
                  <li>• Browser and device information</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Alternative Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleRetry}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Browse Products
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Error