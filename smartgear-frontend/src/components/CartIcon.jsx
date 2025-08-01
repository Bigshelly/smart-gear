import { useState, useEffect } from 'react'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { Badge } from './ui/badge'

// cart icon with animation - this was annoying to debug
const CartIcon = () => {
  try {
    const { getItemCount, toggleDrawer } = useCart()
    const itemCount = getItemCount()
    const [justAdded, setJustAdded] = useState(false)
    const [prevItemCount, setPrevItemCount] = useState(0)

    // animation trigger
    useEffect(() => {
      if (itemCount > prevItemCount && itemCount > 0) {
        setJustAdded(true)
        setTimeout(() => setJustAdded(false), 600)
      }
      setPrevItemCount(itemCount)
    }, [itemCount, prevItemCount])

    return (
      <div 
        className={`relative z-50 transition-transform duration-200 ${
          justAdded ? 'animate-bounce' : ''
        }`}
        data-cart-icon
      >
        <button 
          onClick={toggleDrawer}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label={`Shopping cart with ${itemCount} items`}
        >
          <ShoppingCart 
            className={`h-6 w-6 transition-colors duration-300 ${
              justAdded ? 'text-green-500' : 'text-foreground'
            }`} 
          />
        </button>
        
        {itemCount > 0 && (
          <Badge 
            variant="destructive" 
            className={`absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs transition-all duration-300 ${
              justAdded ? 'animate-pulse bg-green-500 scale-110' : ''
            }`}
          >
            {itemCount > 99 ? '99+' : itemCount}
          </Badge>
        )}
      </div>
    )
  } catch (error) {
    console.error('CartIcon error:', error)
    // fallback ui
    return (
      <div className="relative z-50">
        <button 
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Shopping cart"
          disabled
        >
          <ShoppingCart className="h-6 w-6 text-foreground" />
        </button>
      </div>
    )
  }
}

export default CartIcon