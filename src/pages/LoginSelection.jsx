import { Link } from 'react-router-dom';
import { ShoppingBag, Shield, ArrowLeft, Users, Package, Settings } from 'lucide-react';

const LoginSelection = () => {
  return (
    <div className="login-selection-container">
      <div className="container">
        {/* Back Button */}
        <Link to="/" className="back-button">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        {/* Header */}
        <div className="selection-header">
          <h1 className="selection-title">Choose Login Type</h1>
          <p className="selection-subtitle">
            Select how you want to access the system
          </p>
        </div>

        {/* Login Options Grid */}
        <div className="selection-grid">
          {/* Customer Login Card */}
          <Link to="/login" className="selection-card customer-card">
            <div className="card-icon">
              <Users size={40} />
            </div>
            <div className="card-content">
              <h3 className="card-title">Customer Login</h3>
              <p className="card-description">
                Browse products, add to cart, and make purchases. 
                Experience seamless shopping with exclusive deals.
              </p>
            </div>
            <div className="card-footer">
              <span className="card-action">
                Login as Customer
                <ShoppingBag size={18} />
              </span>
            </div>
          </Link>
{/* 
          Admin Login Card
          <Link to="/login/admin" className="selection-card admin-card">
            <div className="card-icon">
              <Shield size={40} />
            </div>
            <div className="card-content">
              <h3 className="card-title">Admin Login</h3>
              <p className="card-description">
                Manage products, orders, and view sales reports. 
                Access admin dashboard for store management.
              </p>
            </div>
            <div className="card-footer">
              <span className="card-action">
                Login as Admin
                <Settings size={18} />
              </span>
            </div>
          </Link> */}
        </div>

        {/* Guest Option */}
        <div className="guest-section">
          <div className="guest-card">
            <div className="guest-icon">
              <Package size={32} />
            </div>
            <div className="guest-content">
              <h3 className="guest-title">Continue as Guest</h3>
              <p className="guest-description">
                You can browse products and add them to cart without logging in. 
                Login is only required for checkout.
              </p>
            </div>
            <Link to="/products" className="btn btn-secondary">
              Browse Products
            </Link>
          </div>
        </div>

        {/* Demo Credentials */}
        {/* <div className="demo-section">
          <h3 className="demo-title">Demo Credentials</h3>
          <div className="demo-credentials">
            <div className="demo-card">
              <h4>Customer Account</h4>
              <p><strong>Email:</strong> customer@example.com</p>
              <p><strong>Password:</strong> customer123</p>
            </div>
            <div className="demo-card">
              <h4>Admin Account</h4>
              <p><strong>Email:</strong> admin@shop.com</p>
              <p><strong>Password:</strong> admin123</p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default LoginSelection;