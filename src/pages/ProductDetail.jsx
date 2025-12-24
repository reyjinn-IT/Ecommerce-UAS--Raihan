import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, ShoppingCart, Star, Check } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import useProducts from '../hooks/UseProducts.jsx';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { addToCart, isInCart } = useCart();
  const { user } = useAuth();

  const product = products.find(p => p.id === parseInt(id));
  const inCart = product && isInCart(product.id);

  if (loading) return <LoadingSpinner />;

  if (!product) {
    return (
      <div className="product-error">
        <h2>❌ Product Not Found</h2>
        <Link to="/products" className="btn-back">
          <ArrowLeft size={18} /> Back to Products
        </Link>
      </div>
    );
  }

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      navigate('/login', {
        state: { from: `/products/${id}`, buyNow: true }
      });
      return;
    }

    // Clear any previous direct checkout data
    localStorage.removeItem('directCheckout');
    
    // Prepare direct checkout data
    const directCheckoutData = {
      items: [{ 
        ...product, 
        quantity: 1,
        // Ensure all required fields are included
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category
      }],
      total: product.price,
      isDirectCheckout: true,
      timestamp: Date.now()
    };

    console.log('Direct checkout data:', directCheckoutData); // Debug log
    
    // Save to localStorage
    localStorage.setItem('directCheckout', JSON.stringify(directCheckoutData));
    
    // Navigate to checkout
    navigate('/checkout', { 
      state: { 
        isDirectCheckout: true,
        productId: product.id
      } 
    });
  };

  return (
    <div className="product-detail-page">
      <Link to="/products" className="btn-back">
        <ArrowLeft size={18} /> Back to Products
      </Link>

      <div className="product-detail">
        {/* IMAGE */}
        <div className="product-image-box">
          <img src={product.image} alt={product.title} />
        </div>

        {/* INFO */}
        <div className="product-info-box">
          <span className="product-category">{product.category}</span>

          <h1 className="product-title">{product.title}</h1>

          <div className="product-rating">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={20}
                className={i < Math.round(product.rating.rate) ? 'star-filled' : ''}
              />
            ))}
            <span>
              {product.rating.rate} ({product.rating.count} reviews)
            </span>
          </div>

          <div className="product-price">
            ${product.price.toFixed(2)}
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="product-actions">
            <button
              className={`btn-cart ${inCart ? 'added' : ''}`}
              onClick={handleAddToCart}
              disabled={inCart}
            >
              {inCart ? (
                <>
                  <Check size={18} /> Added
                </>
              ) : (
                <>
                  <ShoppingCart size={20} /> Add to Cart
                </>
              )}
            </button>

            <button 
              className="btn-buy" 
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;