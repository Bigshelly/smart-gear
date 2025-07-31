import { useState, useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { cn } from '../../lib/utils'

const Toast = ({ 
  title, 
  description, 
  variant = 'default', 
  duration = 3000, 
  onClose,
  show = true
}) => {
  const [isVisible, setIsVisible] = useState(show)

  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => onClose?.(), 300) // Wait for exit animation
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [show, duration, onClose])

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    default: Info
  }

  const Icon = icons[variant] || icons.default

  if (!show) return null

  return (
    <div
      className={cn(
        "fixed top-20 right-4 z-40 w-full max-w-sm rounded-lg border bg-background p-4 shadow-lg transition-all duration-300",
        {
          "translate-x-0 opacity-100": isVisible,
          "translate-x-full opacity-0": !isVisible,
          "border-green-200 bg-green-50": variant === 'success',
          "border-red-200 bg-red-50": variant === 'error',
          "border-blue-200 bg-blue-50": variant === 'info',
        }
      )}
    >
      <div className="flex items-start gap-3">
        <Icon 
          className={cn(
            "h-5 w-5 mt-0.5",
            {
              "text-green-500": variant === 'success',
              "text-red-500": variant === 'error', 
              "text-blue-500": variant === 'info',
              "text-foreground": variant === 'default'
            }
          )} 
        />
        <div className="flex-1 space-y-1">
          {title && (
            <p className="text-sm font-medium leading-none">{title}</p>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(() => onClose?.(), 300)
          }}
          className="opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </div>
  )
}

export { Toast }