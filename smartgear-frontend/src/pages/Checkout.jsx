import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import CheckoutForm from '../components/CheckoutForm'
import { Button } from '../components/ui/button'
import { Alert, AlertDescription } from '../components/ui/alert'
import { getProductById } from '../data/products'

const Checkout = () => {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        
        // Simulate API call delay
        setTimeout(() => {
          const foundProduct = getProductById(productId)
          
          if (foundProduct) {
            if (foundProduct.inStock) {
              setProduct(foundProduct)
            } else {
              setError('This product is currently out of stock.')
            }
          } else {
            setError('Product not found.')
          }
          
          setLoading(false)
        }, 500)
      } catch (err) {
        setError('Failed to load product details.')
        setLoading(false)
      }
    }

    if (productId) {
      loadProduct()
    } else {
      setError('No product specified.')
      setLoading(false)
    }
  }, [productId])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-4 bg-muted rounded w-24 mb-4 animate-pulse"></div>
          <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-card border rounded-lg p-6">
              <div className="h-6 bg-muted rounded w-32 mb-4 animate-pulse"></div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-muted rounded animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse"></div>
                  <div className="h-3 bg-muted rounded w-20 animate-pulse"></div>
                  <div className="h-5 bg-muted rounded w-24 animate-pulse"></div>
                </div>
              </div>
            </div>
            
            <div className="bg-card border rounded-lg p-6">
              <div className="h-6 bg-muted rounded w-40 mb-4 animate-pulse"></div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
                  <div className="h-10 bg-muted rounded animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
                  <div className="h-10 bg-muted rounded animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-28 animate-pulse"></div>
                  <div className="h-10 bg-muted rounded animate-pulse"></div>
                </div>
                <div className="h-12 bg-muted rounded animate-pulse"></div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-muted/30 p-6 rounded-lg">
              <div className="h-6 bg-muted rounded w-32 mb-4 animate-pulse"></div>
              <div className="space-y-3">
                <div className="h-3 bg-muted rounded animate-pulse"></div>
                <div className="h-3 bg-muted rounded animate-pulse"></div>
                <div className="h-3 bg-muted rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Unable to Load Checkout</h1>
          <p className="text-muted-foreground">
            We encountered an issue while loading the checkout page.
          </p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Secure Checkout</h1>
        <p className="text-muted-foreground mt-2">
          Complete your purchase securely with Paystack
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Checkout Form */}
        <div className="lg:col-span-2">
          <CheckoutForm product={product} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Security Notice */}
          <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-800 dark:text-green-400 mb-2">
                  Secure Payment
                </h3>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                  <li>• SSL encrypted connection</li>
                  <li>• Paystack secure processing</li>
                  <li>• No card details stored</li>
                  <li>• PCI DSS compliant</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Accepted Payment Methods */}
          <div className="bg-muted/30 p-6 rounded-lg">
            <h3 className="font-semibold mb-4">Accepted Payment Methods</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                  💳
                </div>
                <span className="text-sm">Visa, Mastercard, Verve</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                  📱
                </div>
                <span className="text-sm">Mobile Money (MTN, Vodafone)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                  🏦
                </div>
                <span className="text-sm">Bank Transfer</span>
              </div>
            </div>
          </div>

          {/* Support Info */}
          <div className="bg-muted/30 p-6 rounded-lg">
            <h3 className="font-semibold mb-3">Need Help?</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>📧 support@smartgear.com</p>
              <p>📞 +233 20 123 4567</p>
              <p>💬 Live chat available 9AM-6PM</p>
            </div>
          </div>

          {/* Policies */}
          <div className="text-xs text-muted-foreground space-y-2">
            <p>
              By completing this purchase, you agree to our{' '}
              <Link to="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
            <p>
              All sales are processed securely through Paystack and are subject to 
              our return and refund policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout