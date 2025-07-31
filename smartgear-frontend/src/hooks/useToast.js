import { useState, useCallback } from 'react'

// Global toast state - simple implementation
let globalToasts = []
let globalSetToasts = null

export const useToast = () => {
  const [toasts, setToasts] = useState([])
  
  // Register this component as the toast displayer
  if (!globalSetToasts) {
    globalSetToasts = setToasts
  }

  const addToast = useCallback(({
    title,
    description,
    variant = 'default',
    duration = 3000
  }) => {
    const id = Date.now() + Math.random()
    const toast = { id, title, description, variant, duration, show: true }
    
    globalToasts = [...globalToasts, toast]
    globalSetToasts?.(globalToasts)

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        globalToasts = globalToasts.filter(t => t.id !== id)
        globalSetToasts?.(globalToasts)
      }, duration + 300)
    }

    return id
  }, [])

  const removeToast = useCallback((id) => {
    globalToasts = globalToasts.filter(t => t.id !== id)
    globalSetToasts?.(globalToasts)
  }, [])

  const toast = useCallback((props) => addToast(props), [addToast])

  // Shorthand methods
  toast.success = useCallback((title, description) => 
    addToast({ title, description, variant: 'success' }), [addToast])
  
  toast.error = useCallback((title, description) => 
    addToast({ title, description, variant: 'error' }), [addToast])
  
  toast.info = useCallback((title, description) => 
    addToast({ title, description, variant: 'info' }), [addToast])

  return {
    toast,
    toasts,
    removeToast
  }
}

// Export a global toast function for use outside components
export const toast = {
  success: (title, description) => {
    const id = Date.now() + Math.random()
    const toastObj = { id, title, description, variant: 'success', duration: 3000, show: true }
    globalToasts = [...globalToasts, toastObj]
    globalSetToasts?.(globalToasts)
    
    setTimeout(() => {
      globalToasts = globalToasts.filter(t => t.id !== id)
      globalSetToasts?.(globalToasts)
    }, 3300)
  },
  
  error: (title, description) => {
    const id = Date.now() + Math.random()
    const toastObj = { id, title, description, variant: 'error', duration: 4000, show: true }
    globalToasts = [...globalToasts, toastObj]
    globalSetToasts?.(globalToasts)
    
    setTimeout(() => {
      globalToasts = globalToasts.filter(t => t.id !== id)
      globalSetToasts?.(globalToasts)
    }, 4300)
  },
  
  info: (title, description) => {
    const id = Date.now() + Math.random()
    const toastObj = { id, title, description, variant: 'info', duration: 3000, show: true }
    globalToasts = [...globalToasts, toastObj]
    globalSetToasts?.(globalToasts)
    
    setTimeout(() => {
      globalToasts = globalToasts.filter(t => t.id !== id)
      globalSetToasts?.(globalToasts)
    }, 3300)
  }
}