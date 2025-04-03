'use client';
import { useCart } from '@/context/CartContext';

export default function QuantitySelector({ product }) {
  const { cart, dispatch } = useCart();
  const item = cart.find((p) => p.id === product.id);
  const quantity = item?.quantity || 0;

  const increase = () => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  const decrease = () => {
    if (quantity === 1) {
      dispatch({ type: 'REMOVE_ITEM', payload: product.id });
    } else {
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: { id: product.id, quantity: quantity - 1 },
      });
    }
  };

  if (!item) {
    return (
      <button
        onClick={increase}
        className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700"
      >
        Add to Cart
      </button>
    );
  }

  return (
    <div className="flex items-center justify-center border-2 border-yellow-400 rounded-full px-2 py-1 text-black font-semibold">
      <button onClick={decrease} className="px-2">−</button>
      <span className="px-2">{quantity}</span>
      <button onClick={increase} className="px-2">+</button>
    </div>
  );
}
