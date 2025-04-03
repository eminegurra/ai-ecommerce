'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { cart, dispatch } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">🛒 Your Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty. <Link href="/products" className="text-blue-600">Browse products</Link></p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item.id} className="border-b py-4 flex justify-between items-center">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
              </div>
              <p>€{(item.price * item.quantity).toFixed(2)}</p>
              <button
                onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}
                className="text-red-500 text-sm"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="text-right mt-6">
            <p className="text-xl font-semibold">Total: €{total}</p>
            <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
