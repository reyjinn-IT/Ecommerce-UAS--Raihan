import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(product.id);

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.title} />
      </div>

      <div className="product-info">
        <span className="product-category">{product.category}</span>

        <h3 className="product-title">{product.title}</h3>

        <p className="product-price">${product.price.toFixed(2)}</p>

        <div className="product-actions">
          <Link
            to={`/products/${product.id}`}
            className="btn btn-outline"
          >
            View
          </Link>

          <button
            className={`btn ${inCart ? 'btn-disabled' : 'btn-primary'}`}
            onClick={() => addToCart(product)}
            disabled={inCart}
          >
            <ShoppingCart size={16} />
            {inCart ? 'Added' : 'Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
