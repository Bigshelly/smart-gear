import { useNavigate } from 'react-router-dom'
import { UserPlus, LogIn, ShoppingCart } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from './ui/dialog'
import { Button } from './ui/button'

const AuthModal = ({ 
  open, 
  onOpenChange, 
  title = "Authentication Required",
  message = "You need to be logged in to continue with your purchase.",
  redirectPath = null,
  onLogin,
  onSignUp
}) => {
  const navigate = useNavigate()

  const handleLogin = () => {
    onOpenChange(false)
    
    // Store redirect path if provided
    if (redirectPath) {
      sessionStorage.setItem('redirectAfterLogin', redirectPath)
    }
    
    if (onLogin) {
      onLogin()
    } else {
      navigate('/login')
    }
  }

  const handleSignUp = () => {
    onOpenChange(false)
    
    // Store redirect path if provided
    if (redirectPath) {
      sessionStorage.setItem('redirectAfterLogin', redirectPath)
    }
    
    if (onSignUp) {
      onSignUp()
    } else {
      navigate('/sign-up')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md mx-4">
        <DialogClose onClick={() => onOpenChange(false)} />
        
        <DialogHeader className="text-center">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-full">
            <ShoppingCart className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle>
            {title}
          </DialogTitle>
          <DialogDescription>
            {message}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-col gap-3 mt-6">
          <Button 
            onClick={handleLogin}
            className="w-full"
            size="lg"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Log In
          </Button>
          
          <Button 
            onClick={handleSignUp}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Sign Up
          </Button>
          
          <Button 
            onClick={() => onOpenChange(false)}
            variant="ghost"
            className="w-full text-muted-foreground mt-2"
          >
            Continue Browsing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AuthModal