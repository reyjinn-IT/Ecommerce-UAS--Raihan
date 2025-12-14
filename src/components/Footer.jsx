import { Link } from 'react-router-dom';
import { ShoppingBag, Mail, Phone, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">Blibeli</h3>
            <p className="footer-text">
              Premium online shopping experience with quality products and excellent service.
            </p>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Links</h3>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link"><ShoppingBag size={14} /> Home</Link></li>
              <li><Link to="/products" className="footer-link"><ShoppingBag size={14} /> Products</Link></li>
              <li><Link to="/login" className="footer-link"><ShoppingBag size={14} /> Login</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Contact Me</h3>
            <ul className="footer-links">
              <li className="footer-link">
                {/* <Mail size={14} /> */}
                raihanpermadi17@gmail.com
              </li>
              <li className="footer-link">
                {/* <Phone size={14} /> */}
                2404024
              </li>
              <li className="footer-link">
                {/* <Clock size={14} /> */}
                2 IT Programming
              </li>
            </ul>
          </div>
        </div>
        
        <hr className="footer-divider" />
        
        <div className="footer-bottom">
          <p>© 2025 Blibeli. UAS FrontEnd.</p>
          <div className="footer-social">
            <a href="#" className="social-link">Gtihub</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;