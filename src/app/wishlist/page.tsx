'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { useApp } from '@/context/AppContext';
import type { Product } from '@/lib/products';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart } = useApp();
  const [shareStatus, setShareStatus] = useState('SHARE_MANIFEST');

  const handleMoveToCart = (item: Product) => {
    addToCart(item);
    removeFromWishlist(item.id);
  };

  const handleShareWishlist = async () => {
    if (typeof window === 'undefined') return;

    await navigator.clipboard.writeText(window.location.href);
    setShareStatus('COPIED_TO_CLIPBOARD // SYNCED');
    window.setTimeout(() => setShareStatus('SHARE_MANIFEST'), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      <Navbar />
      <div className="h-40 flex-shrink-0" />

      <main className="flex-1 container mx-auto px-6 max-w-7xl pb-24 relative z-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-white/5 pb-8">
          <div>
            <div className="text-[10px] font-mono text-red-500 uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              SECURE_VAULT_NODE // STOWED_HARDWARE
            </div>
            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter">
              Saved <span className="text-zinc-600">Payload</span>
            </h1>
          </div>

          {wishlist.length > 0 && (
            <button
              onClick={handleShareWishlist}
              className="font-mono text-xs uppercase tracking-widest px-6 py-3 bg-zinc-900 border border-white/10 rounded-xl hover:border-cyan-500 hover:text-cyan-400 transition-all active:scale-95 shadow-lg"
            >
              {shareStatus}
            </button>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {wishlist.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-40 text-center border border-dashed border-white/10 rounded-[2.5rem] bg-zinc-900/10 backdrop-blur-sm"
              >
                <p className="text-zinc-600 font-mono tracking-[0.4em] text-lg uppercase mb-6">
                  Vault is currently empty
                </p>
                <Link href="/products" className="px-6 py-3 bg-white text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-cyan-400 transition-all">
                  Browse Hardware
                </Link>
              </motion.div>
            ) : (
              wishlist.map((item, idx) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="group bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-6 relative flex flex-col justify-between hover:border-red-500/20 transition-all duration-500 shadow-xl"
                >
                  <span className="absolute top-6 left-6 text-[9px] font-mono text-zinc-700 tracking-widest">
                    SEC_INDEX_0{idx + 1}
                  </span>

                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-6 right-6 p-2 rounded-full bg-zinc-900/50 border border-white/5 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 transition-all"
                    title="Remove item"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <div className="h-48 w-full flex items-center justify-center bg-zinc-950 rounded-2xl p-4 mb-6 mt-6 border border-white/5">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="max-w-full max-h-full object-contain mix-blend-screen group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="mb-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1 group-hover:text-red-400 transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-4">
                        {item.category || 'Hardware'}
                      </p>
                    </div>
                    <div className="text-2xl font-black text-white font-mono">{item.price}</div>
                  </div>

                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="w-full py-4 bg-zinc-900 border border-white/10 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-white hover:text-black transition-all active:scale-[0.98]"
                  >
                    Transfer to Cart
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
