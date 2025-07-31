import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import * as cartAPI from '../services/api'
import { toast } from '../hooks/useToast'

const CartContext = createContext()

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { isAuthenticated, user } = useAuth()

  // Clean up cart duplicates
  const cleanupCart = async () => {
    if (!isAuthenticated) return
    
    try {
      const response = await cartAPI.cleanupCart()
      if (response.status === 'success') {
        console.log('Cart cleaned up successfully')
        return response
      }
    } catch (error) {
      console.error('Error cleaning up cart:', error)
    }
  }

  // Load cart from backend
  const loadCart = async () => {
    if (!isAuthenticated) {
      setCartItems([])
      return
    }

    try {
      setLoading(true)
      const response = await cartAPI.getCart()
      const backendCart = response.data?.cart
      
      if (backendCart && backendCart.items) {
        // Check for duplicates and clean if found
        const productIds = backendCart.items.map(item => item.product._id)
        const uniqueProductIds = [...new Set(productIds)]
        
        if (productIds.length !== uniqueProductIds.length) {
          console.log('Duplicates detected, cleaning up cart...')
          await cleanupCart()
          // Reload cart after cleanup
          const cleanedResponse = await cartAPI.getCart()
          const cleanedCart = cleanedResponse.data?.cart
          
          if (cleanedCart && cleanedCart.items) {
            const transformedItems = cleanedCart.items.map((item, index) => ({
              ...item.product,
              quantity: item.quantity,
              cartItemId: item._id,
              uniqueKey: `${item.product._id}_${item._id}_${index}`
            }))
            console.log('Loaded cleaned cart items:', transformedItems)
            setCartItems(transformedItems)
          } else {
            setCartItems([])
          }
        } else {
          // No duplicates, proceed normally
          const transformedItems = backendCart.items.map((item, index) => ({
            ...item.product,
            quantity: item.quantity,
            cartItemId: item._id,
            uniqueKey: `${item.product._id}_${item._id}_${index}`
          }))
          console.log('Loaded cart items:', transformedItems)
          setCartItems(transformedItems)
        }
      } else {
        setCartItems([])
      }
    } catch (error) {
      console.error('Error loading cart:', error)
      setCartItems([])
    } finally {
      setLoading(false)
    }
  }

  // Load cart when user authentication changes
  useEffect(() => {
    loadCart()
  }, [isAuthenticated, user])

  const addItem = async (product) => {
    if (!isAuthenticated) {
      toast.error('Please log in', 'You need to be logged in to add items to cart')
      return
    }

    try {
      setLoading(true)
      const productId = product._id || product.id
      const response = await cartAPI.addToCart(productId, 1)
      
      if (response.status === 'success') {
        // Reload cart to get updated data
        await loadCart()
        // Don't show toast for add to cart, it's handled elsewhere
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      const message = error.response?.data?.message || 'Failed to add item to cart'
      toast.error('Error', message)
    } finally {
      setLoading(false)
    }
  }

  const removeItem = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please log in', 'You need to be logged in to modify cart')
      return
    }

    console.log('Removing item from cart:', productId)
    console.log('Current cart items before removal:', cartItems.map(item => ({ id: item._id, name: item.name })))

    try {
      setLoading(true)
      const response = await cartAPI.removeFromCart(productId)
      console.log('Remove item response:', response)
      
      if (response.status === 'success') {
        // Immediately update local state for better UX
        setCartItems(prev => prev.filter(item => (item._id || item.id) !== productId))
        
        // Then reload from backend to ensure consistency
        setTimeout(async () => {
          const reloadResponse = await cartAPI.getCart()
          console.log('Reloaded cart after removal:', reloadResponse.data?.cart?.items?.map(item => ({ id: item.product._id, name: item.product.name })))
          await loadCart()
        }, 100)
        
        toast.success('Item removed', 'Item removed from cart successfully')
      }
    } catch (error) {
      console.error('Error removing from cart:', error)
      const message = error.response?.data?.message || 'Failed to remove item from cart'
      toast.error('Error', message)
      // Reload cart to get correct state on error
      await loadCart()
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (productId, quantity) => {
    if (!isAuthenticated) {
      toast.error('Please log in', 'You need to be logged in to modify cart')
      return
    }

    try {
      setLoading(true)
      const response = await cartAPI.updateCartItem(productId, quantity)
      
      if (response.status === 'success') {
        await loadCart()
        toast.success('Cart updated', 'Cart quantity updated successfully')
      }
    } catch (error) {
      console.error('Error updating cart:', error)
      const message = error.response?.data?.message || 'Failed to update cart item'
      toast.error('Error', message)
    } finally {
      setLoading(false)
    }
  }

  // Drawer management functions
  const openDrawer = () => setIsDrawerOpen(true)
  const closeDrawer = () => setIsDrawerOpen(false)
  const toggleDrawer = () => setIsDrawerOpen(prev => !prev)

  const clearCart = async (silent = false) => {
    if (!isAuthenticated) {
      setCartItems([])
      return
    }

    try {
      setLoading(true)
      const response = await cartAPI.clearCart()
      
      if (response.status === 'success') {
        setCartItems([])
        if (!silent) {
          toast.success('Cart cleared', response.message)
        }
      }
    } catch (error) {
      console.error('Error clearing cart:', error)
      if (!silent) {
        const message = error.response?.data?.message || 'Failed to clear cart'
        toast.error('Error', message)
      }
    } finally {
      setLoading(false)
    }
  }

  const getItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const value = {
    cartItems,
    loading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    cleanupCart,
    getItemCount,
    getCartTotal,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    loadCart
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}