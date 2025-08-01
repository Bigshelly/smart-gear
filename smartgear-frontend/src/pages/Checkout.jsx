import { useState, useEffect } from 'react'
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import CheckoutForm from '../components/CheckoutForm'
import { Button } from '../components/ui/button'
import { Alert, AlertDescription } from '../components/ui/alert'
import { getProduct } from '../services/api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/ui/spinner'

const Checkout = () => {
  const { productId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { cartItems } = useCart()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Wait for auth to load
    if (authLoading) return

    // Check authentication first
    if (!isAuthenticated) {
      // Store the current checkout attempt for redirect after login
      if (location.state?.fromCart) {
        sessionStorage.setItem('redirectAfterLogin', '/checkout')
        sessionStorage.setItem('checkoutFromCart', 'true')
      } else if (productId) {
        sessionStorage.setItem('redirectAfterLogin', `/checkout/${productId}`)
      }
      navigate('/login')
      return
    }

    const loadProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // If coming from cart, no need to fetch product
        if (location.state?.fromCart) {
          if (cartItems.length === 0) {
            setError('Your cart is empty.')
          }
          setLoading(false)
          return
        }

        // If no productId, show error
        if (!productId) {
          setError('No product specified.')
          setLoading(false)
          return
        }
        
        // Fetch product from API for single product checkout
        const response = await getProduct(productId)
        const foundProduct = response.data?.product || response.product || response
        
        if (foundProduct) {
          if (foundProduct.inStock) {
            setProduct(foundProduct)
          } else {
            setError('This product is currently out of stock.')
          }
        } else {
          setError('Product not found.')
        }
      } catch (err) {
        console.error('Failed to load product:', err)
        setError('Failed to load product details.')
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [productId, location.state?.fromCart, cartItems.length, isAuthenticated, authLoading, navigate])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <Spinner size="xl" />
          <p className="text-muted-foreground font-medium">Loading checkout...</p>
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
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>
      </Button>

      {/* Checkout Form */}
      <CheckoutForm product={product} />
    </div>
  )
}

export default Checkout