'use client';
import { useEffect, useState } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>🛍️ All Products</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        {products.map((product) => (
          <div key={product.id} style={{ border: '1px solid #ddd', padding: 10, width: 200 }}>
            <img src={product.imageUrl} alt={product.name} width="100%" />
            <h3>{product.name}</h3>
            <p><strong>Brand:</strong> {product.brand}</p>
            <p><strong>Price:</strong> ${product.price}</p>
            <p>{product.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
