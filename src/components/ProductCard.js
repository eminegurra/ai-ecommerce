import QuantitySelector from './QuantitySelector';

export default function ProductCard({ product }) {
  return (
    <div className="border p-4 rounded shadow-md">
      <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover mb-2" />
      <h3 className="font-bold text-lg">{product.name}</h3>
      <p className="text-sm text-gray-600">{product.brand}</p>
      <p className="text-xl font-semibold text-blue-600 mb-2">€{product.price}</p>

      {/* 👉 Insert the dynamic quantity UI here */}
      <QuantitySelector product={product} />
    </div>
  );
}
