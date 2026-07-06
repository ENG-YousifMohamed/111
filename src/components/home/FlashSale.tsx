'use client';

import { motion } from 'framer-motion';
import { useMemo, useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { useStoreProducts } from '@/hooks/useStoreProducts';

export default function FlashSale() {
  const { addToCart } = useApp();
  const { products, isLoading } = useStoreProducts();
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 30 });

  const featuredProduct = useMemo(
    () => products.find((product) => (product.stock ?? 1) > 0) ?? products[0] ?? null,
    [products],
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const buttonLabel = featuredProduct ? `Claim Drop - ${featuredProduct.price}` : 'No Active Drop';

  return (
    <section id="deals" className="py-24 bg-zinc-950 relative overflow-hidden" dir="ltr">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />

      <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/30 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-full mb-6">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> Flash Drop
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-4">
            {isLoading ? (
              'Loading Drop'
            ) : featuredProduct ? (
              <>
                {featuredProduct.title}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                  {featuredProduct.category}
                </span>
              </>
            ) : (
              'No Live Drop'
            )}
          </h2>

          <p className="text-zinc-400 max-w-md mb-8">
            {featuredProduct
              ? featuredProduct.description ?? featuredProduct.specs ?? 'Database product ready for checkout.'
              : 'Add products from the dashboard database to activate this storefront section.'}
          </p>

          <div className="flex gap-4 mb-8">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center text-2xl font-black text-white font-mono shadow-inner">
                  {value.toString().padStart(2, '0')}
                </div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-2">{unit}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              if (featuredProduct) addToCart(featuredProduct);
            }}
            disabled={!featuredProduct}
            className="px-10 py-4 bg-white text-zinc-950 font-black uppercase tracking-widest rounded-full hover:bg-red-500 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {buttonLabel}
          </button>
        </div>

        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
          className="flex-1 relative"
        >
          {featuredProduct ? (
            <img
              src={featuredProduct.image}
              alt={featuredProduct.title}
              className="w-full max-w-lg mx-auto transform -rotate-12 drop-shadow-[0_30px_50px_rgba(239,68,68,0.2)] rounded-3xl"
            />
          ) : (
            <div className="w-full max-w-lg mx-auto aspect-square rounded-3xl border border-white/10 bg-zinc-900/40 flex items-center justify-center text-zinc-600 font-mono text-sm">
              DATABASE_EMPTY
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
