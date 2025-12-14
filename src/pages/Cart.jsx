import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  Package,
  Lock,
  User
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { cartItems, getTotalItems, getTotalPrice, clearCart, removeFromCart, updateQuantity } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      // Redirect ke login jika belum login
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    
    // Jika sudah login, lanjut ke checkout
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-icon">🛒</div>
        <h1 className="empty-cart-title">Your Cart is Empty</h1>
        <p className="empty-cart-text">
          Looks like you haven't added any products to your cart yet. Start
          shopping to discover amazing products!
        </p>
        <Link to="/products" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <ShoppingBag size={20} />
          Browse Products
        </Link>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const shipping = subtotal > 50 ? 0 : 5;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <div className="cart-page container">
      <h1 className="cart-title">Your Shopping Cart ({getTotalItems()} items)</h1>
      
      <div className="cart-container">
        {/* Cart Items */}
        <div className="cart-items">
          <div className="cart-header">
            <div>Product</div>
            <div>Price</div>
            <div>Quantity</div>
            <div>Subtotal</div>
          </div>
          
          {/* Map through cart items */}
          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className="product-info-cart">
                <div className="product-image-cart">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="product-details-cart">
                  <h3 className="product-title-cart">{item.title}</h3>
                  <span className="product-category-cart">{item.category}</span>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>
                </div>
              </div>
              
              <div className="price-cart">${item.price.toFixed(2)}</div>
              
              <div className="quantity-controls">
                <button
                  className="quantity-btn"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <Minus size={18} />
                </button>
                <input
                  type="number"
                  className="quantity-input"
                  value={item.quantity}
                  min="1"
                  max="10"
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                />
                <button
                  className="quantity-btn"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  disabled={item.quantity >= 10}
                >
                  <Plus size={18} />
                </button>
              </div>
              
              <div className="subtotal-cart">${(item.price * item.quantity).toFixed(2)}</div>
              
              {/* Mobile View */}
              <div className="mobile-cart-row">
                <span className="mobile-label">Price:</span>
                <span className="mobile-value price-cart">${item.price.toFixed(2)}</span>
              </div>
              <div className="mobile-cart-row">
                <span className="mobile-label">Quantity:</span>
                <div className="quantity-controls">
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    className="quantity-input"
                    value={item.quantity}
                    min="1"
                    max="10"
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                  />
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= 10}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <div className="mobile-cart-row">
                <span className="mobile-label">Subtotal:</span>
                <span className="mobile-value subtotal-cart">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          ))}
          
          {/* Clear Cart Button */}
          <div className="cart-actions" style={{ padding: '24px', textAlign: 'right' }}>
            <button
              className="btn remove-btn"
              onClick={clearCart}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Trash2 size={18} />
              Clear Cart
            </button>
          </div>
        </div>
        
        {/* Cart Summary */}
        <div className="cart-summary">
          <h2 className="summary-title">Order Summary</h2>
          
          <div className="summary-details">
            <div className="summary-row">
              <span className="summary-label">Subtotal</span>
              <span className="summary-value">${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="summary-row">
              <span className="summary-label">Shipping</span>
              <span className="summary-value">
                {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                {subtotal > 50 && (
                  <span style={{ color: '#10b981', fontSize: '12px', marginLeft: '8px' }}>
                    (Free shipping on orders over $50)
                  </span>
                )}
              </span>
            </div>
            
            <div className="summary-row">
              <span className="summary-label">Tax (10%)</span>
              <span className="summary-value">${tax.toFixed(2)}</span>
            </div>
            
            {/* Shipping Info */}
            <div className="shipping-section">
              <div className="shipping-title">
                <Package size={18} />
                Shipping Estimate
              </div>
              <div className="shipping-info" style={{ color: '#6b7280', fontSize: '14px' }}>
                {shipping === 0 ? (
                  <p style={{ color: '#10b981', fontWeight: '600' }}>
                    🎉 You qualify for free shipping!
                  </p>
                ) : (
                  <p>
                    Add ${(50 - subtotal).toFixed(2)} more to get free shipping
                  </p>
                )}
                <p style={{ marginTop: '8px', fontSize: '13px' }}>
                  Delivery: 3-5 business days
                </p>
              </div>
            </div>
            
            <div className="summary-row total">
              <span className="summary-label">Total</span>
              <span className="summary-value">${total.toFixed(2)}</span>
            </div>
          </div>
          
          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            className="checkout-btn"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '8px',
              width: '100%',
              marginBottom: '15px'
            }}
          >
            <Lock size={20} />
            {user ? 'Proceed to Checkout' : 'Login to Checkout'}
          </button>
          
          {/* Login reminder for non-logged in users */}
          {!user && (
            <div className="login-reminder" style={{
              background: '#fff3cd',
              border: '1px solid #ffeaa7',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '15px',
              textAlign: 'center'
            }}>
              <p style={{ color: '#856404', fontSize: '14px', margin: 0 }}>
                ⚠️ Please login to complete your purchase
              </p>
            </div>
          )}
          
          <Link to="/products" className="continue-shopping">
            <ArrowLeft size={18} style={{ transform: 'rotate(180deg)' }} />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;