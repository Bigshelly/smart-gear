import { useState, useEffect } from 'react'
import ProductCard from './ProductCard'
import { products as mockProducts } from '../data/products'
import Spinner from './ui/spinner'

const ProductGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="bg-card rounded-lg border overflow-hidden">
          <div className="aspect-square bg-muted animate-pulse"></div>
          <div className="p-4 space-y-3">
            <div className="h-4 bg-muted rounded animate-pulse"></div>
            <div className="h-3 bg-muted rounded animate-pulse w-3/4"></div>
            <div className="h-3 bg-muted rounded animate-pulse w-1/2"></div>
            <div className="flex justify-between items-center pt-2">
              <div className="h-6 bg-muted rounded animate-pulse w-20"></div>
              <div className="h-5 bg-muted rounded animate-pulse w-16"></div>
            </div>
            <div className="h-10 bg-muted rounded animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      <Spinner size="xl" />
      <p className="text-muted-foreground font-medium">Loading products...</p>
    </div>
  )
}

const EmptyState = () => {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 mx-auto mb-6 text-muted-foreground">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full">
          <circle cx="12" cy="12" r="10"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">No Products Found</h3>
      <p className="text-muted-foreground max-w-md mx-auto">
        We couldn't find any products at the moment. Please check back later or contact support.
      </p>
    </div>
  )
}

const ProductGrid = ({ 
  showLoading = false, 
  products = null,
  className = ""
}) => {
  const [displayProducts, setDisplayProducts] = useState([])

  useEffect(() => {
    if (products !== null) {
      setDisplayProducts(products)
    } else {
      // Fallback to mock data if no products provided
      setDisplayProducts(mockProducts)
    }
  }, [products])

  // Use external loading state if provided, otherwise show loading for mock data
  const loading = showLoading || (products === null && displayProducts.length === 0)

  if (loading) {
    // Show centered spinner for initial loading, skeleton for subsequent loads
    if (showLoading) {
      return <LoadingSpinner />
    }
    return <ProductGridSkeleton />
  }

  if (!Array.isArray(displayProducts) || displayProducts.length === 0) {
    return <EmptyState />
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {displayProducts.map((product) => (
        <ProductCard key={product._id || product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductGrid