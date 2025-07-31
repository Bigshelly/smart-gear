import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Product from '../models/Product.js'

// Load environment variables
dotenv.config()

// Sample products data (matching frontend data)
const products = [
  {
    name: "iPhone 15 Pro Max",
    price: 8500,
    currency: "GHS",
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&q=80",
    description: "Latest iPhone with advanced camera system and A17 Pro chip. Experience cutting-edge technology with ProRAW photography.",
    category: "smartphones",
    inStock: true,
    stockQuantity: 50,
    specs: ["6.7-inch Super Retina XDR display", "A17 Pro chip", "128GB storage", "Pro camera system"],
    featured: true,
    ratings: { average: 4.8, count: 127 }
  },
  {
    name: "MacBook Pro 14-inch",
    price: 12500,
    currency: "GHS",
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&q=80",
    description: "Supercharged by M3 Pro chip with next-level performance for demanding workflows. Perfect for creative professionals.",
    category: "laptops",
    inStock: true,
    stockQuantity: 25,
    specs: ["14-inch Liquid Retina XDR display", "M3 Pro chip", "512GB SSD", "18-hour battery life"],
    featured: true,
    ratings: { average: 4.9, count: 89 }
  },
  {
    name: "AirPods Pro (3rd generation)",
    price: 1200,
    currency: "GHS",
    image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=400&q=80",
    description: "Immersive audio experience with Active Noise Cancellation and Spatial Audio. Premium wireless freedom.",
    category: "audio",
    inStock: true,
    stockQuantity: 100,
    specs: ["Active Noise Cancellation", "Spatial Audio", "6 hours listening time", "MagSafe charging case"],
    featured: false,
    ratings: { average: 4.7, count: 234 }
  },
  {
    name: "iPad Air 11-inch",
    price: 3500,
    currency: "GHS",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80",
    description: "Powerful, colorful, and wonderfully versatile. iPad Air with M2 chip delivers exceptional performance for work and play.",
    category: "tablets",
    inStock: true,
    stockQuantity: 35,
    specs: ["11-inch Liquid Retina display", "M2 chip", "256GB storage", "All-day battery life"],
    featured: false,
    ratings: { average: 4.6, count: 156 }
  },
  {
    name: "Apple Watch Series 9",
    price: 2200,
    currency: "GHS",
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&q=80",
    description: "Advanced health features, fitness tracking, and seamless connectivity. Your essential companion for an active lifestyle.",
    category: "wearables",
    inStock: true,
    stockQuantity: 75,
    specs: ["45mm case", "Always-On Retina display", "GPS + Cellular", "Health monitoring sensors"],
    featured: true,
    ratings: { average: 4.5, count: 98 }
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    price: 7800,
    currency: "GHS",
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80",
    description: "Unleash your creativity with the Galaxy S24 Ultra's advanced S Pen and professional-grade camera system.",
    category: "smartphones",
    inStock: true,
    stockQuantity: 40,
    specs: ["6.8-inch Dynamic AMOLED display", "Snapdragon 8 Gen 3", "512GB storage", "200MP camera"],
    featured: false,
    ratings: { average: 4.4, count: 67 }
  },
  {
    name: "Sony WH-1000XM5",
    price: 1800,
    currency: "GHS",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&q=80",
    description: "Industry-leading noise cancellation with exceptional sound quality. Perfect for travel and work.",
    category: "audio",
    inStock: true,
    stockQuantity: 60,
    specs: ["30-hour battery life", "Industry-leading noise cancellation", "Quick charge", "Multipoint connection"],
    featured: false,
    ratings: { average: 4.8, count: 201 }
  },
  {
    name: "Dell XPS 13",
    price: 9500,
    currency: "GHS",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80",
    description: "Ultra-portable laptop with stunning display and exceptional build quality. Perfect for professionals on the go.",
    category: "laptops",
    inStock: true,
    stockQuantity: 20,
    specs: ["13.4-inch InfinityEdge display", "Intel Core i7", "16GB RAM", "512GB SSD"],
    featured: false,
    ratings: { average: 4.3, count: 43 }
  }
]

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smartgear')
    console.log('✅ MongoDB Connected')
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    process.exit(1)
  }
}

// Import data
const importData = async () => {
  try {
    await connectDB()
    
    // Clear existing products
    await Product.deleteMany()
    console.log('🗑️  Products cleared')
    
    // Insert sample products
    await Product.insertMany(products)
    console.log('✅ Sample products inserted')
    
    console.log(`📦 Inserted ${products.length} products successfully`)
    process.exit()
  } catch (error) {
    console.error('❌ Error importing data:', error.message)
    process.exit(1)
  }
}

// Destroy data
const destroyData = async () => {
  try {
    await connectDB()
    
    await Product.deleteMany()
    console.log('🗑️  All products deleted')
    
    process.exit()
  } catch (error) {
    console.error('❌ Error destroying data:', error.message)
    process.exit(1)
  }
}

// Check command line arguments
if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}