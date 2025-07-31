import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'
import Checkout from './pages/Checkout'
import Success from './pages/Success'
import Error from './pages/Error'
import Account from './pages/Account'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
        <Routes>
          {/* Auth routes (without layout) */}
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          
          {/* Main app routes (with layout) */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="product/:productId" element={<ProductDetails />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="checkout/:productId" element={<Checkout />} />
            <Route path="success" element={<Success />} />
            <Route path="error" element={<Error />} />
            <Route path="account" element={<Account />} />
            {/* Catch all route for 404 */}
            <Route path="*" element={
              <div className="text-center py-16">
                <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
                <p className="text-muted-foreground mb-6">The page you're looking for doesn't exist.</p>
                <a href="/" className="text-primary hover:underline">Go back home</a>
              </div>
            } />
          </Route>
        </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App