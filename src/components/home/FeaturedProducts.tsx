'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { useStoreProducts } from '@/hooks/useStoreProducts';

const ALL_CATEGORY = 'All';
const ITEMS_PER_PAGE = 10;

export default function FeaturedProducts() {
  const { addToCart } = useApp();
  const { products, isLoading, error } = useStoreProducts();
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);
  const [currentPage, setCurrentPage] = useState(1);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(products.map((product) => product.category).filter(Boolean)),
    );

    return [ALL_CATEGORY, ...uniqueCategories];
  }, [products]);

  const filteredProducts = useMemo(
    () =>
      selectedCategory === ALL_CATEGORY
        ? products
        : products.filter((product) => product.category === selectedCategory),
    [products, selectedCategory],
  );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const visiblePage = Math.min(currentPage, Math.max(totalPages, 1));
  const currentProducts = filteredProducts.slice(
    (visiblePage - 1) * ITEMS_PER_PAGE,
    visiblePage * ITEMS_PER_PAGE,
  );

  return (
    <section id="products" className="py-24 bg-zinc-950 text-white min-h-screen" dir="ltr">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-widest">
            Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Collection</span>
          </h2>
        </div>

        <div className="flex justify-center items-center mb-16">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide max-w-full justify-start md:justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-8 py-3 rounded-full text-xs font-bold tracking-wider uppercase whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-zinc-950 shadow-[0_0_25px_rgba(6,182,212,0.4)]'
                    : 'bg-zinc-900/60 text-zinc-400 border border-white/5 hover:border-cyan-500/30 hover:text-cyan-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-[600px]">
          {isLoading ? (
            <div className="py-20 text-center border border-white/5 rounded-3xl bg-zinc-900/30">
              <p className="text-zinc-500 font-mono">Loading database products...</p>
            </div>
          ) : error ? (
            <div className="py-20 text-center border border-red-500/20 rounded-3xl bg-red-950/10">
              <p className="text-red-300 font-mono">{error}</p>
            </div>
          ) : currentProducts.length === 0 ? (
            <div className="py-20 text-center border border-white/5 rounded-3xl bg-zinc-900/30">
              <p className="text-zinc-500 font-mono">No products found in the database.</p>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <AnimatePresence>
                {currentProducts.map((product) => (
                  <Link href={`/product/${product.id}`} key={product.id}>
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="bg-zinc-900/30 backdrop-blur-md rounded-3xl p-5 border border-white/5 hover:border-cyan-500/30 hover:bg-zinc-900/60 transition-all duration-300 group cursor-pointer h-full flex flex-col relative"
                    >
                      <div className="relative overflow-hidden rounded-2xl mb-4 aspect-square bg-zinc-950">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                        />
                        <div className="absolute top-2 right-2 bg-zinc-950/85 backdrop-blur-md px-3 py-1 rounded-full border border-white/5">
                          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                            {product.category}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-base font-bold text-zinc-100 mb-1 group-hover:text-cyan-400 transition-colors line-clamp-1">
                        {product.title}
                      </h3>
                      <p className="text-zinc-500 text-xs mb-4 flex-1 line-clamp-2">{product.specs}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-xl font-black text-white">{product.price}</span>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart(product);
                          }}
                          className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-cyan-500 hover:text-zinc-950 transition-all z-20 relative shadow-lg hover:shadow-[0_0_15px_#06b6d4] active:scale-95"
                          aria-label={`Add ${product.title} to cart`}
                        >
                          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                          </svg>
                        </button>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-20 border-t border-white/5 pt-8">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={visiblePage === 1}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center disabled:opacity-20 disabled:cursor-not-allowed hover:bg-zinc-900 transition-colors"
            >
              &larr;
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-full text-xs font-bold transition-all ${
                    visiblePage === i + 1
                      ? 'bg-cyan-500 text-zinc-950 shadow-lg'
                      : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={visiblePage === totalPages}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center disabled:opacity-20 disabled:cursor-not-allowed hover:bg-zinc-900 transition-colors"
            >
              &rarr;
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
