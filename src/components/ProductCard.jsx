import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(product.id);

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.title} />
      </div>
      
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        
        <h3 className="product-title">{product.title}</h3>
        
        <div className="product-price">${product.price}</div>
        
        <div className="product-footer">
          <Link 
            to={`/products/${product.id}`}
            className="btn btn-secondary btn-small"
          >
            View
          </Link>
          
          <button 
            onClick={handleAddToCart}
            className={`btn btn-small ${inCart ? 'btn-secondary' : 'btn-primary'}`}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            disabled={inCart}
          >
            <ShoppingCart size={16} />
            {inCart ? 'Added' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;