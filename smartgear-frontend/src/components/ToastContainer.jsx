import { Toast } from './ui/toast'
import { useToast } from '../hooks/useToast'

const ToastContainer = () => {
  const { toasts, removeToast } = useToast()

  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          duration={0} // Handled by the hook
          onClose={() => removeToast(toast.id)}
          show={toast.show}
        />
      ))}
    </>
  )
}

export default ToastContainer