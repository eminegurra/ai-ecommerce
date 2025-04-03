import Link from 'next/link';
import SearchBar from './SearchBar';

export default function Header({ onSearchResults }) {
  return (
  <header className="w-full bg-gray-50 border-b border-gray-200 shadow-sm px-4 sm:px-8 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sticky top-0 z-50">
    <Link href="/" className="text-xl font-bold text-gray-600">
        🛍️ ShopAI
      </Link>

      <SearchBar onResults={onSearchResults} />

      <div className="flex gap-4 items-center">
        <Link href="/cart" className="relative">🛒</Link>
        <Link href="/login">Login</Link>
      </div>
    </header>
  );
}
