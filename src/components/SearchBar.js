'use client';

import { useEffect, useState } from 'react';

export default function SearchBar({ onResults }) {
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      const params = new URLSearchParams();
      if (search) params.set('q', search);

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      onResults(data);
    };

    fetchResults();
  }, [search]);

  return (
    <input
      type="text"
      placeholder="Search products..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="border px-4 py-2 rounded w-full max-w-sm"
    />
  );
}
