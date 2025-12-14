import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ArrowLeft, ShoppingCart, Star, Check } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import useProducts from '../hooks/UseProducts.jsx';
const ProductDetail = () => {
  const { id } = useParams();
  const { products, loading } = useProducts();
  const { addToCart, isInCart } = useCart();
  
  const product = products.find(p => p.id === parseInt(id));
  const inCart = product ? isInCart(product.id) : false;

  if (loading) return <LoadingSpinner />;

  if (!product) {
    return (
      <div className="error text-center">
        <div className="error-icon">❌</div>
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
        <Link to="/products" className="btn btn-primary inline-flex items-center">
          <button className="btn" style={{ flex: 1, background: '#1e293b', color: 'white' }}> <ArrowLeft size={20} style={{ marginRight: '8px' }} />
          Back to Products</button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link 
        to="/products"
        className="btn btn-secondary"
        style={{ alignItems: 'center', textDecoration: 'none' , margin : '10px'}}>
        <ArrowLeft size={20} style={{ marginRight: '8px' }} />
        Back to Products
      </Link>

      <div className="product-detail">
        <div className="product-detail-content">
          <div className="detail-image">
            <img src={product.image} alt={product.title} />
          </div>

          <div className="detail-info">
            <span className="product-category">{product.category}</span>
            <h1 className="detail-title">{product.title}</h1>
            
            <div className="flex items-center gap-2">
              <div className="flex" style={{ color: '#f59e0b' }}>
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i}
                    size={20}
                    fill={i < Math.round(product.rating.rate) ? 'currentColor' : 'none'}
                    style={{ color: i < Math.round(product.rating.rate) ? '#f59e0b' : '#e2e8f0' }}
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {product.rating.rate} ({product.rating.count} reviews)
              </span>
            </div>

            <p className="detail-price">${product.price}</p>

            <p className="detail-description">{product.description}</p>

            <div className="detail-actions">
              <button 
                onClick={() => addToCart(product)}
                className={`btn ${inCart ? 'btn-secondary' : 'btn-primary'} flex items-center justify-center`}
                style={{ flex: 1 }}
                disabled={inCart}
              >
                <ShoppingCart size={20} style={{ marginRight: '8px' }} />
                {inCart ? (
                  <>
                    <Check size={18} style={{ marginRight: '8px' }} />
                    Added to Cart
                  </>
                ) : 'Add to Cart'}
              </button>
              
              <button className="btn" style={{ flex: 1, background: '#1e293b', color: 'white' }}>
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;