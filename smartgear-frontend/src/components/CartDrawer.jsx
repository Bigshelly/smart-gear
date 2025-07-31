import { useEffect, useState } from 'react'
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { formatPrice } from '../lib/utils'
import { useNavigate } from 'react-router-dom'
import AuthModal from './AuthModal'

const CartDrawer = () => {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { 
    cartItems, 
    isDrawerOpen, 
    closeDrawer, 
    removeItem, 
    updateQuantity, 
    getCartTotal 
  } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Close drawer on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer()
      }
    }

    if (isDrawerOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when drawer is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isDrawerOpen, closeDrawer])

  const handleCheckout = () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }
    
    closeDrawer()
    // Navigate to checkout with cart items
    navigate('/checkout', { state: { fromCart: true } })
  }

  const handleContinueShopping = () => {
    closeDrawer()
  }

  const handleRemoveItem = async (productId) => {
    // Simple confirmation
    if (window.confirm('Remove this item from your cart?')) {
      await removeItem(productId)
    }
  }

  const handleUpdateQuantity = async (productId, quantity) => {
    await updateQuantity(productId, quantity)
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-40 ${
          isDrawerOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={closeDrawer}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-xl transition-transform duration-300 ease-in-out z-50 flex flex-col ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        } w-full sm:w-96`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <h2 className="text-lg font-semibold">
            Your Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={closeDrawer}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Add some products to get started</p>
              <Button onClick={handleContinueShopping} variant="outline">
                Continue Shopping
              </Button>
            </div>
          ) : (
            cartItems.map((item) => (
              <Card key={item.uniqueKey || item._id || item.id} className="overflow-hidden">
                <CardContent className="p-3">
                  <div className="flex gap-3">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md bg-gray-100"
                        onError={(e) => {
                          e.target.src = '/placeholder-product.jpg'
                        }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                        {item.name}
                      </h4>
                      <p className="text-sm font-semibold text-primary mb-2">
                        {formatPrice(item.price, item.currency)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => handleUpdateQuantity(item._id || item.id, Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => handleUpdateQuantity(item._id || item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRemoveItem(item._id || item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Checkout Section */}
        {cartItems.length > 0 && (
          <div className="border-t bg-white p-4 space-y-4">
            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-xl font-bold text-primary">
                {formatPrice(getCartTotal(), 'GHS')}
              </span>
            </div>

            {/* Buttons */}
            <div className="space-y-2">
              <Button 
                onClick={handleCheckout} 
                className="w-full" 
                size="lg"
              >
                Checkout
              </Button>
              <Button 
                onClick={handleContinueShopping} 
                variant="outline" 
                className="w-full"
                size="lg"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Auth Modal */}
      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        title="Login Required"
        message="You need to be logged in to proceed with checkout."
        redirectPath="/checkout"
        onLogin={() => {
          closeDrawer()
          // Store that we want to go to checkout after login
          sessionStorage.setItem('redirectAfterLogin', '/checkout')
          sessionStorage.setItem('checkoutFromCart', 'true')
        }}
        onSignUp={() => {
          closeDrawer()
          // Store that we want to go to checkout after login
          sessionStorage.setItem('redirectAfterLogin', '/checkout')
          sessionStorage.setItem('checkoutFromCart', 'true')
        }}
      />
    </>
  )
}

export default CartDrawer