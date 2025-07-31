import { Outlet } from 'react-router-dom'
import Header from './Header'
import ToastContainer from './ToastContainer'
import CartDrawer from './CartDrawer'

const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <footer className="border-t py-8 mt-16 bg-blue-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; 2025 SmartGear. All rights reserved.</p>
            <p className="mt-2">Powered by Paystack for secure payments</p>
          </div>
        </div>
      </footer>
      <ToastContainer />
      <CartDrawer />
    </div>
  )
}

export default Layout