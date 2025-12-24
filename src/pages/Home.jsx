import { Link } from 'react-router-dom';
import { ArrowRight, Truck, CreditCard, Star, Shield, ShoppingBag } from 'lucide-react';
import useProducts from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import banner from '../assets/1.png';

const Home = () => {
  const { products, loading } = useProducts();
  const featuredProducts = products.slice(0, 8);

  return (
    <div className="home-container">
      {/* Hero Section - SIMPLE */}
      <section className="hero-section">
        <div className="hero-image">
          <img 
            src={banner} 
            alt="Shopping Experience" 
          />
        </div>
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="text-primary">Blibeli Store</span>
          </h1>
          <p className="hero-subtitle">
            Discover amazing products with premium quality guaranteed. 
            Shop the latest trends with free shipping on orders over $50.
          </p>
          
          <div className="hero-cta">
            <Link to="/products" className="btn btn-primary btn-large">
              <ShoppingBag size={20} />
              Start Shopping
              <ArrowRight size={20} />
            </Link>
            <p className="cta-note">
              Already have an account? <Link to="/login" className="text-primary">Login here</Link>
            </p>
          </div>
        </div>
        
      </section>

      

      {/* Featured Products */}
      <section className="products-section">
        <div className="section-header">
          <h2 className="section-title">Featured Products</h2>
          <Link to="/products" className="view-all">
            View All Products
            <ArrowRight size={20} />
          </Link>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="product-grid">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;