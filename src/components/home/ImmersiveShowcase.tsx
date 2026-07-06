'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ImmersiveShowcase() {
  return (
    <section className="min-h-screen bg-zinc-950 flex items-center justify-center relative overflow-hidden py-32" dir="ltr">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=2000" 
          alt="Sony Headphones" 
          className="w-full h-full object-cover opacity-30 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-zinc-950"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px", once: true }}
          transition={{ duration: 1 }}
        >
          <span className="px-4 py-1.5 rounded-full border border-white/10 text-white text-xs font-mono uppercase tracking-widest bg-white/5 backdrop-blur-md mb-8 inline-block">
            Masterpiece Edition
          </span>
          
          <h2 className="text-6xl md:text-9xl font-black text-white uppercase tracking-tighter leading-none mb-8">
            Pure <br/> <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600">Silence.</span>
          </h2>
          
          <p className="max-w-2xl mx-auto text-zinc-400 text-lg md:text-2xl font-light mb-12">
            Experience the new standard of noise cancellation. Dive into your work, your games, and your music without a single distraction.
          </p>

          <Link href="/product/21" className="inline-flex px-12 py-5 bg-white text-black font-black uppercase tracking-widest rounded-full hover:bg-cyan-400 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(6,182,212,0.4)]">
            Pre-order WH-1000XM5
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
