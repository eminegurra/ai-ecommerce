'use client';

import { useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function SuccessPage() {
  const { dispatch } = useCart();

  useEffect(() => {
    // Clear cart in localStorage and context
    dispatch({ type: 'CLEAR_CART' });
    localStorage.removeItem('cart'); // <- just in case, double clear
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl font-bold mb-4">🎉 Payment Successful!</h1>
      <p className="text-lg mb-6">Thank you for your purchase.</p>
      <Link href="/" className="text-blue-600 hover:underline">← Back to Shop</Link>
    </div>
  );
}
