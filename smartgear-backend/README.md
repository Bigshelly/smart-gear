# SmartGear Backend API

Backend API for SmartGear e-commerce platform built with Node.js, Express, and MongoDB.

## Features

- Product management (CRUD operations)
- Payment processing with Paystack integration
- Input validation with Joi
- Error handling middleware
- CORS support for frontend integration
- MongoDB with Mongoose ODM

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or cloud)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Required Environment Variables**
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/smartgear
   FRONTEND_URL=http://localhost:5173
   PAYSTACK_SECRET_KEY=your_paystack_secret_key
   PAYSTACK_PUBLIC_KEY=your_paystack_public_key
   ```

### Running the Server

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

### Database Seeding

```bash
# Seed sample products
npm run seed

# Clear all products
npm run seed:destroy
```

## API Endpoints

### Products
```
GET    /api/products              # Get all products
GET    /api/products/:id          # Get single product
GET    /api/products/category/:cat # Get products by category
POST   /api/products              # Create product (admin)
PUT    /api/products/:id          # Update product (admin)
DELETE /api/products/:id          # Delete product (admin)
```

### Payments
```
POST   /api/payments/initialize   # Initialize payment
GET    /api/payments/verify/:ref  # Verify payment
POST   /api/payments/webhook      # Paystack webhook
```

### Health Check
```
GET    /api/health                # API status
```

## Product Query Parameters

```
GET /api/products?category=smartphones&minPrice=1000&maxPrice=5000&inStock=true&sort=price&order=asc&page=1&limit=10
```

- `category` - Filter by category
- `minPrice` / `maxPrice` - Price range filter
- `inStock` - Filter by stock status
- `featured` - Filter featured products
- `search` - Text search in name/description
- `sort` - Sort field (price, name, createdAt)
- `order` - Sort order (asc, desc)
- `page` - Page number
- `limit` - Items per page

## Development

### Project Structure
```
src/
├── controllers/     # Route handlers
├── models/         # MongoDB schemas
├── routes/         # Express routes
├── middleware/     # Custom middleware
├── services/       # Business logic
├── config/         # Configuration files
└── utils/          # Utility functions
```

### Testing the API

1. **Start the server**: `npm run dev`
2. **Seed data**: `npm run seed`
3. **Test endpoints**:
   ```bash
   # Get all products
   curl http://localhost:5000/api/products
   
   # Get single product
   curl http://localhost:5000/api/products/PRODUCT_ID
   
   # Health check
   curl http://localhost:5000/api/health
   ```

## Integration with Frontend

Update frontend environment variables:
```
VITE_API_URL=http://localhost:5000
```

The backend is designed to work seamlessly with the SmartGear React frontend.