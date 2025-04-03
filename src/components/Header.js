'use client';
import Link from 'next/link';
import SearchBar from './SearchBar';
import { useCart } from '@/context/CartContext';

export default function Header({ onSearchResults }) {
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="w-full bg-gray-50 border-b border-gray-200 shadow-sm px-4 sm:px-8 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sticky top-0 z-50">
      <Link href="/" className="text-xl font-bold text-gray-600">
        🛍️ ShopAI
      </Link>

      <SearchBar onResults={onSearchResults} />

      <div className="flex gap-4 items-center">
        <Link href="/cart" className="relative text-2xl">
          🛒
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {totalItems}
            </span>
          )}
        </Link>
        <Link href="/login">Login</Link>
      </div>
    </header>
  );
}
