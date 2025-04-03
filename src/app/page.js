'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import Header from '@/components/Header';
import CategoryBrandFilter from '@/components/CategoryBrandFilter';


export default function HomePage() {
  const [products, setProducts] = useState([]);

  // Load initial featured products (top 4)
  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data.slice(0, 4)));
  }, []);

  return (
    <>
      {/* Header handles search and passes results to setProducts */}
      <Header onSearchResults={setProducts} />

      <main className="px-4 sm:px-8 py-16 max-w-7xl mx-auto">
        {/* 🧠 Hero Section */}
        {/* <section className="text-center mb-20">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Find the Right Tech in Seconds
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Our smart AI shopping buddy, helps you discover phones, laptops, and more — within your budget.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 shadow flex items-center justify-center gap-4">
            <img src="/images/emoji-store.png" className="w-10 h-10" alt="Store" />
            <Link href="/products">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-full text-lg transition">
                Browse Products
              </button>
            </Link>
          </div>

        </section> */}

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
          <CategoryBrandFilter onFilter={setProducts} />
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-full">No products found.</p>
            )}
          </div>
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
