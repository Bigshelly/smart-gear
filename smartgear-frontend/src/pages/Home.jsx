import { useState, useEffect } from 'react'
import ProductGrid from '../components/ProductGrid'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Smartphone, Laptop, Headphones, Tablet, Watch, Star, ShieldCheck } from 'lucide-react'
import { getProducts } from '../services/api'

const Home = () => {
  const [allProducts, setAllProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const categories = [
    { id: 'all', name: 'All Products', icon: Star },
    { id: 'smartphones', name: 'Smartphones', icon: Smartphone },
    { id: 'laptops', name: 'Laptops', icon: Laptop },
    { id: 'audio', name: 'Audio', icon: Headphones },
    { id: 'tablets', name: 'Tablets', icon: Tablet },
    { id: 'wearables', name: 'Wearables', icon: Watch },
  ]

  // Fetch products from API on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await getProducts()
        
        // Extract products from API response
        console.log('API Response:', response)
        const productsData = response.data?.products || response.products || []
        
        if (Array.isArray(productsData)) {
          setAllProducts(productsData)
          setFilteredProducts(productsData)
        } else {
          console.error('Products data is not an array:', productsData)
          setAllProducts([])
          setFilteredProducts([])
        }
      } catch (err) {
        console.error('Failed to fetch products:', err)
        setError('Failed to load products. Please try again later.')
        setAllProducts([])
        setFilteredProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Filter products when category changes
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(allProducts)
    } else {
      setFilteredProducts(allProducts.filter(product => product.category === selectedCategory))
    }
  }, [selectedCategory, allProducts])

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId)
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-r from-primary/10 via-primary/5 to-background rounded-2xl">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Welcome to{' '}
            <span className="text-primary">SmartGear</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Discover the latest tech gadgets and accessories. 
            Premium quality, competitive prices, and secure checkout powered by Paystack.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="secondary" className="px-4 py-2">
              ✨ Latest Technology
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              🚚 Fast Delivery
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              🔒 Secure Payments
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              📱 Mobile Optimized
            </Badge>
          </div>
        </div>
      </section>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Category Filter */}
      <section>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Our Products</h2>
            <p className="text-muted-foreground">
              Choose from our curated selection of premium tech gadgets
            </p>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''}
          </Badge>
        </div>

        {/* Category Buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => {
            const IconComponent = category.icon
            const isActive = selectedCategory === category.id
            
            return (
              <Button
                key={category.id}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleCategoryChange(category.id)}
                className={`flex items-center gap-2 ${
                  isActive ? '' : 'hover:bg-primary/10'
                }`}
              >
                <IconComponent className="h-4 w-4" />
                {category.name}
              </Button>
            )
          })}
        </div>
      </section>

      {/* Products Grid */}
      <section>
        <ProductGrid 
          products={filteredProducts} 
          showLoading={loading}
        />
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30 rounded-2xl">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Why Choose SmartGear?
          </h2>
          <p className="text-muted-foreground mb-12 text-lg">
            We're committed to providing the best shopping experience for tech enthusiasts
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Smartphone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Latest Technology</h3>
              <p className="text-muted-foreground">
                We stock only the newest and most innovative tech products from trusted brands.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Secure Payments</h3>
              <p className="text-muted-foreground">
                Your payments are protected with Paystack's enterprise-grade security.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 text-primary">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Fast Checkout</h3>
              <p className="text-muted-foreground">
                Streamlined checkout process designed for speed and convenience.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home