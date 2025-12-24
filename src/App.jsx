// Update App.jsx - tambahkan import Report dan rutenya
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import LoginSelection from './pages/LoginSelection';
import CustomerLogin from './pages/login/CustomerLogin';
import AdminLogin from './pages/login/AdminLogin';
import AdminDashboard from './pages/admin/AdminDasboard';
import Report from './pages/admin/Report'; // ← Tambahkan import ini
import Footer from './components/Footer';
import './App.css';
import './components/ProductCard.css';

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false, requireLogin = false }) => {
  const { user } = useAuth();

  // Jika memerlukan login tapi user belum login
  if (requireLogin && !user) {
    return <Navigate to="/login" />;
  }

  // Jika memerlukan admin tapi user bukan admin atau tidak login
  if (requireAdmin && (!user || user.role !== 'admin')) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Header />
            <main>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<CustomerLogin />} />
                <Route path="/login/admin" element={<AdminLogin />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                
                {/* Protected Checkout Route - Hanya untuk logged in users */}
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute requireLogin>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                
                {/* Protected Admin Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                
                {/* Tambahkan rute untuk Reports */}
                <Route
                  path="/admin/reports"
                  element={
                    <ProtectedRoute requireAdmin>
                      <Report />
                    </ProtectedRoute>
                  }
                />
                
                {/* Redirect unknown routes */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;