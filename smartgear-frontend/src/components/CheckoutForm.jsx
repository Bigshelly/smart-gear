import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Alert, AlertDescription } from './ui/alert'
import { AlertCircle, Loader2, CreditCard, ShoppingCart } from 'lucide-react'
import { validateEmail, validateGhanaPhone, formatPhoneNumber, formatPrice } from '../lib/utils'
import usePaystack from '../hooks/usePaystack'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useLocation } from 'react-router-dom'

const CheckoutForm = ({ product }) => {
  const location = useLocation()
  const { cartItems, getCartTotal } = useCart()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    region: '',
    postalCode: '',
  })
  const [formErrors, setFormErrors] = useState({})
  const { loading, error, initializePayment } = usePaystack()

  const isCartCheckout = location.state?.fromCart
  const totalAmount = isCartCheckout ? getCartTotal() : (product?.price || 0)
  const currency = isCartCheckout ? 'GHS' : (product?.currency || 'GHS')

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

    // Address validation
    if (!formData.address.trim()) {
      errors.address = 'Address is required'
    }

    // City validation
    if (!formData.city.trim()) {
      errors.city = 'City is required'
    }

    // Region validation
    if (!formData.region.trim()) {
      errors.region = 'Region is required'
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
      amount: totalAmount,
      currency: currency,
      customerName: formData.fullName.trim(),
      phone: formatPhoneNumber(formData.phone.trim()),
      userId: user?.id || user?._id, // Include user ID for backend cart clearing
      shippingAddress: {
        address: formData.address.trim(),
        city: formData.city.trim(),
        region: formData.region.trim(),
        postalCode: formData.postalCode.trim() || null
      },
      ...(isCartCheckout 
        ? {
            cartItems: cartItems.map(item => ({
              id: item._id || item.id,
              name: item.name,
              quantity: item.quantity,
              price: item.price
            }))
          }
        : {
            productId: product._id || product.id,
            productName: product.name
          }
      )
    }

    await initializePayment(paymentInfo)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-muted-foreground">Complete your purchase securely</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isCartCheckout ? (
                  <ShoppingCart className="h-5 w-5" />
                ) : (
                  <CreditCard className="h-5 w-5" />
                )}
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isCartCheckout ? (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item._id || item.id} className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        <p className="text-lg font-bold text-primary mt-1">
                          {formatPrice(item.price * item.quantity, currency)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total:</span>
                      <span className="text-xl font-bold text-primary">
                        {formatPrice(totalAmount, currency)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : product ? (
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
              ) : null}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Customer Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Customer Information</CardTitle>
                <span className="text-sm text-muted-foreground">Step 1 of 2</span>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Personal Details</h3>
                  
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className={formErrors.fullName ? 'border-destructive' : ''}
                    />
                    {formErrors.fullName && (
                      <p className="text-sm text-destructive">{formErrors.fullName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      className={formErrors.email ? 'border-destructive' : ''}
                    />
                    {formErrors.email && (
                      <p className="text-sm text-destructive">{formErrors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
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
                  </div>
                </div>

                {/* Shipping Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Shipping Details</h3>
                  
                  {/* Address */}
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="123 Main Street"
                      className={formErrors.address ? 'border-destructive' : ''}
                    />
                    {formErrors.address && (
                      <p className="text-sm text-destructive">{formErrors.address}</p>
                    )}
                  </div>

                  {/* City and Region */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        type="text"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Accra"
                        className={formErrors.city ? 'border-destructive' : ''}
                      />
                      {formErrors.city && (
                        <p className="text-sm text-destructive">{formErrors.city}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="region">Region</Label>
                      <Input
                        id="region"
                        name="region"
                        type="text"
                        value={formData.region}
                        onChange={handleInputChange}
                        placeholder="Greater Accra"
                        className={formErrors.region ? 'border-destructive' : ''}
                      />
                      {formErrors.region && (
                        <p className="text-sm text-destructive">{formErrors.region}</p>
                      )}
                    </div>
                  </div>

                  {/* Postal Code */}
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code (Optional)</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      type="text"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="GA-123-4567"
                      className={formErrors.postalCode ? 'border-destructive' : ''}
                    />
                    {formErrors.postalCode && (
                      <p className="text-sm text-destructive">{formErrors.postalCode}</p>
                    )}
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Payment Information Card */}
                <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-900 mb-2">Secure Payment with Praystack</h4>
                      <p className="text-sm text-blue-700 mb-3">
                        After clicking "Proceed to Payment", you will be redirected to Paystack's secure payment page where you can:
                      </p>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Pay with your debit/credit card</li>
                        <li>• Use mobile money (MTN, Vodafone, AirtelTigo)</li>
                      </ul>
                    </div>
                  </div>
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
                      Redirecting to Paystack...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Proceed to Payment - {formatPrice(totalAmount, currency)}
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By proceeding, you agree to our terms and conditions. Your payment is secured by Paystack.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CheckoutForm