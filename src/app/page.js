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
        <section className="text-center mb-20">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Shop Smart. Shop with AI.
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Let Emine, your AI assistant, help you find the perfect product for your budget.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link href="/products">
              <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
                Browse Products
              </button>
            </Link>
            <button
              onClick={() => {
                const chatBtn = document.querySelector('.chat-widget-button');
                chatBtn?.click();
                setTimeout(() => {
                  const input = document.querySelector('.chat-widget-input');
                  if (input) input.value = "What can I buy for €50?";
                }, 200);
              }}
              className="border border-gray-300 px-6 py-3 rounded hover:bg-gray-100"
            >
              Try AI Assistant
            </button>
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
