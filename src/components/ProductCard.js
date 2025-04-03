'use client';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product }) {
  const { dispatch } = useCart();

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  return (
    <div className="border p-4 rounded shadow-md">
      {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={160}
            height={160}
            className="object-contain max-h-36"
          />
        ) : (
          <span className="text-gray-400">No image</span>
        )}
      <h3 className="font-bold text-lg">{product.name}</h3>
      <p className="text-sm text-gray-600">{product.brand}</p>
      <p className="text-xl font-semibold text-blue-600 mb-2">€{product.price}</p>
      <button
        onClick={handleAddToCart}
        className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700"
      >
        Add to Cart
      </button>
    </div>
  );
}
