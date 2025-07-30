# SmartGear Frontend



## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

1. **Clone and install**:
```bash
git clone <repository-url>
cd smartgear-frontend
npm install
```

2. **Start development**:
```bash
npm run dev
```

3. **Open in browser**: `http://localhost:5173`

That's it! 🎉 The app runs with mock data by default.

### Team Setup

For team collaboration:

1. **Create environment file** (optional):
```bash
# Create .env file for custom settings
VITE_API_URL=http://localhost:5000
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_key_here
```

2. **Mobile testing**:
```bash
npm run dev -- --host
# Access via your IP: http://192.168.x.x:5173
```

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Shadcn/ui components
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Payment**: Paystack integration

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ui/              # Shadcn components
│   ├── Layout.jsx       # Main app layout
│   ├── Header.jsx       # Navigation header
│   ├── ProductCard.jsx  # Individual product card
│   ├── ProductGrid.jsx  # Grid of products
│   ├── CheckoutForm.jsx # Customer details form
│   └── PaymentStatus.jsx # Success/error messages
├── pages/
│   ├── Home.jsx         # Product catalog page
│   ├── Checkout.jsx     # Checkout process page
│   ├── Success.jsx      # Payment success page
│   └── Error.jsx        # Payment error page
├── hooks/
│   └── usePaystack.js   # Custom hook for payment logic
├── services/
│   └── api.js           # API calls to backend
├── data/
│   └── products.js      # Mock product data
├── config/
│   └── env.js           # Environment configuration
├── lib/
│   └── utils.js         # Utility functions
└── App.jsx              # Main app component
```

## 📱 Pages & Routes

- **`/`** - Home page with product catalog
- **`/checkout/:productId`** - Checkout page for specific product
- **`/success`** - Payment success confirmation
- **`/error`** - Payment error handling

## 🎨 Design System

The app uses a consistent design system based on:
- **Colors**: Professional blue/slate theme
- **Typography**: Clean, readable fonts with proper hierarchy
- **Spacing**: Consistent spacing using Tailwind spacing scale
- **Components**: Shadcn/ui for consistent interactive elements

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run clean` - Clean build artifacts

## 🔌 API Integration

The frontend is designed to work with a backend API with the following endpoints:

- `GET /api/products` - Fetch all products
- `GET /api/products/:id` - Fetch single product
- `POST /api/payments/initialize` - Initialize payment
- `GET /api/payments/verify/:reference` - Verify payment

When `VITE_MOCK_API=true`, the app uses mock data for development.

## 💳 Payment Flow

1. User selects product and clicks "Buy Now"
2. User fills out checkout form with personal details
3. Payment is initialized with Paystack
4. User is redirected to Paystack payment page
5. After payment, user is redirected back to success/error page
6. Payment is verified with backend

## 📱 Mobile Optimization

- Responsive grid layouts (1-4 columns based on screen size)
- Touch-friendly button sizes
- Mobile-optimized forms
- Swipe gestures support
- Progressive Web App ready

## 🚀 Deployment

1. **Build the application**:
```bash
npm run build
```

2. **Deploy the `dist` folder** to your hosting provider:
   - Netlify
   - Vercel
   - AWS S3 + CloudFront
   - Any static hosting service

3. **Environment Variables**: Make sure to set production environment variables on your hosting platform.

## 🔐 Security Features

- Input validation and sanitization
- XSS protection
- CSRF protection
- Secure payment processing through Paystack
- Environment variable protection

## 🎯 Performance Optimizations

- Code splitting with React Router
- Image optimization and lazy loading
- Minimized bundle size
- Efficient re-rendering with React hooks
- Caching strategies for API calls

## 🐛 Error Handling

- Graceful error boundaries
- User-friendly error messages
- Network error handling
- Payment failure recovery
- Loading states throughout the app

## 🧪 Testing

The project is set up for testing with:
- Component testing setup
- API mocking capabilities
- E2E testing ready

## 📞 Support

For support and questions:
- **Email**: support@smartgear.com
- **Phone**: +233 20 123 4567
- **Live Chat**: Available 9AM-6PM (Mon-Fri)

## 📄 License

This project is built for a hackathon and is available under the MIT License.

---

Built with ❤️ for the SmartGear hackathon project.