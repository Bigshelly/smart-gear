import { useState, useEffect } from 'react'
import { User, Mail, Phone, MapPin, Package, CreditCard, Settings, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { useAuth } from '../context/AuthContext'
import { getUserOrders, getUserOrderStats } from '../services/api'

const Account = () => {
  const { user: authUser, loading, isAuthenticated } = useAuth()
  const [userData, setUserData] = useState(null)
  const [orders, setOrders] = useState([])
  const [orderStats, setOrderStats] = useState(null)
  const [ordersLoading, setOrdersLoading] = useState(true)

  useEffect(() => {
    if (authUser) {
      setUserData({
        name: authUser.fullName || 'User',
        email: authUser.email || '',
        phone: authUser.phone || '',
        address: "Address not provided", // User model doesn't have address yet
        joinDate: authUser.createdAt ? new Date(authUser.createdAt).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long'
        }) : 'Recently',
        role: authUser.role || 'user',
        lastLogin: authUser.lastLogin ? new Date(authUser.lastLogin).toLocaleDateString() : 'Unknown'
      })
      
      // Fetch order data
      fetchOrderData()
    }
  }, [authUser])

  const fetchOrderData = async () => {
    try {
      setOrdersLoading(true)
      
      // Fetch recent orders and stats in parallel
      const [ordersResponse, statsResponse] = await Promise.all([
        getUserOrders({ limit: 5 }), // Get last 5 orders
        getUserOrderStats()
      ])
      
      if (ordersResponse.status === 'success') {
        setOrders(ordersResponse.data.orders || [])
      }
      
      if (statsResponse.status === 'success') {
        setOrderStats(statsResponse.data.stats)
      }
    } catch (error) {
      console.error('Error fetching order data:', error)
      setOrders([])
      setOrderStats({ totalOrders: 0, totalSpent: 0 })
    } finally {
      setOrdersLoading(false)
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
          <p className="text-gray-600">Loading your account information...</p>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-48 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 p-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Access</h1>
          <p className="text-gray-600 mb-6">Please sign in to view your account information</p>
          <Button onClick={() => window.location.href = '/login'}>
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
          <p className="text-gray-600">Unable to load account information</p>
        </div>
      </div>
    )
  }

  // Helper function to format order status
  const formatOrderStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-yellow-100 text-yellow-800'
      case 'pending':
        return 'bg-orange-100 text-orange-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
        <p className="text-gray-600">Manage your profile and view your order history</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Section */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <User className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-xl">{userData.name}</CardTitle>
              <CardDescription>
                Member since {userData.joinDate}
                {userData.role === 'admin' && (
                  <Badge className="ml-2 text-xs" variant="secondary">Admin</Badge>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{userData.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{userData.phone || 'Phone not provided'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-gray-400 italic">{userData.address}</span>
              </div>
              
              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {ordersLoading ? '...' : (orderStats?.totalOrders || 0)}
                    </div>
                    <div className="text-xs text-gray-500">Orders</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      GHS {ordersLoading ? '...' : (orderStats?.totalSpent || 0).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">Total Spent</div>
                  </div>
                </div>
              </div>

              {userData.lastLogin && (
                <div className="pt-2 text-center">
                  <p className="text-xs text-gray-500">
                    Last login: {userData.lastLogin}
                  </p>
                </div>
              )}

              <Button className="w-full mt-4" variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Orders Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Recent Orders
              </CardTitle>
              <CardDescription>Your recent purchase history</CardDescription>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-gray-200 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : orders.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-medium">Order #{order.orderNumber}</span>
                            <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                              {formatOrderStatus(order.status)}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} item{order.items.length > 1 ? 's' : ''}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">GHS {order.totalAmount.toFixed(2)}</div>
                          <Button variant="ghost" size="sm" className="text-primary">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Button variant="outline">
                      View All Orders
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                  <p className="text-gray-600 mb-6">
                    You haven't placed any orders yet. Start shopping to see your orders here!
                  </p>
                  <Button onClick={() => window.location.href = '/'}>
                    Start Shopping
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Card>
              <CardContent className="p-6 text-center">
                <CreditCard className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Payment Methods</h3>
                <p className="text-sm text-gray-600 mb-4">Manage your saved payment methods</p>
                <Button variant="outline" size="sm">Manage</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Addresses</h3>
                <p className="text-sm text-gray-600 mb-4">Manage your delivery addresses</p>
                <Button variant="outline" size="sm">Manage</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Account