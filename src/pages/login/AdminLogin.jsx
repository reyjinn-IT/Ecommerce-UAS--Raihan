import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Shield } from 'lucide-react';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Hardcoded admin credentials for demo
      const adminCredentials = {
        email: 'admin@blibeli.com',
        password: 'admin123'
      };

      if (formData.email !== adminCredentials.email || formData.password !== adminCredentials.password) {
        setError('Invalid admin credentials');
        setLoading(false);
        return;
      }

      const result = await login(formData.email, formData.password, 'admin');
      
      if (result.success) {
        navigate('/admin/dashboard');
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="customer-icon" style={{ background: '#fee2e2', color: '#dc2626' }}>
            <Shield size={48} color="#dc2626" />
          </div>
          <h1 className="auth-title">Admin Login</h1>
          <p className="auth-subtitle">
            Sign in to access admin dashboard
          </p>
        </div>

        {error && (
          <div className="auth-error">
            <div className="error-icon">⚠️</div>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Admin Email</label>
            <div className="input-group">
              <Mail size={20} className="input-icon" />
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="admin@blibeli.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-group">
              <Lock size={20} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="form-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? (
              <div className="spinner-small"></div>
            ) : (
              'Sign In as Admin'
            )}
          </button>
        </form>

        <div className="demo-credentials" style={{ marginTop: '24px', padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px', fontWeight: '600' }}>Demo Admin Credentials:</p>
          <p style={{ fontSize: '13px', color: '#374151' }}><strong>Email:</strong> admin@blibeli.com</p>
          <p style={{ fontSize: '13px', color: '#374151' }}><strong>Password:</strong> admin123</p>
        </div>

        <div className="auth-footer">
          <div className="login-links">
            <Link to="/login/customer" className="admin-login-link">
              <span>Are you a customer?</span>
              <span className="link-arrow">→</span>
            </Link>
          </div>
          
          <Link to="/" className="back-home">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;