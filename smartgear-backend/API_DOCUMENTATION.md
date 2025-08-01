# SmartGear API Documentation

## Overview

SmartGear is a comprehensive e-commerce platform API that provides endpoints for user authentication, product management, shopping cart operations, order processing, and payment integration with Paystack.

## API Documentation

### Swagger UI

The API documentation is available through Swagger UI at:
- **Development**: `http://localhost:5000/api-docs`
- **Production**: `https://railway.com/api-docs`

### Base URL

- **Development**: `http://localhost:5000/api`
- **Production**: `https://smart-gear-production.up.railway.app/api-docs/`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Most endpoints require authentication via Bearer token in the Authorization header.

### Getting Started

1. **Register a new user**:
   ```
   POST /api/auth/register
   ```

2. **Login to get access token**:
   ```
   POST /api/auth/login
   ```

3. **Use the token in subsequent requests**:
   ```
   Authorization: Bearer <your-jwt-token>
   ```

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register a new user | No |
| POST | `/login` | Login user | No |
| POST | `/refresh-token` | Refresh access token | No |
| POST | `/logout` | Logout user | Yes |
| GET | `/me` | Get current user profile | Yes |
| PUT | `/me` | Update user profile | Yes |
| PUT | `/change-password` | Change user password | Yes |

### Products (`/api/products`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all products | No |
| GET | `/category/:category` | Get products by category | No |
| GET | `/:id` | Get single product | No |
| POST | `/` | Create new product | Yes (Admin) |
| PUT | `/:id` | Update product | Yes (Admin) |
| DELETE | `/:id` | Delete product | Yes (Admin) |

### Cart (`/api/cart`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get user's cart | Yes |
| GET | `/count` | Get cart item count | Yes |
| POST | `/items` | Add item to cart | Yes |
| POST | `/cleanup` | Clean up duplicate items | Yes |
| PUT | `/items/:productId` | Update cart item quantity | Yes |
| DELETE | `/items/:productId` | Remove item from cart | Yes |
| DELETE | `/` | Clear cart | Yes |

### Orders (`/api/orders`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/stats` | Get user's order statistics | Yes |
| GET | `/` | Get user's orders | Yes |
| POST | `/` | Create new order | Yes |
| GET | `/:id` | Get single order | Yes |
| PUT | `/:id/status` | Update order status | Yes (Admin) |

### Payments (`/api/payments`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/initialize` | Initialize payment | No |
| GET | `/verify/:reference` | Verify payment | No |
| POST | `/webhook` | Handle payment webhook | No |

## Data Models

### User
```json
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "role": "user|admin",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Product
```json
{
  "_id": "string",
  "name": "string",
  "description": "string",
  "price": "number",
  "category": "string",
  "image": "string",
  "stock": "number",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Cart
```json
{
  "_id": "string",
  "user": "string",
  "items": [
    {
      "product": "Product object",
      "quantity": "number",
      "price": "number"
    }
  ],
  "total": "number",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Order
```json
{
  "_id": "string",
  "user": "string",
  "items": [
    {
      "product": "Product object",
      "quantity": "number",
      "price": "number"
    }
  ],
  "total": "number",
  "status": "pending|processing|shipped|delivered|cancelled",
  "paymentStatus": "pending|paid|failed",
  "shippingAddress": {
    "street": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string",
    "country": "string"
  },
  "createdAt": "date",
  "updatedAt": "date"
}
```

## Error Responses

All error responses follow this format:

```json
{
  "status": "error",
  "message": "Error description",
  "stack": "Error stack trace (development only)"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Pagination

List endpoints support pagination with the following query parameters:

- `page` (default: 1) - Page number
- `limit` (default: 10) - Items per page

Response includes pagination metadata:

```json
{
  "status": "success",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## Sorting

Product endpoints support sorting with the `sort` query parameter:

- `price_asc` - Price low to high
- `price_desc` - Price high to low
- `name_asc` - Name A-Z
- `name_desc` - Name Z-A
- `created_at` - Newest first

## Filtering

Order endpoints support filtering by status:

- `pending` - Pending orders
- `processing` - Processing orders
- `shipped` - Shipped orders
- `delivered` - Delivered orders
- `cancelled` - Cancelled orders

## Payment Integration

The API integrates with Paystack for payment processing:

1. **Initialize Payment**: Create a payment session
2. **Payment Verification**: Verify payment status
3. **Webhook Handling**: Process payment notifications

### Payment Flow

1. User creates an order
2. Initialize payment with Paystack
3. Redirect user to Paystack payment page
4. User completes payment
5. Paystack sends webhook notification
6. Update order payment status

## Environment Variables

Required environment variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smartgear
JWT_SECRET=your-jwt-secret
JWT_EXPIRE=30d
PAYSTACK_SECRET_KEY=your-paystack-secret-key
PAYSTACK_PUBLIC_KEY=your-paystack-public-key
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

## Development

### Running the Server

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run in production mode
npm start
```

### Database Seeding

```bash
# Seed the database with sample data
npm run seed

# Clear all data
npm run seed:destroy
```

## Testing the API

You can test the API using:

1. **Swagger UI**: Visit `/api-docs` for interactive documentation
2. **Postman**: Import the API endpoints
3. **cURL**: Use command line tools
4. **Frontend Application**: Use the React frontend

## Security Features

- JWT Authentication
- Password hashing with bcrypt
- CORS protection
- Helmet security headers
- Input validation with Joi
- Rate limiting (recommended for production)

## Rate Limiting

For production, consider implementing rate limiting:

```javascript
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100 
})

app.use('/api/', limiter)
```

## Monitoring and Logging

Consider implementing:

- Request logging with Morgan
- Error tracking with Sentry
- Performance monitoring
- Database query optimization

## Deployment

The API is ready for deployment on:

- **Vercel**: Serverless deployment
- **Heroku**: Traditional hosting
- **AWS**: Cloud infrastructure
- **DigitalOcean**: VPS hosting

## Support

For API support and questions:

- Email: support@smartgear.com
- Documentation: `/api-docs`
- GitHub Issues: [Repository Issues]

---

**SmartGear API v1.0.0** - Built with Node.js, Express, and MongoDB 