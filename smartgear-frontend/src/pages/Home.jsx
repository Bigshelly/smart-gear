import { useState, useEffect } from 'react'
import ProductGrid from '../components/ProductGrid'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Smartphone, Laptop, Headphones, Tablet, Watch, Star, ShieldCheck } from 'lucide-react'
import { getProducts } from '../services/api'
import heroImage from '../assets/hero-image.jpg'

// home page - finally got it working lol
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

  // fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await getProducts()
        
        // extract products from api response
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

  // filter products when category changes
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
    <div className="min-h-screen">
      {/* hero section */}
      <section 
        className="relative py-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Next-Gen Tech at Your Fingertips
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Power Up Your Life with Cutting-Edge Tech
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="px-8 py-3 text-lg"
              onClick={() => document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' })}
            >
              Shop Now
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-3 text-lg bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => document.getElementById('why-choose-us').scrollIntoView({ behavior: 'smooth' })}
            >
              Why Shop With Us?
            </Button>
          </div>
        </div>
      </section>

      {/* error display */}
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

      {/* products section */}
      <section id="products-section" className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Our Products</h2>
          <p className="text-muted-foreground text-lg">
            Choose from our curated selection of premium tech gadgets
          </p>
        </div>
        
        {/* category buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => {
            const IconComponent = category.icon
            const isActive = selectedCategory === category.id
            
            return (
              <Button
                key={category.id}
                variant={isActive ? 'default' : 'outline'}
                size="lg"
                onClick={() => handleCategoryChange(category.id)}
                disabled={loading}
                className={`flex items-center gap-2 px-6 py-3 rounded-full ${
                  isActive ? '' : 'hover:bg-primary/10'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <IconComponent className="h-4 w-4" />
                {category.name}
              </Button>
            )
          })}
        </div>

        {/* products grid */}
        <ProductGrid 
          products={filteredProducts} 
          showLoading={loading}
        />
      </section>

      {/* trust indicators section */}
      <section id="why-choose-us" className="bg-muted/30 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Choose SmartGear?
            </h2>
            <p className="text-muted-foreground text-lg">
              We are committed to providing the best shopping experience for tech enthusiasts.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Smartphone className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Latest Technology</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">
                We are committed to providing the best shopping experience for tech enthusiasts.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Secure Payments</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">
                Your payments are protected with Paystack's enterprise grade security.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-8 w-8 text-primary">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground">Fast Checkout</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">
                Streamlined checkout process designed for speed and convenience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* footer section with social icons */}
      <footer id="contact-us" className="bg-amber-100 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-muted-foreground text-sm">
                ©2025 SmartGear Shop All Rights Reserved.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-foreground font-medium">Contact Us</span>
              <div className="flex gap-4">
                {/* facebook */}
                <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                {/* instagram */}
                <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                {/* twitter */}
                <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home