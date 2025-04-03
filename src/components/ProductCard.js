'use client';
import Image from 'next/image';

export default function ProductCard({ product }) {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
      <div className="w-full h-40 flex items-center justify-center bg-gray-50 overflow-hidden rounded">
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
      </div>
      <h3 className="text-lg font-semibold mt-3">{product.name}</h3>
      <p className="text-gray-600 text-sm mb-1">Brand: {product.brand}</p>
      <p className="text-blue-600 font-bold">€{product.price}</p>
    </div>
  );
}
