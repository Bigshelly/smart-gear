import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Alert, AlertDescription } from './ui/alert'
import { AlertCircle, Loader2, CreditCard } from 'lucide-react'
import { validateEmail, validateGhanaPhone, formatPhoneNumber, formatPrice } from '../lib/utils'
import usePaystack from '../hooks/usePaystack'

const CheckoutForm = ({ product }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  })
  const [formErrors, setFormErrors] = useState({})
  const { loading, error, initializePayment } = usePaystack()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const errors = {}

    // Full name validation
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required'
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters'
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    // Phone validation
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required'
    } else if (!validateGhanaPhone(formData.phone)) {
      errors.phone = 'Please enter a valid Ghana phone number (e.g., 0241234567)'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const paymentInfo = {
      email: formData.email.trim(),
      amount: product.price,
      currency: product.currency,
      customerName: formData.fullName.trim(),
      phone: formatPhoneNumber(formData.phone.trim()),
      productId: product.id,
      productName: product.name,
    }

    await initializePayment(paymentInfo)
  }

  return (
    <div className="space-y-6">
      {/* Product Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 object-cover rounded-md"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-muted-foreground">{product.category}</p>
              <p className="text-lg font-bold text-primary mt-1">
                {formatPrice(product.price, product.currency)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Details Form */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Details</CardTitle>
          <CardDescription>
            Please provide your details to complete the purchase
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={formErrors.fullName ? 'border-destructive' : ''}
              />
              {formErrors.fullName && (
                <p className="text-sm text-destructive">{formErrors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                className={formErrors.email ? 'border-destructive' : ''}
              />
              {formErrors.email && (
                <p className="text-sm text-destructive">{formErrors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="0241234567"
                className={formErrors.phone ? 'border-destructive' : ''}
              />
              {formErrors.phone && (
                <p className="text-sm text-destructive">{formErrors.phone}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Ghana phone number format (e.g., 0241234567)
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Payment Info */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Payment Information</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Secure payment powered by Paystack</li>
                <li>• Supports cards and mobile money</li>
                <li>• Your payment information is encrypted</li>
                <li>• You will be redirected to complete payment</li>
              </ul>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay {formatPrice(product.price, product.currency)}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default CheckoutForm