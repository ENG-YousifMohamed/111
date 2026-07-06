'use client';
import { motion } from 'framer-motion';

const PARTNERS = ["NVIDIA", "INTEL", "AMD", "APPLE", "SONY", "ASUS ROG", "RAZER", "CORSAIR", "LOGITECH G", "SAMSUNG"];

export default function TechPartners() {
  return (
    <section className="py-20 bg-zinc-950 border-y border-white/5 overflow-hidden flex flex-col justify-center" dir="ltr">
      <p className="text-center text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-10">Powered By Industry Leaders</p>
      
      <div className="relative flex max-w-full overflow-hidden group">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-zinc-950 to-transparent z-10"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-zinc-950 to-transparent z-10"></div>
        
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 20, repeat: Infinity }}
          className="flex whitespace-nowrap gap-16 md:gap-32 items-center px-16"
        >
          {/* بنكرر اللستة مرتين عشان الأنيميشن يفضل شغال بدون قطع */}
          {[...PARTNERS, ...PARTNERS].map((partner, i) => (
            <span key={i} className="text-2xl md:text-4xl font-black text-zinc-800 uppercase tracking-tighter hover:text-cyan-500/50 transition-colors cursor-default">
              {partner}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}