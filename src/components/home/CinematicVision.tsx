'use client';
import { motion } from 'framer-motion';

export default function CinematicVision() {
  return (
    <section className="relative w-full h-[80vh] overflow-hidden bg-black">
      {/* فيديو الخلفية (رابط تجريبي، يمكنك استبداله بفيديو 3D Render الخاص بك) */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-50 scale-105"
      >
        <source src="https://cdn.coverr.co/videos/coverr-modern-living-room-interior-5244/1080p.mp4" type="video/mp4" />
      </video>

      {/* تدرجات دمج الفيديو مع ثيم الموقع */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-zinc-950/80"></div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <p className="text-amber-500 uppercase tracking-[0.5em] text-sm font-bold mb-6">The Vision</p>
          <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter mb-8 leading-tight">
            Designed for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-zinc-100 to-zinc-600">The Future</span>
          </h2>
          <button className="w-20 h-20 rounded-full border border-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-all duration-500 group mx-auto">
            <svg className="ml-1 group-hover:scale-110 transition-transform" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
}