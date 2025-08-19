import Header from './components/Header'
import HeroBanner from './components/Banner'
import ProductList from './components/ProducsList'
import ProductDetail from './components/ProductDetail'
import AdminPanel from './components/AdminPanel'
import AllProducts from './components/AllProducts'
import Dashboard from './components/Dashboard'
import PrivateRoute from './components/PrivateRoute'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/Register'
import { CartProvider } from './components/CartContext'
import CartPage from './components/CartPage'
import { ToastContainer } from 'react-toastify'
import "react-toastify/ReactToastify.css"
import { AuthProvider } from './components/AuthContext'
import CheckoutPage from './components/CheckoutPage'
function App() {
  return (
    <CartProvider>

      <AuthProvider>
        <Router>

          <Header />
          <main className="p-6">
            <Routes>
              {/*Trang chu*/}
              <Route
                path='/'
                element={
                  <>
                    <HeroBanner />
                    <h2 className="text-3xl font-semibold mb-4">🔥 Sản phẩm nổi bật</h2>
                    <ProductList />
                  </>
                }
              />
              <Route path='/login' element={<LoginForm />} />
              <Route path='/register' element={<RegisterForm />} />
              <Route path='/products' element={<AllProducts />} />
              <Route path='/products/:id' element={<ProductDetail />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              {/* Admin panel - only admin can access */}
              <Route path='/cart' element={<CartPage />} />
              <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
              <Route path="/admin" element={<PrivateRoute requireAdmin={true}><AdminPanel /></PrivateRoute>} />


            </Routes>
          </main>
          <ToastContainer />
        </Router>
      </AuthProvider>

    </CartProvider>


  );
}

export default App;
