

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="product/:productId" element={<ProductDetails />} />
            <Route path="checkout/:productId" element={<Checkout />} />
            <Route path="success" element={<Success />} />
            <Route path="error" element={<Error />} />
            {/* Catch all route for 404 */}
            <Route path="*" element={
              <div className="text-center py-16">
                <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
                <p className="text-muted-foreground mb-6">The page you're looking for doesn't exist.</p>
                <a href="/" className="text-primary hover:underline">Go back home</a>
              </div>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}

export default Appert