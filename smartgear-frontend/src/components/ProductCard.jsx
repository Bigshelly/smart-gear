import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { ShoppingCart, Check } from 'lucide-react'
import { formatPrice } from '../lib/utils'
import { useCart } from '../context/CartContext'
import { toast } from '../hooks/useToast'

const ProductCard = ({ product }) => {
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const { addItem } = useCart()

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  const handleImageError = () => {
    setImageLoading(false)
    setImageError(true)
  }

  const handleAddToCart = () => {
    setIsAdding(true)
    addItem(product)
    
    // Show success toast with slight delay to not interfere with cart bounce
    setTimeout(() => {
      toast.success(
        "Added to cart!",
        `${product.name} has been added to your cart`
      )
    }, 300)
    
    // Reset button state after animation
    setTimeout(() => setIsAdding(false), 1200)
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          {imageLoading && (
            <div className="aspect-square bg-muted animate-pulse flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          {imageError ? (
            <div className="aspect-square bg-muted flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <div className="w-12 h-12 mx-auto mb-2 opacity-50">📱</div>
                <p className="text-sm">Image not available</p>
              </div>
            </div>
          ) : (
            <img
              src={product.image}
              alt={product.name}
              className={`aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                imageLoading ? 'hidden' : 'block'
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}
          {product.inStock && (
            <Badge
              variant="success"
              className="absolute top-2 left-2"
            >
              In Stock
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <CardTitle className="text-lg mb-2 line-clamp-2 leading-tight">
          {product.name}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {product.description}
        </CardDescription>
        
        {/* Specs */}
        {product.specs && product.specs.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-medium text-muted-foreground mb-1">Key Features:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              {product.specs.slice(0, 2).map((spec, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-1 h-1 bg-primary rounded-full mr-2 flex-shrink-0"></span>
                  {spec}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">
            {formatPrice(product.price, product.currency)}
          </div>
          <Badge variant="outline" className="text-xs">
            {product.category}
          </Badge>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 space-y-2">
        <div className="flex gap-2 w-full">
          <Button 
            variant="outline" 
            size="lg" 
            className={`flex-1 transition-all duration-300 ${
              isAdding ? 'bg-green-500 border-green-500 text-white hover:bg-green-600' : ''
            }`}
            onClick={handleAddToCart}
            disabled={!product.inStock || isAdding}
          >
            {isAdding ? (
              <>
                <Check className="h-4 w-4 mr-2 animate-pulse" />
                Added!
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </>
            )}
          </Button>
          <Button asChild className="flex-1" size="lg" disabled={!product.inStock}>
            <Link to={`/checkout/${product._id || product.id}`}>
              Buy Now
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default ProductCard