'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { useApp } from '@/context/AppContext';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, subtotal, shipping, tax, total } = useApp();

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      <Navbar />
      <div className="h-32 flex-shrink-0" />

      <main className="flex-1 container mx-auto px-6 max-w-7xl pb-24">
        <header className="mb-12 border-b border-white/10 pb-6">
          <div className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-cyan-500 animate-pulse" />
            CART_MANIFEST // PENDING_TRANSMISSION
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
            Shopping <span className="text-zinc-600">Cart</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-4">
            <AnimatePresence mode="popLayout">
              {cart.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-32 text-center border border-dashed border-white/10 rounded-[2rem] bg-zinc-900/10"
                >
                  <p className="text-zinc-500 font-mono tracking-widest text-sm uppercase mb-6">
                    Your cart is completely empty
                  </p>
                  <Link href="/products" className="px-6 py-3 bg-white text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-cyan-400 transition-all">
                    Browse Products
                  </Link>
                </motion.div>
              ) : (
                cart.map((item, index) => (
                  <motion.div
                    layout
                    key={`${item.product.id}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="flex flex-col sm:flex-row items-center justify-between p-6 bg-[#0a0a0a] border border-white/5 rounded-2xl gap-6 hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-6 w-full sm:w-auto">
                      <div className="w-20 h-20 bg-zinc-950 border border-white/5 rounded-xl p-2 flex items-center justify-center">
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          className="max-w-full max-h-full object-contain mix-blend-screen"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-white line-clamp-1">{item.product.title}</h3>
                        <p className="text-xs text-zinc-500 font-mono mt-1 uppercase tracking-wider">
                          {item.product.category || 'Hardware'}
                        </p>
                        <div className="mt-3 flex items-center gap-3 rounded-full border border-white/5 bg-zinc-950 px-3 py-1 w-max">
                          <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="text-zinc-500 hover:text-white text-xs transition-colors">
                            &minus;
                          </button>
                          <span className="text-xs font-black px-1 min-w-[12px] text-center">
                            {item.quantity}
                          </span>
                          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="text-zinc-500 hover:text-white text-xs transition-colors">
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto border-t sm:border-none border-white/5 pt-4 sm:pt-0">
                      <span className="font-mono text-cyan-400 font-bold text-lg">
                        {item.product.price}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="px-4 py-2 bg-zinc-900 border border-white/10 text-xs font-mono uppercase tracking-widest text-red-400 hover:bg-red-500/10 hover:border-red-500/30 rounded-lg transition-all"
                      >
                        Remove
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-4">
            {cart.length > 0 && (
              <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-8 sticky top-32 shadow-2xl">
                <h3 className="font-mono text-xs text-zinc-500 tracking-[0.2em] uppercase border-b border-white/5 pb-4 mb-6">
                  Order Manifest
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between font-mono text-sm">
                    <span className="text-zinc-500">Subtotal</span>
                    <span className="text-white">${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between font-mono text-sm">
                    <span className="text-zinc-500">Shipping</span>
                    <span className={shipping === 0 ? 'text-cyan-400' : 'text-white'}>
                      {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-mono text-sm">
                    <span className="text-zinc-500">Estimated Tax (14%)</span>
                    <span className="text-white">${tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <div className="flex justify-between items-end border-t border-white/10 pt-6">
                  <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
                    Final Total
                  </span>
                  <span className="text-3xl font-black text-white tracking-tighter">
                    ${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <Link href="/checkout" className="w-full mt-8 py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-cyan-400 transition-all flex items-center justify-center hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] active:scale-95">
                  Confirm Transfer
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
