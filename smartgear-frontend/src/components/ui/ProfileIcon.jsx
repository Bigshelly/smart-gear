import { User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ProfileIcon = () => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/account')
  }
//handle click button to go to account page
  return (
    <button 
      onClick={handleClick}
      className="p-2 hover:bg-muted rounded-lg transition-colors"
      aria-label="Go to account page"
    >
      <User className="h-6 w-6 text-foreground" />
    </button>
  )
}

export default ProfileIcon
