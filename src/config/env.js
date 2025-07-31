// Environment configuration for SmartGear frontend

export const config = {
  // API Configuration
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  
  // Paystack Configuration
  PAYSTACK_PUBLIC_KEY: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_xxxxx',
  
  // App Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || 'SmartGear',
  APP_URL: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
  
  // Development flags
  DEBUG: import.meta.env.VITE_DEBUG === 'true' || false,
  MOCK_API: import.meta.env.VITE_MOCK_API === 'true' || true,
  
  // Environment detection
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  
  // Default settings
  DEFAULT_CURRENCY: 'GHS',
  TIMEOUT: 10000, // 10 seconds
  
  // Payment settings
  PAYMENT_CHANNELS: ['card', 'mobile_money', 'bank'],
  
  // Contact information
  SUPPORT_EMAIL: 'support@smartgear.com',
  SUPPORT_PHONE: '+233 20 123 4567',
}

export default config