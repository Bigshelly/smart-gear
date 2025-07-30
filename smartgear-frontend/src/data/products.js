export const products = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    price: 8500,
    currency: "GHS",
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&q=80",
    description: "Latest iPhone with advanced camera system and A17 Pro chip. Experience cutting-edge technology with ProRAW photography.",
    category: "smartphones",
    inStock: true,
    specs: ["6.7-inch Super Retina XDR display", "A17 Pro chip", "128GB storage", "Pro camera system"]
  },
  {
    id: 2,
    name: "MacBook Pro 14-inch",
    price: 12500,
    currency: "GHS",
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&q=80",
    description: "Supercharged by M3 Pro chip with next-level performance for demanding workflows. Perfect for creative professionals.",
    category: "laptops",
    inStock: true,
    specs: ["14-inch Liquid Retina XDR display", "M3 Pro chip", "512GB SSD", "18-hour battery life"]
  },
  {
    id: 3,
    name: "AirPods Pro (3rd generation)",
    price: 1200,
    currency: "GHS",
    image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=400&q=80",
    description: "Immersive audio experience with Active Noise Cancellation and Spatial Audio. Premium wireless freedom.",
    category: "audio",
    inStock: true,
    specs: ["Active Noise Cancellation", "Spatial Audio", "6 hours listening time", "MagSafe charging case"]
  },
  {
    id: 4,
    name: "iPad Air 11-inch",
    price: 3500,
    currency: "GHS",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80",
    description: "Powerful, colorful, and wonderfully versatile. iPad Air with M2 chip delivers exceptional performance for work and play.",
    category: "tablets",
    inStock: true,
    specs: ["11-inch Liquid Retina display", "M2 chip", "256GB storage", "All-day battery life"]
  },
  {
    id: 5,
    name: "Apple Watch Series 9",
    price: 2200,
    currency: "GHS",
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&q=80",
    description: "Advanced health features, fitness tracking, and seamless connectivity. Your essential companion for an active lifestyle.",
    category: "wearables",
    inStock: true,
    specs: ["45mm case", "Always-On Retina display", "GPS + Cellular", "Health monitoring sensors"]
  }
]

export const getProductById = (id) => {
  return products.find(product => product.id === parseInt(id))
}

export const getProductsByCategory = (category) => {
  return products.filter(product => product.category === category)
}

export const getInStockProducts = () => {
  return products.filter(product => product.inStock)
}