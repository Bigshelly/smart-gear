import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, Star, Truck, Shield, RotateCcw } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Card, CardContent } from '../components/ui/card'
import { formatPrice } from '../lib/utils'
import { getProduct } from '../services/api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { toast } from '../hooks/useToast'
import AuthModal from '../components/AuthModal'
import Spinner from '../components/ui/spinner'

const ProductDetails = () => {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { addItem } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await getProduct(productId)
        const foundProduct = response.data?.product || response.product || response
        
        if (foundProduct) {
          setProduct(foundProduct)
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

    if (productId) {
      loadProduct()
    } else {
      setError('No product specified.')
      setLoading(false)
    }
  }, [productId])

  const handleAddToCart = async () => {
    if (!product) return
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }
    
    setIsAdding(true)
    
    try {
      // Add multiple quantities if selected
      for (let i = 0; i < quantity; i++) {
        await addItem(product)
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setTimeout(() => setIsAdding(false), 1200)
    }
  }

  const handleBuyNow = () => {
    if (!product) return
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }
    
    // Proceed to checkout
    navigate(`/checkout/${product._id || product.id}`)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <Spinner size="xl" />
          <p className="text-muted-foreground font-medium">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link to="/" className="text-primary hover:underline">
            <ArrowLeft className="inline w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  if (!product) return null

  // Create multiple image views (for demo, we'll use the same image)
  const productImages = [
    product.image,
    product.image, // In a real app, you'd have multiple angles
    product.image,
    product.image
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link 
        to="/" 
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square rounded-lg overflow-hidden bg-muted">
            <img
              src={productImages[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Thumbnail Images */}
          <div className="flex gap-2 overflow-x-auto">
            {productImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === index ? 'border-primary' : 'border-muted'
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Category */}
          <Badge variant="outline" className="w-fit">
            {product.category}
          </Badge>

          {/* Title and Rating */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= (product.ratings?.average || 4)
                        ? 'text-yellow-400 fill-current'
                        : 'text-muted'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.ratings?.count || 15} Reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="text-3xl font-bold text-primary">
            {formatPrice(product.price, product.currency)}
          </div>

          {/* Description */}
          <div>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Specifications */}
          {product.specs && product.specs.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Key Features:</h3>
              <ul className="space-y-2">
                {product.specs.map((spec, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></span>
                    {spec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <label className="font-medium">Quantity:</label>
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 hover:bg-muted transition-colors"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="px-4 py-2 border-x">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 hover:bg-muted transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={!product.inStock || isAdding}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="flex-1"
              onClick={handleBuyNow}
              disabled={!product.inStock}
            >
              Buy Now
            </Button>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm">
              {product.inStock ? `In Stock (${product.stockQuantity || 'Available'})` : 'Out of Stock'}
            </span>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 gap-4 pt-6 border-t">
            <div className="flex items-center gap-3 text-sm">
              <Truck className="w-5 h-5 text-muted-foreground" />
              <span>Free shipping on orders over GHS 500</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <RotateCcw className="w-5 h-5 text-muted-foreground" />
              <span>30-day return policy</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <span>2-year warranty included</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Auth Modal */}
      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        title="Login Required"
        message="You need to be logged in to add items to your cart or make a purchase."
        redirectPath={window.location.pathname}
      />
    </div>
  )
}

export default ProductDetails