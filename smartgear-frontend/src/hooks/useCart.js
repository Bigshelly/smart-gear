import { useCart as useCartContext } from '../context/CartContext'

// Re-export the cart hook for convenience
// This allows importing from either location
export const useCart = useCartContext

export default useCartContext