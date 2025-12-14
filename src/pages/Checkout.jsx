import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Package, User, MapPin, Phone, Mail, Lock, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: '',
    postalCode: '',
    country: 'United States',
    paymentMethod: 'credit-card',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
    saveInfo: false
  });

  const [isMobile, setIsMobile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Check screen size for responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cek apakah user sudah login dan cart tidak kosong
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    
    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }
  }, [user, cartItems, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
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
      const subtotal = getTotalPrice();
      const shipping = subtotal > 50 ? 0 : 5;
      const tax = subtotal * 0.1;
      const total = subtotal + shipping + tax;

      const order = {
        id: `ORD${Date.now()}`,
        userId: user?.id || null,
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        items: cartItems.map(item => ({
          productId: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        total: total,
        status: 'pending',
        paymentMethod: formData.paymentMethod,
        shippingAddress: `${formData.address}, ${formData.city}, ${formData.postalCode}, ${formData.country}`,
        orderDate: new Date().toISOString(),
        paymentStatus: 'pending'
      };

      // Simpan ke localStorage
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      localStorage.setItem('orders', JSON.stringify([...existingOrders, order]));

      // Simpan user info jika dicentang
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

      // Clear cart
      clearCart();

      // Simpan ke session untuk confirmation page
      sessionStorage.setItem('lastOrder', JSON.stringify(order));

      // Redirect ke confirmation page
      navigate('/order-confirmation', { 
        state: { orderId: order.id, total: total } 
      });

    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtotal = getTotalPrice();
  const shipping = subtotal > 50 ? 0 : 5;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  // Format card number input
  const formatCardNumber = (value) => {
    return value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').slice(0, 19);
  };

  // Format expiry date input
  const formatExpiryDate = (value) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1/').slice(0, 5);
  };

  // Responsive styles
  const containerStyle = {
    padding: isMobile ? '16px' : '20px',
    maxWidth: '800px',
    margin: '0 auto',
    minHeight: 'calc(100vh - 140px)'
  };

  const titleStyle = {
    fontSize: isMobile ? '24px' : '28px',
    fontWeight: '700',
    marginBottom: '8px',
    color: '#1e293b'
  };

  const formGridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
    gap: '16px'
  };

  return (
    <div style={containerStyle}>
      {/* Back Button & Header */}
      <div style={{ marginBottom: '30px' }}>
        <Link to="/cart" className="btn btn-secondary" style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          textDecoration: 'none',
          padding: '10px 16px',
          borderRadius: '8px',
          background: '#f3f4f6',
          color: '#374151',
          border: '1px solid #e5e7eb',
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '20px'
        }}>
          <ArrowLeft size={18} style={{ marginRight: '8px' }} />
          Back to Cart
        </Link>
        
        <h1 style={titleStyle}>
          Checkout
        </h1>
        <p style={{ 
          color: '#6b7280',
          fontSize: isMobile ? '14px' : '16px',
          marginBottom: '30px'
        }}>
          Complete your purchase with secure checkout
        </p>
      </div>

      {/* Order Summary Card */}
      <div style={{ 
        background: 'white',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        padding: isMobile ? '20px' : '24px',
        marginBottom: '30px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
      }}>
        <h2 style={{ 
          fontSize: isMobile ? '18px' : '20px', 
          fontWeight: '600', 
          marginBottom: '20px',
          color: '#1e293b',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Package size={20} />
          Order Summary
        </h2>
        
        {/* Order Items */}
        <div style={{ marginBottom: '20px' }}>
          {cartItems.map(item => (
            <div key={item.id} style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0',
              borderBottom: '1px solid #f3f4f6'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px'
                }}>
                  <div style={{ 
                    width: '50px', 
                    height: '50px', 
                    borderRadius: '8px',
                    background: '#f9fafb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    <img 
                      src={item.image} 
                      alt={item.title}
                      style={{ 
                        width: '80%', 
                        height: '80%', 
                        objectFit: 'contain' 
                      }} 
                    />
                  </div>
                  <div>
                    <div style={{ 
                      fontWeight: '600', 
                      color: '#1e293b',
                      marginBottom: '4px'
                    }}>
                      {item.title}
                    </div>
                    <div style={{ 
                      fontSize: '14px', 
                      color: '#6b7280'
                    }}>
                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ 
                fontWeight: '700', 
                color: '#1e293b',
                fontSize: '16px'
              }}>
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Price Breakdown */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginBottom: '8px'
          }}>
            <span style={{ color: '#6b7280' }}>Subtotal</span>
            <span style={{ fontWeight: '500' }}>${subtotal.toFixed(2)}</span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginBottom: '8px'
          }}>
            <span style={{ color: '#6b7280' }}>Shipping</span>
            <span style={{ 
              fontWeight: '500',
              color: shipping === 0 ? '#059669' : '#6b7280'
            }}>
              {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
            </span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            <span style={{ color: '#6b7280' }}>Tax (10%)</span>
            <span style={{ fontWeight: '500' }}>${tax.toFixed(2)}</span>
          </div>
          
          <div style={{ 
            height: '1px', 
            background: '#e5e7eb',
            margin: '16px 0'
          }} />
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ 
              fontSize: '18px', 
              fontWeight: '600',
              color: '#1e293b'
            }}>
              Total
            </span>
            <span style={{ 
              fontSize: '24px', 
              fontWeight: '700',
              color: '#059669'
            }}>
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Free Shipping Notice */}
        {shipping === 0 ? (
          <div style={{ 
            background: '#d1fae5',
            color: '#065f46',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px'
          }}>
            <Check size={16} />
            🎉 You qualify for free shipping!
          </div>
        ) : (
          <div style={{ 
            background: '#fef3c7',
            color: '#92400e',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '20px'
          }}>
            Add <strong>${(50 - subtotal).toFixed(2)}</strong> more to get free shipping!
          </div>
        )}
      </div>

      {/* Checkout Form */}
      <div style={{ 
        background: 'white',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        padding: isMobile ? '20px' : '24px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
      }}>
        <h2 style={{ 
          fontSize: isMobile ? '18px' : '20px', 
          fontWeight: '600', 
          marginBottom: '24px',
          color: '#1e293b',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <User size={20} />
          Shipping & Payment
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Personal Details */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              marginBottom: '16px',
              color: '#374151',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <User size={16} />
              Personal Details
            </h3>
            
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  fontSize: '14px',
                  color: '#374151'
                }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: `1px solid ${errors.fullName ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    transition: 'border 0.2s'
                  }}
                />
                {errors.fullName && (
                  <div style={{ 
                    color: '#ef4444', 
                    fontSize: '12px', 
                    marginTop: '4px' 
                  }}>
                    {errors.fullName}
                  </div>
                )}
              </div>
              
              <div style={formGridStyle}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '500',
                    fontSize: '14px',
                    color: '#374151'
                  }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `1px solid ${errors.email ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                  {errors.email && (
                    <div style={{ 
                      color: '#ef4444', 
                      fontSize: '12px', 
                      marginTop: '4px' 
                    }}>
                      {errors.email}
                    </div>
                  )}
                </div>
                
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '500',
                    fontSize: '14px',
                    color: '#374151'
                  }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+1 234 567 8900"
                    value={formData.phone}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              marginBottom: '16px',
              color: '#374151',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <MapPin size={16} />
              Shipping Address
            </h3>
            
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  fontSize: '14px',
                  color: '#374151'
                }}>
                  Street Address *
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="123 Main Street"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: `1px solid ${errors.address ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
                {errors.address && (
                  <div style={{ 
                    color: '#ef4444', 
                    fontSize: '12px', 
                    marginTop: '4px' 
                  }}>
                    {errors.address}
                  </div>
                )}
              </div>
              
              <div style={formGridStyle}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '500',
                    fontSize: '14px',
                    color: '#374151'
                  }}>
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    placeholder="New York"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `1px solid ${errors.city ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                  {errors.city && (
                    <div style={{ 
                      color: '#ef4444', 
                      fontSize: '12px', 
                      marginTop: '4px' 
                    }}>
                      {errors.city}
                    </div>
                  )}
                </div>
                
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '500',
                    fontSize: '14px',
                    color: '#374151'
                  }}>
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="10001"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `1px solid ${errors.postalCode ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                  {errors.postalCode && (
                    <div style={{ 
                      color: '#ef4444', 
                      fontSize: '12px', 
                      marginTop: '4px' 
                    }}>
                      {errors.postalCode}
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  fontSize: '14px',
                  color: '#374151'
                }}>
                  Country
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Japan">Japan</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              marginBottom: '16px',
              color: '#374151',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CreditCard size={16} />
              Payment Method
            </h3>
            
            <div style={{ display: 'grid', gap: '12px' }}>
              {['credit-card', 'paypal', 'cod'].map(method => (
                <label key={method} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '16px',
                  border: `2px solid ${formData.paymentMethod === method ? '#2563eb' : '#e5e7eb'}`,
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: formData.paymentMethod === method ? '#f0f9ff' : 'white'
                }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={formData.paymentMethod === method}
                    onChange={handleInputChange}
                    style={{ marginRight: '12px' }}
                  />
                  <div>
                    <div style={{ 
                      fontWeight: '600', 
                      color: '#1e293b',
                      marginBottom: '4px'
                    }}>
                      {method === 'credit-card' && 'Credit / Debit Card'}
                      {method === 'paypal' && 'PayPal'}
                      {method === 'cod' && 'Cash on Delivery'}
                    </div>
                    <div style={{ 
                      fontSize: '14px', 
                      color: '#6b7280'
                    }}>
                      {method === 'credit-card' && 'Pay with your card securely'}
                      {method === 'paypal' && 'Fast and secure online payments'}
                      {method === 'cod' && 'Pay when you receive your order'}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {/* Credit Card Details (if selected) */}
            {formData.paymentMethod === 'credit-card' && (
              <div style={{ 
                marginTop: '20px',
                padding: '20px',
                background: '#f8fafc',
                borderRadius: '10px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'grid', gap: '16px' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontWeight: '500',
                      fontSize: '14px',
                      color: '#374151'
                    }}>
                      Card Number *
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formatCardNumber(formData.cardNumber)}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          cardNumber: e.target.value.replace(/\s/g, '')
                        }));
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: `1px solid ${errors.cardNumber ? '#ef4444' : '#d1d5db'}`,
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                    {errors.cardNumber && (
                      <div style={{ 
                        color: '#ef4444', 
                        fontSize: '12px', 
                        marginTop: '4px' 
                      }}>
                        {errors.cardNumber}
                      </div>
                    )}
                  </div>
                  
                  <div style={formGridStyle}>
                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '8px', 
                        fontWeight: '500',
                        fontSize: '14px',
                        color: '#374151'
                      }}>
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        name="cardExpiry"
                        placeholder="MM/YY"
                        value={formatExpiryDate(formData.cardExpiry)}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            cardExpiry: e.target.value.replace(/\D/g, '')
                          }));
                        }}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: `1px solid ${errors.cardExpiry ? '#ef4444' : '#d1d5db'}`,
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      />
                      {errors.cardExpiry && (
                        <div style={{ 
                          color: '#ef4444', 
                          fontSize: '12px', 
                          marginTop: '4px' 
                        }}>
                          {errors.cardExpiry}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '8px', 
                        fontWeight: '500',
                        fontSize: '14px',
                        color: '#374151'
                      }}>
                        CVC *
                      </label>
                      <input
                        type="text"
                        name="cardCVC"
                        placeholder="123"
                        value={formData.cardCVC}
                        onChange={handleInputChange}
                        maxLength="4"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: `1px solid ${errors.cardCVC ? '#ef4444' : '#d1d5db'}`,
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      />
                      {errors.cardCVC && (
                        <div style={{ 
                          color: '#ef4444', 
                          fontSize: '12px', 
                          marginTop: '4px' 
                        }}>
                          {errors.cardCVC}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Save Info Checkbox */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              fontSize: '14px'
            }}>
              <input
                type="checkbox"
                name="saveInfo"
                checked={formData.saveInfo}
                onChange={handleInputChange}
                style={{ 
                  marginRight: '10px',
                  width: '16px',
                  height: '16px',
                  cursor: 'pointer'
                }}
              />
              <span style={{ color: '#374151' }}>
                Save shipping information for future orders
              </span>
            </label>
          </div>

          {/* Security Notice */}
          <div style={{ 
            background: '#dbeafe',
            color: '#1e40af',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '30px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <Lock size={18} />
            <div>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                Secure Payment
              </div>
              <div>
                Your payment information is encrypted and secure. We don't store your credit card details.
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{ 
              width: '100%',
              padding: '16px',
              background: isSubmitting ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) e.target.style.background = '#2563eb';
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) e.target.style.background = '#3b82f6';
            }}
          >
            {isSubmitting ? (
              <>
                <div style={{ 
                  width: '20px', 
                  height: '20px', 
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Processing...
              </>
            ) : (
              <>
                <Lock size={20} />
                Complete Order - ${total.toFixed(2)}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;