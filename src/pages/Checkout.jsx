  import { useState, useEffect } from 'react';
  import { useLocation, useNavigate } from 'react-router-dom';
  import { 
    ArrowLeft, 
    CreditCard, 
    Package, 
    User, 
    MapPin, 
    Lock, 
    Check,
    Home,
    CheckCircle,
    ShoppingBag,
    AlertCircle
  } from 'lucide-react';
  import { useCart } from '../context/CartContext';
  import { useAuth } from '../context/AuthContext';
  import './Checkout.css';

  const Checkout = () => {
    const { cartItems, getTotalPrice, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [directCheckoutData, setDirectCheckoutData] = useState(null);
    const [isDirectCheckout, setIsDirectCheckout] = useState(false);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
      fullName: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      city: '',
      postalCode: '',
      country: 'Indonesia',
      paymentMethod: 'credit-card',
      cardNumber: '',
      cardExpiry: '',
      cardCVC: '',
      saveInfo: false
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);
    const [errors, setErrors] = useState({});

    // Cek apakah ada direct checkout data
    useEffect(() => {
      console.log('🔄 Checking for direct checkout data...');
      
      const checkDirectCheckout = () => {
        // Cek di localStorage
        const storedData = localStorage.getItem('directCheckout');
        console.log('📦 localStorage directCheckout:', storedData);
        
        // Cek di location state
        const stateData = location.state?.isDirectCheckout;
        console.log('📍 Location state:', location.state);
        
        let parsedData = null;
        
        if (storedData) {
          try {
            parsedData = JSON.parse(storedData);
            console.log('✅ Parsed direct checkout data:', parsedData);
          } catch (error) {
            console.error('❌ Error parsing direct checkout data:', error);
            localStorage.removeItem('directCheckout');
          }
        }
        
        // Tentukan mode checkout
        if (parsedData && parsedData.items && parsedData.items.length > 0) {
          console.log('🚀 Setting DIRECT CHECKOUT mode');
          setDirectCheckoutData(parsedData);
          setIsDirectCheckout(true);
        } else if (stateData) {
          console.log('🚀 Setting DIRECT CHECKOUT mode from state');
          setIsDirectCheckout(true);
        } else {
          console.log('🛒 Setting CART CHECKOUT mode');
          setIsDirectCheckout(false);
        }
        
        setLoading(false);
      };

      checkDirectCheckout();
    }, [location.state]);

    // Cek apakah user sudah login dan validasi data
    useEffect(() => {
      if (loading) {
        console.log('⏳ Still loading...');
        return;
      }
      
      console.log('🔍 Running validation checks...');
      console.log('👤 User:', user ? 'Logged in' : 'Not logged in');
      console.log('🛒 Cart items:', cartItems.length);
      console.log('🎯 Direct checkout mode:', isDirectCheckout);
      console.log('📊 Direct checkout data:', directCheckoutData);
      
      // 1. Cek user login
      if (!user) {
        console.log('❌ User not logged in, redirecting to login');
        navigate('/login', { 
          state: { 
            from: '/checkout',
            directCheckout: isDirectCheckout
          } 
        });
        return;
      }
      
      // 2. Jika direct checkout, validasi data
      if (isDirectCheckout) {
        console.log('🎯 Validating direct checkout data...');
        
        // Coba ambil data dari berbagai sumber
        let checkoutItems = [];
        
        if (directCheckoutData?.items) {
          checkoutItems = directCheckoutData.items;
          console.log('✅ Using directCheckoutData items');
        } else if (location.state?.items) {
          checkoutItems = location.state.items;
          console.log('✅ Using location.state items');
        } else {
          // Coba parse dari localStorage lagi
          const storedData = localStorage.getItem('directCheckout');
          if (storedData) {
            try {
              const parsed = JSON.parse(storedData);
              checkoutItems = parsed.items || [];
              console.log('✅ Using localStorage items');
            } catch (error) {
              console.error('❌ Error parsing localStorage:', error);
            }
          }
        }
        
        console.log('📋 Final checkout items:', checkoutItems);
        
        if (!checkoutItems || checkoutItems.length === 0) {
          console.log('⚠️ No items found for direct checkout, redirecting to products');
          alert('No items to checkout. Please try again.');
          navigate('/products');
          return;
        }
        
        console.log('✅ Direct checkout validated successfully');
        // LANJUT KE CHECKOUT - TIDAK ADA REDIRECT KE CART!
        
      } else {
        // 3. Jika cart checkout, cek cart tidak kosong
        console.log('🛒 Validating cart checkout...');
        if (cartItems.length === 0) {
          console.log('❌ Cart is empty, redirecting to cart');
          navigate('/cart');
          return;
        }
        
        console.log('✅ Cart checkout validated successfully');
      }
      
      console.log('🎉 All validations passed, ready for checkout!');
    }, [user, cartItems, navigate, isDirectCheckout, directCheckoutData, loading, location.state]);

    // Hitung items dan total
    const getCheckoutItems = () => {
      if (isDirectCheckout) {
        // Cari items dari berbagai sumber
        let items = [];
        
        if (directCheckoutData?.items) {
          items = directCheckoutData.items;
        } else if (location.state?.items) {
          items = location.state.items;
        } else {
          // Fallback ke localStorage
          const storedData = localStorage.getItem('directCheckout');
          if (storedData) {
            try {
              const parsed = JSON.parse(storedData);
              items = parsed.items || [];
            } catch (error) {
              console.error('Error parsing fallback data:', error);
            }
          }
        }
        
        console.log('📦 Direct checkout items:', items);
        return items;
      }
      
      console.log('🛒 Cart checkout items:', cartItems);
      return cartItems;
    };

    const getCheckoutTotal = () => {
      if (isDirectCheckout) {
        // Hitung total dari items
        const items = getCheckoutItems();
        const subtotal = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
        console.log('💰 Direct checkout subtotal:', subtotal);
        return subtotal;
      }
      
      const total = getTotalPrice();
      console.log('💰 Cart total:', total);
      return total;
    };

    const checkoutItems = getCheckoutItems();
    const subtotal = getCheckoutTotal();
    const shipping = subtotal > 50 ? 0 : 5;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    console.log('🧮 Final calculations:', { 
      items: checkoutItems.length,
      subtotal, 
      shipping, 
      tax, 
      total 
    });

    const handleInputChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
      
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    };

    const validateForm = () => {
      const newErrors = {};
      
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
      
      if (formData.paymentMethod === 'credit-card') {
        if (!formData.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) 
          newErrors.cardNumber = 'Card number must be 16 digits';
        if (!formData.cardExpiry.match(/^\d{2}\/\d{2}$/)) 
          newErrors.cardExpiry = 'Format: MM/YY';
        if (!formData.cardCVC.match(/^\d{3,4}$/)) 
          newErrors.cardCVC = 'CVC must be 3-4 digits';
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);

      try {
        // Buat order object
        const order = {
          id: `ORD${Date.now()}`,
          userId: user?.id || null,
          customerName: formData.fullName,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          items: checkoutItems,
          subtotal: subtotal,
          shipping: shipping,
          tax: tax,
          total: total,
          status: 'processing',
          paymentMethod: formData.paymentMethod,
          shippingAddress: `${formData.address}, ${formData.city}, ${formData.postalCode}, ${formData.country}`,
          orderDate: new Date().toLocaleString(),
          paymentStatus: 'completed',
          estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          source: isDirectCheckout ? 'buy_now' : 'cart'
        };

        console.log('📝 Order created:', order);

        // Simpan ke localStorage
        const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        localStorage.setItem('orders', JSON.stringify([...existingOrders, order]));

        // Simpan user info
        if (formData.saveInfo && user) {
          const updatedUser = {
            ...user,
            phone: formData.phone || user.phone,
            address: formData.address || user.address,
            city: formData.city || user.city,
            postalCode: formData.postalCode || user.postalCode,
            country: formData.country || user.country
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }

        // Clear cart jika bukan direct checkout
        if (!isDirectCheckout) {
          clearCart();
        }

        // Clear direct checkout data
        localStorage.removeItem('directCheckout');

        // Set order details untuk modal
        setOrderDetails(order);

        // Tampilkan modal sukses
        setShowSuccessModal(true);

      } catch (error) {
        console.error('❌ Checkout error:', error);
        alert('An error occurred. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleReturnToHome = () => {
      setShowSuccessModal(false);
      navigate('/');
    };

    const formatCardNumber = (value) => {
      return value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').slice(0, 19);
    };

    const formatExpiryDate = (value) => {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length >= 2) {
        return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
      }
      return cleaned;
    };

    const handleBack = () => {
      if (isDirectCheckout) {
        navigate('/products');
      } else {
        navigate('/cart');
      }
    };

    if (loading) {
      return (
        <div className="checkout-page">
          <div className="checkout-wrapper">
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading checkout...</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="checkout-page">
        <div className="checkout-wrapper">
          {/* Header */}
          <div className="checkout-header">
            <button onClick={handleBack} className="back-link">
              <ArrowLeft size={18} />
              {isDirectCheckout ? 'Back to Products' : 'Back to Cart'}
            </button>
            
            <h1 className="checkout-title">
              <Lock size={24} />
              Checkout {isDirectCheckout && <span className="direct-badge">(Buy Now)</span>}
            </h1>
            
            {isDirectCheckout ? (
              <div className="direct-checkout-notice">
                <AlertCircle size={16} />
                <span>Direct Purchase - {checkoutItems.length} item(s)</span>
              </div>
            ) : (
              <p className="checkout-subtitle">
                <ShoppingBag size={16} />
                {cartItems.length} item(s) in cart
              </p>
            )}
          </div>

          {/* Debug info - Hanya di development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="debug-info" style={{
              background: '#f3f4f6',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '13px',
              color: '#6b7280',
              border: '1px solid #e5e7eb'
            }}>
              <strong>Debug Info:</strong> 
              Mode: <strong>{isDirectCheckout ? 'Buy Now' : 'Cart'}</strong> | 
              Items: {checkoutItems.length} | 
              User: {user ? 'Logged In' : 'Not Logged In'}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Personal Details */}
            <div className="checkout-card">
              <h2 className="form-title">
                <User size={18} />
                Personal Details
              </h2>

              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className={errors.fullName ? 'input-error' : ''}
                />
                {errors.fullName && <p className="error-text">{errors.fullName}</p>}
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                    className={errors.email ? 'input-error' : ''}
                  />
                  {errors.email && <p className="error-text">{errors.email}</p>}
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+62 812 xxxx"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="checkout-card">
              <h2 className="form-title">
                <MapPin size={18} />
                Shipping Address
              </h2>

              <div className="form-group">
                <label>Street Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Street name"
                  className={errors.address ? 'input-error' : ''}
                />
                {errors.address && <p className="error-text">{errors.address}</p>}
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className={errors.city ? 'input-error' : ''}
                  />
                  {errors.city && <p className="error-text">{errors.city}</p>}
                </div>

                <div className="form-group">
                  <label>Postal Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="12345"
                    className={errors.postalCode ? 'input-error' : ''}
                  />
                  {errors.postalCode && <p className="error-text">{errors.postalCode}</p>}
                </div>
              </div>

              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Country"
                />
              </div>

              <div className="form-option">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="saveInfo"
                    checked={formData.saveInfo}
                    onChange={handleInputChange}
                  />
                  <span>Save this information for next time</span>
                </label>
              </div>
            </div>

            {/* Payment Method */}
            <div className="checkout-card">
              <h2 className="form-title">
                <CreditCard size={18} />
                Payment Method
              </h2>

              <div className="payment-list">
                <label className={`payment-option ${formData.paymentMethod === 'credit-card' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit-card"
                    checked={formData.paymentMethod === 'credit-card'}
                    onChange={handleInputChange}
                  />
                  <div className="payment-info">
                    <strong>Credit / Debit Card</strong>
                    <p>Pay securely using your card</p>
                  </div>
                </label>

                <label className={`payment-option ${formData.paymentMethod === 'cod' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                  />
                  <div className="payment-info">
                    <strong>Cash on Delivery</strong>
                    <p>Pay when your order arrives</p>
                  </div>
                </label>
              </div>

              {formData.paymentMethod === 'credit-card' && (
                <div className="card-details">
                  <div className="form-group">
                    <label>Card Number *</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formatCardNumber(formData.cardNumber)}
                      onChange={(e) =>
                        setFormData(prev => ({
                          ...prev,
                          cardNumber: e.target.value.replace(/\s/g, '')
                        }))
                      }
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      className={errors.cardNumber ? 'input-error' : ''}
                    />
                    {errors.cardNumber && <p className="error-text">{errors.cardNumber}</p>}
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>Expiry Date (MM/YY) *</label>
                      <input
                        type="text"
                        name="cardExpiry"
                        value={formatExpiryDate(formData.cardExpiry)}
                        onChange={(e) =>
                          setFormData(prev => ({
                            ...prev,
                            cardExpiry: e.target.value.replace(/\D/g, '')
                          }))
                        }
                        placeholder="MM/YY"
                        maxLength="5"
                        className={errors.cardExpiry ? 'input-error' : ''}
                      />
                      {errors.cardExpiry && <p className="error-text">{errors.cardExpiry}</p>}
                    </div>

                    <div className="form-group">
                      <label>CVC *</label>
                      <input
                        type="password"
                        name="cardCVC"
                        value={formData.cardCVC}
                        onChange={handleInputChange}
                        placeholder="123"
                        maxLength="4"
                        className={errors.cardCVC ? 'input-error' : ''}
                      />
                      {errors.cardCVC && <p className="error-text">{errors.cardCVC}</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="checkout-card">
              <h2 className="form-title">
                <Package size={18} />
                Order Summary
              </h2>

              {/* Item List */}
              <div className="order-items">
                {checkoutItems.map((item, index) => (
                  <div className="order-item" key={index}>
                    <div className="order-item-info">
                      <div className="order-item-image">
                        <img src={item.image} alt={item.title} />
                      </div>
                      <div>
                        <div className="order-item-title">{item.title}</div>
                        <div className="order-item-meta">
                          Qty: {item.quantity || 1} × ${item.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div className="order-item-price">
                      ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="summary-details">
                <div className="price-row">
                  <span>Subtotal ({checkoutItems.reduce((sum, item) => sum + (item.quantity || 1), 0)} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="price-row">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="price-row">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="price-row total">
                  <strong>Total</strong>
                  <strong className="price-total">${total.toFixed(2)}</strong>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="checkout-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner-small"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Check size={20} />
                    Complete Order - ${total.toFixed(2)}
                  </>
                )}
              </button>

              {/* <p className="secure-notice">
                <Lock size={16} />
                Your payment is secure and encrypted
              </p> */}
            </div>
          </form>
        </div>

        {/* Success Modal */}
        {showSuccessModal && orderDetails && (
          <div className="modal-overlay">
            <div className="modal success-modal">
              <div className="modal-content">
                <div className="modal-icon">
                  <CheckCircle size={60} />
                </div>
                
                <h2 className="modal-title">Order Successfull</h2>
                
                {/* <div className="order-details">
                  <div className="detail-row">
                    <span>Order ID:</span>
                    <strong>{orderDetails.id}</strong>
                  </div>
                  <div className="detail-row">
                    <span>Total:</span>
                    <strong className="total-price">${orderDetails.total.toFixed(2)}</strong>
                  </div>
                  <div className="detail-row">
                    <span>Payment:</span>
                    <span>{orderDetails.paymentMethod === 'credit-card' ? 'Credit Card' : 'Cash on Delivery'}</span>
                  </div>
                  <div className="detail-row">
                    <span>Estimated Delivery:</span>
                    <span>{orderDetails.estimatedDelivery}</span>
                  </div>
                </div>

                <p className="confirmation-text">
                  Thank you for your purchase! A confirmation email has been sent to <strong>{orderDetails.customerEmail}</strong>
                </p> */}

                <div className="modal-actions">
                  <button
                    onClick={handleReturnToHome}
                    className="btn btn-primary"
                  >
                    <Home size={20} />
                    Back to Home
                  </button>
                  
                  <button
                    onClick={() => navigate('/orders')}
                    className="btn btn-secondary"
                  >
                    View Order Details
                  </button>
                </div>

                {/* <p className="order-note">
                  You can track your order in the "My Orders" section.
                </p> */}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  export default Checkout;