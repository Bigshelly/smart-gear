import { Link } from 'react-router-dom'
import { Smartphone } from 'lucide-react'
import CartIcon from './CartIcon'
import ProfileIcon from './ui/ProfileIcon'

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <Smartphone className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">SmartGear</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                All Products
              </Link>
              <button
                onClick={() => document.getElementById('contact-us')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
              >
                Contact
              </button>
            </nav>
          </div>

          {/* Profile and Cart Icons */}
          <div className="flex items-center space-x-2">
            <ProfileIcon />
            <CartIcon />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t py-4">
          <nav className="flex items-center justify-center space-x-6">
            <Link
              to="/"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Products
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
            >
              About
            </Link>
            <button
              onClick={() => document.getElementById('contact-us')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
            >
              Contact
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header