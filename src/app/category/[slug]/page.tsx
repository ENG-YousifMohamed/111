'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useApp } from '@/context/AppContext';
import { useStoreProducts } from '@/hooks/useStoreProducts';

function normalizeCategory(value: string) {
  return decodeURIComponent(value).toLowerCase().trim().replace(/\s+/g, '-');
}

export default function CategoryPage() {
  const params = useParams();
  const slug = String(params?.slug ?? '');
  const { addToCart } = useApp();
  const { products, isLoading, error } = useStoreProducts();

  const categoryProducts = useMemo(
    () =>
      products.filter(
        (product) => normalizeCategory(product.category) === normalizeCategory(slug),
      ),
    [products, slug],
  );

  const title = categoryProducts[0]?.category ?? decodeURIComponent(slug || 'products');

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans">
      <Navbar />
      <div className="h-32 flex-shrink-0" />

      <main className="flex-1 container mx-auto px-6 pb-24">
        <header className="mb-16">
          <div className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-cyan-500 animate-pulse" />
            SECTOR // {title.toUpperCase()}
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
            {title} <span className="text-zinc-600">Hardware</span>
          </h1>
        </header>

        {isLoading ? (
          <div className="py-20 text-center border border-white/5 rounded-3xl bg-[#0a0a0a]">
            <p className="text-zinc-500 font-mono">Loading database products...</p>
          </div>
        ) : error ? (
          <div className="py-20 text-center border border-red-500/20 rounded-3xl bg-red-950/10">
            <p className="text-red-300 font-mono">{error}</p>
          </div>
        ) : categoryProducts.length === 0 ? (
          <div className="py-20 text-center border border-white/5 rounded-3xl bg-[#0a0a0a]">
            <p className="text-zinc-500 font-mono">No products found in this database category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryProducts.map((product) => (
              <Link href={`/product/${product.id}`} key={product.id}>
                <div className="bg-[#0a0a0a] rounded-3xl p-5 border border-white/5 hover:border-cyan-500/30 transition-all group cursor-pointer h-full flex flex-col">
                  <div className="relative overflow-hidden rounded-2xl mb-4 aspect-square bg-zinc-950">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                    />
                  </div>
                  <h3 className="text-base font-bold text-zinc-100 mb-1 group-hover:text-cyan-400 line-clamp-1">
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between mt-auto pt-4">
                    <span className="text-xl font-black text-white">{product.price}</span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product);
                      }}
                      className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-cyan-500 hover:text-zinc-950 transition-all z-20 relative active:scale-95"
                      aria-label={`Add ${product.title} to cart`}
                    >
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                      </svg>
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
