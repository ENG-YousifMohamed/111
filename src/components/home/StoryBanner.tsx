'use client';
import { motion } from 'framer-motion';

export default function StoryBanner() {
  return (
    <section className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden border-t border-white/5">
      {/* صورة الخلفية العملاقة */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80" 
          alt="Brand Story" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-zinc-950/60 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-transparent to-zinc-950"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center px-6 max-w-4xl"
      >
        <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 uppercase">
          Beyond <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600">Form</span>
        </h2>
        <p className="text-xl text-zinc-300 leading-relaxed font-light">
          نحن لا نصنع منتجات، بل نصنع مساحات تنبض بالحياة وتكسر صمت الفراغ المعماري.
        </p>
      </motion.div>
    </section>
  );
}