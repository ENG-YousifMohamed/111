'use client';
import { useApp } from '@/context/AppContext';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useState, useMemo, useEffect, useRef } from 'react';
import { useStoreProducts } from '@/hooks/useStoreProducts';
import Link from 'next/link';
import Image from 'next/image';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", bounce: 0.3, duration: 0.5 } }
};

export default function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, recentSearches, addRecentSearch } = useApp();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { products: allProducts } = useStoreProducts();

  const quickCategories = useMemo(
    () =>
      Array.from(new Set(allProducts.map((product) => product.category).filter(Boolean))).slice(
        0,
        5,
      ),
    [allProducts],
  );

  const popularSearches = useMemo(() => {
    const productTitles = allProducts.slice(0, 4).map((product) => product.title);
    return productTitles.length > 0 ? productTitles : quickCategories;
  }, [allProducts, quickCategories]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setQuery('');
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isSearchOpen]);

  const results = useMemo(() => {
    let filtered = allProducts;
    if (activeTab !== 'All') {
      filtered = filtered.filter((p) => p.category.toLowerCase() === activeTab.toLowerCase());
    }
    if (query.trim()) {
      const searchTerm = query.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm) ||
        p.specs?.toLowerCase().includes(searchTerm)
      );
    }
    return filtered.slice(0, 8);
  }, [query, activeTab, allProducts]);

  const handleClose = () => {
    setIsSearchOpen(false);
    setQuery('');
    setActiveTab('All');
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(10,10,10,0.95) 0%, rgba(0,0,0,0.98) 100%)'
          }}
        >
          <div 
            className="absolute inset-0 backdrop-blur-sm" 
            onClick={handleClose}
          >
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
          </div>

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              animate={{ 
                x: [0, 80, -60, 0], 
                y: [0, -60, 80, 0],
                scale: [1, 1.2, 0.9, 1] 
              }} 
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-amber-500/10 rounded-full blur-3xl"
            />
            <motion.div 
              animate={{ 
                x: [0, -60, 80, 0], 
                y: [0, 80, -60, 0],
                scale: [1, 0.9, 1.2, 1] 
              }} 
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-3xl"
            />
            <motion.div 
              animate={{ 
                x: [0, 50, -50, 0], 
                y: [0, -50, 50, 0],
                scale: [1, 1.1, 1.3, 1] 
              }} 
              transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
              className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-amber-600/5 rounded-full blur-3xl"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-900/90 backdrop-blur-2xl border border-amber-500/10 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.05)'
            }}
          >
            
            <div className="relative p-6 pb-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-cyan-500/10 to-amber-500/10 rounded-full blur-xl" />
                <div className="relative flex items-center bg-black/60 border border-amber-500/20 rounded-full px-6 py-4 backdrop-blur-xl focus-within:border-amber-500/50 focus-within:bg-black/80 transition-all duration-500 shadow-lg">
                  <motion.svg 
                    className="w-5 h-5 text-amber-400/60 flex-shrink-0"
                    animate={{ rotate: query ? 90 : 0 }}
                    transition={{ duration: 0.3 }}
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </motion.svg>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search for premium products..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && query && addRecentSearch(query)}
                    className="flex-1 bg-transparent border-none outline-none text-lg text-white placeholder:text-white/30 ml-3 font-light tracking-wide"
                    aria-label="Search products"
                  />
                  {query && (
                    <motion.button 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      onClick={() => setQuery('')} 
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
                      aria-label="Clear search"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 pb-2">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab('All')}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap backdrop-blur-sm ${
                    activeTab === 'All' 
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/30' 
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5'
                  }`}
                >
                  ✨ All
                </motion.button>
                {quickCategories.map(tab => (
                  <motion.button
                    key={tab}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap backdrop-blur-sm ${
                      activeTab === tab 
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/30' 
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5'
                    }`}
                  >
                    {tab}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 pt-2 scrollbar-hide min-h-[30vh]">
              {query || activeTab !== 'All' ? (
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {results.length > 0 ? (
                    results.map((p, index) => (
                      <motion.div 
                        variants={itemVariants} 
                        key={p.id}
                        onHoverStart={() => setHoveredIndex(index)}
                        onHoverEnd={() => setHoveredIndex(null)}
                      >
                        <Link href={`/product/${p.id}`} onClick={handleClose}>
                          <motion.div 
                            className="group relative bg-gradient-to-br from-white/5 to-white/[0.03] hover:from-white/10 hover:to-white/5 border border-white/5 hover:border-amber-500/30 rounded-xl p-3 transition-all duration-500 cursor-pointer backdrop-blur-sm overflow-hidden"
                            whileHover={{ y: -2 }}
                            style={{
                              boxShadow: hoveredIndex === index ? '0 10px 30px -10px rgba(0,0,0,0.6)' : 'none'
                            }}
                          >
                            <motion.div 
                              className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-cyan-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                              animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                            />
                            
                            <div className="relative flex items-center gap-3">
                              <div className="w-14 h-14 rounded-xl bg-black/50 p-1.5 flex-shrink-0 overflow-hidden border border-white/5">
                                <Image 
                                  src={p.image} 
                                  width={56}
                                  height={56}
                                  className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-500" 
                                  alt={p.title} 
                                />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm text-white/90 truncate group-hover:text-amber-400 transition-colors">
                                  {p.title}
                                </h3>
                                <p className="text-xs text-amber-400/70 font-bold">
                                  {p.price}
                                </p>
                              </div>

                              <motion.div 
                                className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300 shadow-lg"
                                whileHover={{ scale: 1.1 }}
                              >
                                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                              </motion.div>
                            </div>
                          </motion.div>
                        </Link>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div 
                      variants={itemVariants}
                      className="col-span-full flex flex-col items-center justify-center py-12"
                    >
                      <motion.div
                        animate={{ 
                          y: [0, -8, 0],
                          rotate: [0, 3, -3, 0]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-5xl mb-4"
                      >
                        🔍
                      </motion.div>
                      <p className="text-white/60 text-base font-light">No results found</p>
                      <p className="text-white/30 text-sm mt-1">Try adjusting your search</p>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <motion.div variants={itemVariants} className="group bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/5 rounded-xl p-5 backdrop-blur-sm hover:border-amber-500/20 transition-all duration-300">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400/60 mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Recent
                    </h4>
                    {recentSearches.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((s: string, i: number) => (
                          <motion.span 
                            key={i} 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setQuery(s)} 
                            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-xs text-white/70 cursor-pointer transition-all hover:text-amber-400"
                          >
                            {s}
                          </motion.span>
                        ))}
                      </div>
                    ) : (
                      <div className="h-16 flex items-center justify-center border border-dashed border-white/5 rounded-lg">
                        <span className="text-white/20 text-xs">No recent searches</span>
                      </div>
                    )}
                  </motion.div>

                  <motion.div variants={itemVariants} className="group bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/5 rounded-xl p-5 backdrop-blur-sm hover:border-amber-500/20 transition-all duration-300">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400/60 mb-3 flex items-center gap-2">
                      <motion.span
                        animate={{ rotate: [0, 8, -8, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        🔥
                      </motion.span>
                      Trending
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((p, i) => (
                        <motion.span 
                          key={i} 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setQuery(p)} 
                          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-xs text-white/70 cursor-pointer transition-all hover:text-amber-400"
                        >
                          {p}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="col-span-full bg-gradient-to-r from-amber-500/5 via-cyan-500/5 to-amber-500/5 border border-amber-500/10 rounded-xl p-5 backdrop-blur-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">✨</span>
                        <div>
                          <p className="text-white/90 font-semibold text-sm">Discover premium products</p>
                          <p className="text-white/40 text-xs">Explore our curated collection</p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleClose}
                        className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-full text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-shadow"
                      >
                        Browse All
                      </motion.button>
                    </div>
                  </motion.div>

                </motion.div>
              )}
            </div>

            {/* ✅ تم حذف الفوتر بالكامل */}
            
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
