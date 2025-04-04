'use client';

import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CheckoutPage() {
  const { cart, dispatch } = useCart();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  const handleStripeCheckout = async () => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, cart }),
    });

    const data = await res.json();
    if (data?.url) {
      window.location.href = data.url;
    } else {
      alert('Stripe checkout failed.');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty.</h2>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">🧾 Checkout</h1>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            type="text"
            placeholder="Full name"
            className="border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email address"
            className="border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between mb-2">
              <div>
                {item.name} x {item.quantity}
              </div>
              <div>€{(item.price * item.quantity).toFixed(2)}</div>
            </div>
          ))}
          <p className="text-right font-bold mt-4 text-lg">Total: €{total}</p>
        </div>

        <button
          type="button"
          onClick={handleStripeCheckout}
          className="w-full bg-black text-white py-3 rounded hover:bg-gray-800"
        >
          Pay with Stripe 💳
        </button>
      </form>
    </div>
  );
}
