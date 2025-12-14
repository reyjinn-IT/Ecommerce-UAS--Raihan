import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img src={item.image} alt={item.title} />
      </div>
      
      <div className="cart-item-info">
        <h4 className="cart-item-title">{item.title}</h4>
        <span className="cart-item-category">{item.category}</span>
        <p className="cart-item-price">${item.price.toFixed(2)} each</p>
        
        <div className="quantity-controls">
          <button 
            className="quantity-btn"
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
          >
            <Minus size={16} />
          </button>
          
          <span className="quantity-display">{item.quantity}</span>
          
          <button 
            className="quantity-btn"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Plus size={16} />
          </button>
        </div>
        
        <button
          onClick={() => removeFromCart(item.id)}
          className="remove-btn"
        >
          <Trash2 size={16} />
          Remove
        </button>
      </div>
      
      <div className="item-total">
        <div className="item-total-price">
          ${(item.price * item.quantity).toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default CartItem;