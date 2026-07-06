'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { useStoreProducts } from '@/hooks/useStoreProducts';

export default function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, recentSearches, addRecentSearch } = useApp();
  const { products } = useStoreProducts();
  const [query, setQuery] = useState('');

  const suggestions = useMemo(() => {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) return [];

    return products
      .filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm) ||
          product.specs?.toLowerCase().includes(searchTerm),
      )
      .slice(0, 4);
  }, [products, query]);

  const trendingTerms = useMemo(
    () =>
      Array.from(new Set(products.map((product) => product.category).filter(Boolean))).slice(
        0,
        4,
      ),
    [products],
  );

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 bg-zinc-950/95 backdrop-blur-3xl z-[9999] pt-32 px-6 text-white overflow-y-auto flex justify-center"
        >
          <div className="w-full max-w-3xl flex flex-col">
            <div className="absolute top-8 right-8">
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setQuery('');
                }}
                className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 transition-all text-xl"
                aria-label="Close search"
              >
                &times;
              </button>
            </div>

            <div className="relative border-b border-white/10 focus-within:border-cyan-400 transition-colors pb-6 flex items-center group">
              <input
                type="text"
                autoFocus
                placeholder="SEARCH DATABASE PRODUCTS..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addRecentSearch(query)}
                className="w-full bg-transparent text-3xl md:text-6xl font-light uppercase tracking-tighter focus:outline-none placeholder:text-zinc-800"
              />
              <svg className="w-8 h-8 text-zinc-700 group-focus-within:text-cyan-400 transition-colors" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {query && (
              <div className="mt-12 space-y-4">
                <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Instant Results</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {suggestions.length > 0 ? (
                    suggestions.map((product) => (
                      <Link
                        href={`/product/${product.id}`}
                        key={product.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          addRecentSearch(product.title);
                          setQuery('');
                        }}
                      >
                        <div className="flex items-center gap-4 p-4 bg-zinc-900/30 rounded-2xl border border-white/5 hover:border-cyan-500/30 hover:bg-zinc-900/60 transition-all cursor-pointer">
                          <img src={product.image} alt={product.title} className="w-12 h-12 object-cover rounded-xl bg-zinc-950" />
                          <div className="flex-1 min-w-0">
                            <span className="font-bold text-sm block truncate text-zinc-100">{product.title}</span>
                            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mt-0.5">{product.category}</span>
                          </div>
                          <span className="text-sm font-black text-cyan-400">{product.price}</span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-zinc-600 text-sm py-4">No database matches found.</p>
                  )}
                </div>
              </div>
            )}

            {!query && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
                <div>
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Recent Inquiries</h4>
                  {recentSearches.length > 0 ? (
                    <div className="space-y-3">
                      {recentSearches.map((search, index) => (
                        <p
                          key={index}
                          onClick={() => setQuery(search)}
                          className="text-zinc-300 hover:text-cyan-400 cursor-pointer text-lg font-light tracking-wide transition-colors"
                        >
                          &rarr; {search}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-zinc-700 text-xs">No recent searches.</p>
                  )}
                </div>

                <div>
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Database Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {trendingTerms.length > 0 ? (
                      trendingTerms.map((term) => (
                        <span
                          key={term}
                          onClick={() => setQuery(term)}
                          className="px-5 py-2 bg-zinc-900/60 border border-white/5 rounded-full text-xs font-medium text-zinc-400 hover:text-cyan-400 hover:border-cyan-400/30 cursor-pointer transition-all"
                        >
                          {term}
                        </span>
                      ))
                    ) : (
                      <span className="text-zinc-700 text-xs">No database categories yet.</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
