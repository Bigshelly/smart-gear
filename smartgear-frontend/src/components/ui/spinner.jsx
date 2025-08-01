import { cn } from '../../lib/utils'

const Spinner = ({ 
  size = 'md', 
  className = '',
  color = 'primary' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  const colorClasses = {
    primary: 'border-primary border-t-transparent',
    secondary: 'border-secondary border-t-transparent',
    muted: 'border-muted-foreground border-t-transparent',
    white: 'border-white border-t-transparent'
  }

  return (
    <div 
      className={cn(
        'border-2 rounded-full animate-spin',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
    />
  )
}

export default Spinner 