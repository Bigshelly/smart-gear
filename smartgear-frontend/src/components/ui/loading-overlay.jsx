import Spinner from './spinner'

const LoadingOverlay = ({ 
  message = 'Loading...',
  show = false,
  className = ''
}) => {
  if (!show) return null

  return (
    <div className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center ${className}`}>
      <div className="bg-card border rounded-lg p-8 flex flex-col items-center space-y-4 shadow-lg">
        <Spinner size="xl" />
        <p className="text-muted-foreground font-medium">{message}</p>
      </div>
    </div>
  )
}

export default LoadingOverlay 