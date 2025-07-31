import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price, currency = "GHS") {
  return `${currency} ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function formatPhoneNumber(phone) {
  // Format phone number for Ghana (+233)
  if (phone.startsWith('0')) {
    return '+233' + phone.slice(1)
  }
  if (!phone.startsWith('+233')) {
    return '+233' + phone
  }
  return phone
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateGhanaPhone(phone) {
  // Ghana mobile numbers (after +233) should be 9 digits starting with specific prefixes
  const cleanPhone = phone.replace(/\D/g, '')
  if (cleanPhone.length === 10 && cleanPhone.startsWith('0')) {
    return true
  }
  if (cleanPhone.length === 12 && cleanPhone.startsWith('233')) {
    return true
  }
  return false
}