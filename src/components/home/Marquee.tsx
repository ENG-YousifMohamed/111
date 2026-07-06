'use client';
import { motion } from 'framer-motion';

export default function Marquee() {
  const text = "REDEFINE YOUR SPACE • DECONSTRUCT THE ORDINARY • LUXURY REDEFINED • ";
  
  return (
    <section className="py-4 bg-amber-500 overflow-hidden transform -rotate-1 scale-105 z-20 relative shadow-xl">
      <div className="flex whitespace-nowrap">
        <motion.div
          className="flex text-2xl md:text-3xl font-black text-zinc-950 uppercase tracking-[0.3em]"
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
        >
          <span>{text}</span>
          <span>{text}</span>
          <span>{text}</span>
          <span>{text}</span>
        </motion.div>
      </div>
    </section>
  );
}