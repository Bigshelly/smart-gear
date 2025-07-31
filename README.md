# SmartGear Frontend

E-commerce frontend application for tech gadgets store with secure Paystack checkout integration. Built for hackathon team collaboration and rapid development.

## Project Overview

SmartGear is a modern e-commerce frontend designed for a tech gadgets store.

## Tech Stack

### Core Technologies
- **React 19.1.0** - Frontend framework
- **Vite 7.0.4** - Build tool and development server
- **React Router DOM 7.7.1** - Client-side routing
- **Tailwind CSS 3.4.17** - Utility-first CSS framework

### UI Components & Styling
- **Shadcn/ui** - Pre-built accessible components
  - Radix UI primitives (@radix-ui/react-*)
  - Class Variance Authority (cva)
  - Lucide React icons
- **Tailwind Merge** - Conditional styling utility
- **PostCSS & Autoprefixer** - CSS processing

### State Management & API
- **Axios 1.11.0** - HTTP client for API communication
- **React Hooks** - Built-in state management
- **Custom Hooks** - Payment and form handling

### Development Tools
- **ESLint 9.30.1** - Code linting
- **TypeScript types** - Type definitions for better DX

## Project Structure

```
smartgear-frontend/
├── public/                     # Static assets
│   └── vite.svg               # Vite logo
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Shadcn/ui components
│   │   │   ├── alert.jsx     # Alert notifications
│   │   │   ├── badge.jsx     # Status badges
│   │   │   ├── button.jsx    # Button variants
│   │   │   ├── card.jsx      # Card containers
│   │   │   ├── input.jsx     # Form inputs
│   │   │   └── label.jsx     # Form labels
│   │   ├── CheckoutForm.jsx  # Payment form component
│   │   ├── Header.jsx        # Navigation header
│   │   ├── Layout.jsx        # Page layout wrapper
│   │   ├── PaymentStatus.jsx # Payment result display
│   │   ├── ProductCard.jsx   # Individual product display
│   │   └── ProductGrid.jsx   # Product listing grid
│   ├── pages/                # Route components
│   │   ├── Home.jsx          # Landing page with product catalog
│   │   ├── Checkout.jsx      # Checkout process page
│   │   ├── Success.jsx       # Payment success page
│   │   └── Error.jsx         # Error handling page
│   ├── hooks/                # Custom React hooks
│   │   └── usePaystack.js    # Paystack payment integration
│   ├── services/             # API layer
│   │   └── api.js            # HTTP client and API functions
│   ├── data/                 # Static data and utilities
│   │   └── products.js       # Product catalog data
│   ├── config/               # Configuration files
│   │   └── env.js            # Environment variables
│   ├── lib/                  # Utility functions
│   │   └── utils.js          # Helper functions (validation, formatting)
│   ├── App.jsx               # Main application component
│   ├── App.css               # Global styles
│   ├── index.css             # Tailwind imports
│   └── main.jsx              # Application entry point
├── index.html                # HTML template
├── package.json              # Dependencies and scripts
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
├── vite.config.js            # Vite configuration
└── eslint.config.js          # ESLint configuration
```

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Git for version control
- Code editor (VS Code recommended)

### Step-by-Step Installation

1. **Clone and navigate to the project**
   ```bash
   git clone <repository-url>
   cd smartgear-checkout/smartgear-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env.local
   # Or create .env.local manually with required variables
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open application**
   - Navigate to `http://localhost:5173`
   - The app should reload automatically on file changes



## Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000

# Paystack Configuration (Required for payments)
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key_here

# Application Settings
VITE_APP_NAME=SmartGear
VITE_APP_URL=http://localhost:5173

# Development Flags
VITE_DEBUG=true
VITE_MOCK_API=true
```

### Required Variables
- `VITE_PAYSTACK_PUBLIC_KEY` - Paystack public key for payment processing
- `VITE_API_URL` - Backend API endpoint

### Optional Variables
- `VITE_DEBUG` - Enable debug logging
- `VITE_MOCK_API` - Use mock data instead of real API calls

## Component Architecture

### Design Patterns
- **Functional Components** - All components use React function syntax
- **Custom Hooks** - Business logic extracted to reusable hooks
- **Prop Drilling** - Simple prop passing (consider Context for complex state)
- **Composition** - Components built through composition patterns

### Component Responsibilities

#### Layout Components
- `Layout.jsx` - Page structure, header, footer
- `Header.jsx` - Navigation and branding

#### Product Components
- `ProductCard.jsx` - Individual product display with image, name, price, buy button
- `ProductGrid.jsx` - Grid layout for product listings with loading states

#### Checkout Components
- `CheckoutForm.jsx` - Customer details form with validation
- `PaymentStatus.jsx` - Payment result display

#### UI Components (Shadcn/ui)
- `Button`, `Input`, `Label` - Form elements
- `Card`, `Alert`, `Badge` - Layout and status components

### Props Pattern
```jsx
// Product Card Example
<ProductCard 
  product={{ id, name, price, image, inStock }}
  onPurchase={(productId) => navigate(`/checkout/${productId}`)}
/>

// Checkout Form Example
<CheckoutForm 
  product={product}
  onPaymentSuccess={(reference) => handleSuccess(reference)}
/>
```

## Routing Structure

```jsx
// App.jsx routing configuration
<Routes>
  <Route path="/" element={<Layout />}>
    <Route index element={<Home />} />                    // Landing page
    <Route path="checkout/:productId" element={<Checkout />} />  // Checkout flow
    <Route path="success" element={<Success />} />        // Payment success
    <Route path="error" element={<Error />} />            // Error handling
    <Route path="*" element={<NotFound />} />             // 404 fallback
  </Route>
</Routes>
```

### Route Purposes
- `/` - Product catalog with category filtering
- `/checkout/:productId` - Secure checkout for specific product
- `/success` - Payment confirmation and order details
- `/error` - Payment failure or system error handling

## API Integration

### Service Layer Architecture
The frontend uses a centralized API service (`src/services/api.js`) built on Axios:

```javascript
// API Base Configuration
const api = axios.create({
  baseURL: process.env.VITE_API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})
```

### Expected Backend Endpoints
```
GET    /api/products              # Fetch all products
GET    /api/products/:id          # Fetch single product
POST   /api/payments/initialize   # Initialize Paystack payment
GET    /api/payments/verify/:ref  # Verify payment status
```

### API Functions
- `getProducts()` - Fetch product catalog
- `getProduct(id)` - Fetch single product details
- `initializePayment(data)` - Start payment process
- `verifyPayment(reference)` - Confirm payment completion

### Error Handling
- Axios interceptors for request/response logging
- Consistent error message structure
- Fallback to local data when API unavailable

## Styling Guide

### Tailwind CSS Conventions

#### Color System
```css
/* Primary colors from CSS variables */
background: "hsl(var(--background))"
foreground: "hsl(var(--foreground))"
primary: "hsl(var(--primary))"
muted: "hsl(var(--muted))"
```

#### Component Styling Patterns
```jsx
// Button variants
<Button variant="default|outline|ghost" size="sm|md|lg" />

// Card layouts
<Card className="p-6 rounded-lg border">
  <CardHeader>
    <CardTitle className="text-2xl font-bold" />
  </CardHeader>
</Card>

// Responsive grids
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" />
```

### Shadcn/ui Component Usage
- Import components from `./components/ui/`
- Use `cn()` utility for conditional classes
- Follow component prop interfaces
- Customize using Tailwind classes

### Style Guidelines
- Mobile-first responsive design
- Consistent spacing using Tailwind scale
- Dark mode support through CSS variables
- Accessibility considerations (focus states, ARIA labels)

## Development Workflow

### Running the Application
```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Development Process
1. **Start development server** - `npm run dev`
2. **Make changes** - Files auto-reload on save
3. **Test features** - Verify functionality in browser
4. **Check linting** - Run `npm run lint` before committing
5. **Build for production** - `npm run build` to verify build

### Team Collaboration
- Use feature branches for new functionality
- Regular commits with descriptive messages
- Code review before merging to main
- Share environment variables securely
- Coordinate on component interfaces

## Features Status

### ✅ Completed Features (Working & Tested)
- [x] **Product Catalog Display** - Grid layout with category filtering
- [x] **Product Categories** - Smartphones, Laptops, Audio, Tablets, Wearables
- [x] **Responsive Design** - Mobile-first layout across all devices
- [x] **Product Details** - Image, name, price, specifications display
- [x] **Checkout Form** - Customer details collection with validation
- [x] **Form Validation** - Email, phone number, name validation
- [x] **Paystack Integration** - Payment initialization hook
- [x] **Loading States** - Skeleton screens and loading indicators
- [x] **Error Handling** - User-friendly error messages
- [x] **Navigation** - React Router setup with proper routing

### 🔄 In Progress Features (Currently Being Developed)
- [ ] **Payment Verification** - Backend integration for payment confirmation
- [ ] **Product Search** - Search functionality across product catalog
- [ ] **Shopping Cart** - Multi-product cart system

### 🎯 To-Do Features (Priority 1 - Required for Hackathon)
- [ ] **Backend API Integration** - Connect to real product/payment APIs
- [ ] **Payment Success Flow** - Complete post-payment user experience
- [ ] **Error Page Enhancement** - Comprehensive error handling
- [ ] **Performance Optimization** - Image lazy loading, code splitting
- [ ] **Accessibility Improvements** - ARIA labels, keyboard navigation
- [ ] **SEO Optimization** - Meta tags, Open Graph data
- [ ] **About Page**
-Yet to be built
- [ ] **Contact Page**
-Yet to be built

### 📋 To-Do Features (Maybe some features we can add)
- [ ] **User Authentication** - Login/signup system, waiting on backend api
- [ ] **Order History** - Past purchase tracking
- [ ] **Product Filtering** - Advanced filter options (price, brand)
- [ ] **Admin Dashboard** - Product management interface
- [ ] **Analytics Integration** - User behavior tracking
- [ ] **Wishlist Functionality** - Save products for later
- [ ] **Product Reviews** - Customer review system
- [ ] **Inventory Management** - Stock level display

### 🌟 Nice-to-Have Features (some more maybe features)
- [ ] **Dark Mode Toggle** - Manual theme switching
- [ ] **Social Sharing** - Share products on social media
- [ ] **Progressive Web App** - PWA capabilities


## Code Standards

### File Naming Conventions
```
PascalCase:  Components (ProductCard.jsx, CheckoutForm.jsx)
camelCase:   Hooks (usePaystack.js), utilities (utils.js)
kebab-case:  CSS files, assets (app.css, product-image.jpg)
lowercase:   Config files (package.json, tailwind.config.js)
```

### Component Structure Template
```jsx
import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { cn } from '../lib/utils'

const ComponentName = ({ prop1, prop2, className, ...props }) => {
  const [state, setState] = useState(initialValue)
  
  const handleAction = () => {
    // Event handlers
  }
  
  return (
    <div className={cn("base-classes", className)} {...props}>
      {/* Component JSX */}
    </div>
  )
}

export default ComponentName
```

### Import Conventions
```jsx
// External libraries first
import React from 'react'
import { useState } from 'react'

// Internal components
import Header from './components/Header'
import { Button } from './components/ui/button'

// Utilities and config
import { cn } from './lib/utils'
import config from './config/env'

// Styles last
import './Component.css'
```

### State Management Patterns
- Use `useState` for component state
- Use `useEffect` for side effects
- Extract complex logic to custom hooks
- Keep components focused and single-purpose





## Available Scripts

```bash
# Development
npm run dev          # Start development server (http://localhost:5173)
npm run start        # Alias for npm run dev

# Building
npm run build        # Create production build in dist/
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Run ESLint on all source files
npm run type-check   # Run TypeScript type checking (if applicable)

# Maintenance
npm run clean        # Remove dist/ and node_modules/.vite cache
npm run serve        # Alias for npm run preview
```


#### Styling Issues
- Verify Tailwind CSS is properly configured
- Check CSS variable definitions in `index.css`
- Ensure component imports are correct
- Use browser dev tools to inspect applied styles

### Getting Help
- **Frontend Issues**: Check component documentation, Tailwind docs
- **Payment Issues**: Refer to Paystack documentation
- **Build Issues**: Check Vite documentation
- **Team Communication**: Use project communication channels

### Debug Mode
Enable debug mode in `.env.local`:
```env
VITE_DEBUG=true
```
This enables console logging for API calls and payment flows.

---

## Quick Start for New Team Members

1. **Clone repo**: `git clone <repo> && cd smartgear-frontend`
2. **Install**: `npm install`
3. **Setup env**: Copy `.env.example` to `.env.local` and add Paystack key
4. **Start dev**: `npm run dev`
5. **Open browser**: `http://localhost:5173`
6. **Check features**: Browse products, test checkout form
7. **Pick task**: Review "Available Task Assignments" section above

Ready to contribute! Check the to-do lists and coordinate with team members on current priorities.
