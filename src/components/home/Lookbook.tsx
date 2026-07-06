'use client';
import { motion } from 'framer-motion';

export default function Lookbook() {
  const images = [
    { id: 1, src: "https://images.unsplash.com/photo-1618220179428-22790b46a0eb?auto=format&fit=crop&w=800&q=80", col: "md:col-span-2", row: "md:row-span-2" },
    { id: 2, src: "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=800&q=80", col: "md:col-span-1", row: "md:row-span-1" },
    { id: 3, src: "https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?auto=format&fit=crop&w=800&q=80", col: "md:col-span-1", row: "md:row-span-1" },
    { id: 4, src: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80", col: "md:col-span-3", row: "md:row-span-1" },
  ];

  return (
    <section className="py-24 bg-zinc-950 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-zinc-100 tracking-tighter">
            THE <span className="text-amber-500">LOOKBOOK</span>
          </h2>
          <p className="text-zinc-400 mt-2">مساحة للإلهام البصري. اكتشف كيف تتداخل التصميمات.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:auto-rows-[250px]">
          {images.map((img, i) => (
            <motion.div 
              key={img.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className={`relative overflow-hidden rounded-3xl group cursor-pointer border border-white/5 ${img.col} ${img.row}`}
            >
              <div className="absolute inset-0 bg-zinc-950/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
              <img 
                src={img.src} 
                alt="Gallery Inspiration" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 flex flex-col justify-end p-8">
                <span className="text-amber-400 font-bold tracking-widest uppercase text-sm mb-2">Shop The Look</span>
                <div className="h-1 w-12 bg-amber-500"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}