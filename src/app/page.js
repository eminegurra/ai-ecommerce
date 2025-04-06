'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import Header from '@/components/Header';
import CategoryBrandFilter from '@/components/CategoryBrandFilter';


export default function HomePage() {
  const [allProducts, setAllProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => setAllProducts(data));
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4); // Load 6 more
  };

  return (
    <>
      <Header onSearchResults={setAllProducts} />

      <main className="px-4 sm:px-8 py-16 max-w-7xl mx-auto">

        {/* Banner section remains the same */}
        <section
          className="relative text-center py-20 px-4 sm:px-8 mb-20 rounded-xl text-white"
          style={{
            backgroundImage: `url('/images/banner.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="bg-opacity-40 absolute inset-0 rounded-xl"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold mb-4">Discover Your Next Favorite Gadget</h2>
            <p className="text-lg mb-6">
              Shop top picks curated by your AI shopping assistant.
            </p>
            <Link href="/products">
              <button className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-full text-lg shadow-md transition">
                Browse Products
              </button>
            </Link>
          </div>
        </section>


        {/* 🛍️ Featured Products */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-6 text-center">Featured Products</h2>
          <CategoryBrandFilter onFilter={setAllProducts} />

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {allProducts.length > 0 ? (
              allProducts.slice(0, visibleCount).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-full">No products found.</p>
            )}
          </div>

          {/* Load More Button */}
          {visibleCount < allProducts.length && (
            <div className="text-center mt-8">
              <button
                onClick={handleLoadMore}
                className="bg-gray-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full text-lg transition"
              >
                Load More
              </button>
            </div>
          )}
        </section>

        {/* 📦 How It Works */}
        <section className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-10">
            <div>
              <h3 className="font-semibold mb-1">1. Ask</h3>
              <p className="text-sm text-gray-500">Tell the AI your budget or need.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">2. Discover</h3>
              <p className="text-sm text-gray-500">Get smart product suggestions.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">3. Shop</h3>
              <p className="text-sm text-gray-500">Buy what fits you best.</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
