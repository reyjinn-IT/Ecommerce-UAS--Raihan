import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ShoppingBag,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';
import './cus.css';

const CustomerLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAdminAlert, setShowAdminAlert] = useState(false);
  const [wrongPasswordAlert, setWrongPasswordAlert] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const { login } = useAuth();
  const navigate = useNavigate();

  const CORRECT_PASSWORD = 'customer123';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setWrongPasswordAlert(false);

    if (value.toLowerCase().includes('admin')) {
      setShowAdminAlert(true);
    } else {
      setShowAdminAlert(false);
    }
  };

  const validatePassword = (password) => {
    return password === CORRECT_PASSWORD;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (showAdminAlert) return;

    // Validasi password
    if (!validatePassword(formData.password)) {
      setWrongPasswordAlert(true);
      setAttempts(prev => prev + 1);
      return;
    }

    setLoading(true);
    setError('');
    setWrongPasswordAlert(false);

    try {
      const result = await login(formData.email, formData.password, 'customer');
      if (result.success) {
        setAttempts(0);
        navigate('/checkout');
      } else {
        setError(result.message || 'Invalid credentials');
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Wrong Password Alert Modal */}
      {wrongPasswordAlert && (
        <div className="alert-overlay">
          <div className="alert-modal">
            <div className="alert-icon error">
              <AlertCircle size={32} />
            </div>
            <h3>Incorrect Password</h3>
            <p>The password you entered is incorrect.</p>
            {/* <p className="password-hint">
              <strong>Hint:</strong> Use <code>customer123</code> as password
            </p> */}
            <div className="attempts-info">
              <AlertTriangle size={14} />
              <span>Attempt {attempts} of 3</span>
            </div>
            <div className="alert-buttons">
              <button
                className="btn-secondary"
                onClick={() => {
                  setWrongPasswordAlert(false);
                  setFormData(prev => ({ ...prev, password: '' }));
                }}
              >
                Try Again
              </button>
              {/* <button
                className="btn-primary"
                onClick={() => {
                  setFormData(prev => ({ ...prev, password: CORRECT_PASSWORD }));
                  setWrongPasswordAlert(false);
                }}
              >
                Use Correct Password
              </button> */}
            </div>
          </div>
        </div>
      )}

      {showAdminAlert && (
        <div className="admin-overlay">
          <div className="admin-modal">
            <div className="admin-icon">
              <AlertTriangle />
            </div>
            <h3>Access Denied</h3>
            <p>Use customer credentials to login here.</p>
            <button onClick={() => {
              setShowAdminAlert(false);
              setFormData({ email: '', password: '' });
            }}>
              Clear Form
            </button>
          </div>
        </div>
      )}

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">
              <ShoppingBag />
            </div>
            <h1>Customer Login</h1>
            <p>Login to continue</p>
            {/* <div className="password-requirement">
              <Lock size={14} />
              <span>Wrong<strong>password</strong></span>
            </div> */}
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <div className="input-wrapper">
                <Mail />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="customer@email.com"
                  required
                  disabled={showAdminAlert}
                />
              </div>
              {showAdminAlert && (
                <span className="admin-warning">
                  <AlertTriangle size={14} /> Admin email detected
                </span>
              )}
            </div>

            <div className="form-group">
              <div className="password-label">
                <label>Password</label>
                {/* <span className="password-info">Must be "customer123"</span> */}
              </div>
              <div className="input-wrapper">
                <Lock />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter: customer123"
                  required
                  disabled={showAdminAlert}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={showAdminAlert}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {formData.password && !validatePassword(formData.password) && !wrongPasswordAlert && (
                <span className="password-warning">
                  {/* <AlertTriangle size={12} /> Password must be exactly "customer123" */}
                </span>
              )}
            </div>

            <button
              className="btn-primary"
              disabled={loading || showAdminAlert}
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>

            <Link to="/" className="back-home">
              <ArrowLeft size={16} /> Back to Home
            </Link>
          </div>
        </div>
      
    </>
  );
};

export default CustomerLogin;