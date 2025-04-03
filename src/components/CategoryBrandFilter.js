'use client';

import { useEffect, useState } from 'react';

export default function CategoryBrandFilter({ onFilter }) {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then(setCategories)
      .catch((err) => console.error('Category fetch error', err));

    fetch('/api/brands')
      .then((res) => res.json())
      .then(setBrands)
      .catch((err) => console.error('Brand fetch error', err));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (categoryId) params.set('categoryId', categoryId);
    if (brandId) params.set('brandId', brandId);

    fetch(`/api/products?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then(onFilter)
      .catch((err) => {
        console.error('Product fetch error', err);
        onFilter([]);
      });
  }, [categoryId, brandId]);

  return (
    <div className="flex flex-wrap gap-4 mb-8 justify-center">
      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <select
        value={brandId}
        onChange={(e) => setBrandId(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">All Brands</option>
        {brands.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>
    </div>
  );
}
