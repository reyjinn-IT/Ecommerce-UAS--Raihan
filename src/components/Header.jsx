import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { 
  ShoppingCart, Menu, X, User, LogOut, LogIn, Home, Package, 
  BarChart3, FileText, ChevronRight, AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { getTotalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const mobileMenuRef = useRef(null);
  const menuButtonRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if mobile on resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile(); // Check initial size
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu when clicking outside or pressing ESC
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showMobileMenu &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setShowMobileMenu(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && showMobileMenu) {
        setShowMobileMenu(false);
      }
    };

    // Handle body scroll
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('menu-open');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('menu-open');
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = '';
      document.body.classList.remove('menu-open');
    };
  }, [showMobileMenu]);

  const handleLogout = async () => {
    await logout();
    setShowLogoutModal(false);
    setShowMobileMenu(false);
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(prev => !prev);
  };

  const handleMobileLinkClick = (path) => {
    setShowMobileMenu(false);
    if (path) {
      navigate(path);
    }
  };

  const handleMenuButtonClick = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    toggleMobileMenu();
  };

  return (
    <>
      <header className="header" style={{ 
        background: scrolled ? 'rgba(255, 255, 255, 0.98)' : 'white',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        transition: 'all 0.3s ease',
        zIndex: 1000,
        position: 'sticky',
        top: 0,
        borderBottom: '1px solid #e5e7eb'
      }}>
        <nav className="nav container" style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link to="/" className="logo" onClick={() => setShowMobileMenu(false)} style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#115bd1ff',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            Blibeli
          </Link>

          {/* Desktop Navigation - Visible only on desktop */}
          <div className="nav-links" style={{
            display: isMobile ? 'none' : 'flex',
            alignItems: 'center',
            gap: '24px'
          }}>
            {user && user.role === 'admin' ? (
              <>
                <Link to="/admin/dashboard" className="nav-link" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#4b5563',
                  textDecoration: 'none',
                  fontSize: '15px',
                  fontWeight: '500',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <BarChart3 size={16} />
                  Dashboard
                </Link>
                <Link to="/admin/reports" className="nav-link" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#4b5563',
                  textDecoration: 'none',
                  fontSize: '15px',
                  fontWeight: '500',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <FileText size={16} />
                  Reports
                </Link>
              </>
            ) : (
              // Customer/Guest Navigation
              <>
                <Link to="/" className="nav-link" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#4b5563',
                  textDecoration: 'none',
                  fontSize: '15px',
                  fontWeight: '500',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <Home size={16} />
                  Home
                </Link>
                <Link to="/products" className="nav-link" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#4b5563',
                  textDecoration: 'none',
                  fontSize: '15px',
                  fontWeight: '500',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <Package size={16} />
                  Products
                </Link>
              </>
            )}
          </div>

          {/* Right side with Cart, Login/User, and Mobile Menu Button */}
          <div className="right-section" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Cart Icon - Always visible for customers */}
            {(!user || user.role === 'customer') && (
              <Link 
                to="/cart" 
                className="cart-icon" 
                onClick={() => setShowMobileMenu(false)}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  transition: 'background 0.2s',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <ShoppingCart size={22} color="#4b5563" />
                {getTotalItems() > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    background: '#ef4444',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: '700',
                    minWidth: '16px',
                    height: '16px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 3px'
                  }}>
                    {getTotalItems()}
                  </span>
                )}
              </Link>
            )}

            {/* User/Auth Section - Desktop */}
            <div className="auth-section" style={{
              display: isMobile ? 'none' : 'flex',
              alignItems: 'center'
            }}>
              {user ? (
                // User info with dropdown
                <div style={{ position: 'relative' }}>
                  <button
                    className="user-dropdown-btn"
                    onClick={() => setShowLogoutModal(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'none',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#4b5563'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '12px'
                    }}>
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span style={{ 
                      maxWidth: '100px', 
                      whiteSpace: 'nowrap', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis',
                      fontSize: '14px'
                    }}>
                      {user.name}
                    </span>
                  </button>
                </div>
              ) : (
                // Login button
                <Link to="/login" className="login-btn" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#2563eb',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#1d4ed8'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#2563eb'}>
                  <LogIn size={16} />
                  <span>Login</span>
                </Link>
              )}
            </div>
            
            {/* Mobile Menu Button - Only visible on mobile */}
            {isMobile && (
              <button 
                ref={menuButtonRef}
                className="mobile-menu-btn"
                onClick={handleMenuButtonClick}
                aria-label="Toggle mobile menu"
                aria-expanded={showMobileMenu}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s',
                  marginLeft: '4px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                {showMobileMenu ? 
                  <X size={24} color="#4b5563" /> : 
                  <Menu size={24} color="#4b5563" />
                }
              </button>
            )}
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        {showMobileMenu && (
          <div 
            className="mobile-menu-overlay"
            style={{
              position: 'fixed',
              top: '70px',
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999,
              animation: 'fadeIn 0.2s ease'
            }}
            onClick={() => setShowMobileMenu(false)}
          />
        )}

        {/* Mobile Menu */}
        <div 
          ref={mobileMenuRef}
          className={`mobile-menu ${showMobileMenu ? 'open' : ''}`}
          style={{
            position: 'fixed',
            top: '70px',
            right: showMobileMenu ? '0' : '-100%',
            width: 'min(320px, 85vw)',
            height: 'calc(100vh - 70px)',
            background: 'white',
            boxShadow: '-2px 0 20px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
            transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            overflowY: 'auto',
            padding: '20px 0',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div style={{ padding: '0 16px' }}>
            {/* User Info */}
            {user && (
              <div style={{
                padding: '16px',
                background: '#f8fafc',
                borderRadius: '12px',
                marginBottom: '16px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '18px',
                    flexShrink: 0
                  }}>
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ 
                      fontWeight: '600', 
                      color: '#1e293b',
                      fontSize: '16px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {user.name}
                    </div>
                    <div style={{ 
                      fontSize: '13px', 
                      color: '#6b7280',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {user.email}
                    </div>
                    <div style={{
                      marginTop: '6px',
                      fontSize: '12px',
                      padding: '4px 10px',
                      background: user.role === 'admin' ? '#fee2e2' : '#dbeafe',
                      color: user.role === 'admin' ? '#dc2626' : '#2563eb',
                      borderRadius: '12px',
                      display: 'inline-block',
                      fontWeight: '600'
                    }}>
                      {user.role === 'admin' ? 'Administrator' : 'Customer'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Navigation Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '16px' }}>
              {user && user.role === 'admin' ? (
                <>
                  <MobileNavItem 
                    icon={<BarChart3 size={20} />}
                    label="Dashboard"
                    onClick={() => handleMobileLinkClick('/admin/dashboard')}
                  />
                  <MobileNavItem 
                    icon={<FileText size={20} />}
                    label="Reports"
                    onClick={() => handleMobileLinkClick('/admin/reports')}
                  />
                </>
              ) : (
                <>
                  <MobileNavItem 
                    icon={<Home size={20} />}
                    label="Home"
                    onClick={() => handleMobileLinkClick('/')}
                  />
                  <MobileNavItem 
                    icon={<Package size={20} />}
                    label="Products"
                    onClick={() => handleMobileLinkClick('/products')}
                  />
                  <MobileNavItem 
                    icon={<ShoppingCart size={20} />}
                    label="Cart"
                    onClick={() => handleMobileLinkClick('/cart')}
                    badge={getTotalItems() > 0 ? getTotalItems() : null}
                  />
                </>
              )}
            </div>

            {/* Divider */}
            <div style={{ 
              height: '1px', 
              background: '#e5e7eb', 
              margin: '16px 0' 
            }} />

            {/* Auth Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {user ? (
                <>
                  <MobileNavItem 
                    icon={<LogOut size={20} />}
                    label="Logout"
                    onClick={() => {
                      setShowMobileMenu(false);
                      setShowLogoutModal(true);
                    }}
                    color="#ef4444"
                  />
                </>
              ) : (
                <button
                  onClick={() => handleMobileLinkClick('/login')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    padding: '14px 16px',
                    background: '#2563eb',
                    border: 'none',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    width: '100%',
                    marginTop: '8px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#1d4ed8'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#2563eb'}
                >
                  <LogIn size={20} />
                  Login
                </button>
              )}
            </div>

            {/* Quick Stats for Admin */}
            {user && user.role === 'admin' && (
              <>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#6b7280', 
                  fontWeight: '600',
                  marginTop: '24px',
                  marginBottom: '12px',
                  paddingLeft: '8px'
                }}>
                  STORE OVERVIEW
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '8px',
                  marginBottom: '16px'
                }}>
                  <StatCard label="Total Sales" value="$45.8K" color="#2563eb" />
                  <StatCard label="Orders" value="342" color="#059669" />
                  <StatCard label="Products" value="156" color="#d97706" />
                  <StatCard label="Customers" value="289" color="#7c3aed" />
                </div>
              </>
            )}

            {/* App Info */}
            <div style={{
              marginTop: '24px',
              padding: '16px',
              background: '#f8fafc',
              borderRadius: '12px',
              fontSize: '12px',
              color: '#6b7280',
              textAlign: 'center'
            }}>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>Blibeli</div>
              <div>© 2025 All rights reserved</div>
            </div>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div 
          className="modal-overlay" 
          onClick={() => setShowLogoutModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: '16px',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <div 
            className="modal-container" 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '420px',
              overflow: 'hidden',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              animation: 'slideIn 0.3s ease'
            }}
          >
            {/* Modal Header */}
            <div style={{
              padding: '24px 24px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                // background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #aa0909ff'
              }}>
                <AlertCircle size={28} color="#d97706" />
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '0 24px 24px', textAlign: 'center' }}>
              <h3 style={{ 
                margin: '0 0 8px', 
                fontSize: '20px', 
                fontWeight: '600', 
                color: '#1e293b' 
              }}>
                Logout Confirmation
              </h3>
              <p style={{ 
                margin: 0, 
                color: '#64748b', 
                fontSize: '15px', 
                lineHeight: '1.6',
                marginBottom: '24px'
              }}>
                Are you sure you want to log out of your account?
              </p>

              {/* User Info (if available) */}
              {user && (
                <div style={{
                  background: '#f8fafc',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '24px',
                  textAlign: 'left'
                }}>
                  <div style={{ 
                    fontSize: '13px', 
                    color: '#64748b', 
                    fontWeight: '500',
                    marginBottom: '4px'
                  }}>
                    You're logged in as:
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px' 
                  }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '14px',
                      flexShrink: 0
                    }}>
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div style={{ 
                        fontSize: '15px', 
                        fontWeight: '600', 
                        color: '#1e293b' 
                      }}>
                        {user.name || 'User'}
                      </div>
                      <div style={{ 
                        fontSize: '13px', 
                        color: '#64748b' 
                      }}>
                        {user.email}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div style={{
              padding: '20px 24px 24px',
              display: 'flex',
              gap: '12px',
              borderTop: '1px solid #f1f5f9'
            }}>
              <button
                className="btn-cancel"
                onClick={() => setShowLogoutModal(false)}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#475569',
                  fontSize: '15px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}
              >
                Cancel
              </button>
              <button
                className="btn-confirm"
                onClick={handleLogout}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #dc2626, #b91c1c)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)'}
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .modal-container {
          animation: slideIn 0.3s ease;
        }
        
        .modal-overlay {
          animation: fadeIn 0.2s ease;
        }
      `}</style>
    </>
  );
};

// Mobile Navigation Item Component
const MobileNavItem = ({ icon, label, onClick, badge = null, color = '#374151' }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 16px',
      background: 'none',
      border: 'none',
      color: color,
      textAlign: 'left',
      fontSize: '15px',
      fontWeight: '500',
      cursor: 'pointer',
      borderRadius: '10px',
      transition: 'all 0.2s',
      width: '100%'
    }}
    onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ color: color === '#374151' ? '#6b7280' : color }}>
        {icon}
      </div>
      <span>{label}</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {badge && (
        <span style={{
          background: '#ef4444',
          color: 'white',
          fontSize: '12px',
          fontWeight: '600',
          minWidth: '20px',
          height: '20px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 6px'
        }}>
          {badge}
        </span>
      )}
      <ChevronRight size={16} color="#9ca3af" />
    </div>
  </button>
);

// Stat Card Component
const StatCard = ({ label, value, color }) => (
  <div style={{
    padding: '12px',
    background: 'white',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    textAlign: 'center'
  }}>
    <div style={{ 
      fontSize: '18px', 
      fontWeight: '700', 
      color: color,
      marginBottom: '4px'
    }}>
      {value}
    </div>
    <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: '500' }}>
      {label}
    </div>
  </div>
);

export default Header;