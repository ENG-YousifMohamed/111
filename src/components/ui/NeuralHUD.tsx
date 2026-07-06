'use client';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product } from '@/lib/products';

export default function NeuralHUD({ activeProduct }: { activeProduct: Pick<Product, 'title'> | null }) {
  return (
    <AnimatePresence>
      {activeProduct && (
        <motion.div 
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="fixed right-8 top-1/2 -translate-y-1/2 z-50 w-72 bg-black/80 backdrop-blur-2xl border border-cyan-500/30 p-6 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.1)] pointer-events-none"
        >
          <h4 className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest mb-4">Neural Analysis</h4>
          <h3 className="text-xl font-black text-white mb-2">{activeProduct.title}</h3>
          <div className="space-y-4 mt-6">
            <div>
              <div className="flex justify-between text-[10px] text-zinc-500 mb-1"><span>COMPATIBILITY</span><span>98%</span></div>
              <div className="h-1 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full w-[98%] bg-cyan-500"></div></div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] text-zinc-500 mb-1"><span>DEMAND_INDEX</span><span>HIGH</span></div>
              <div className="h-1 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full w-[85%] bg-amber-500"></div></div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
