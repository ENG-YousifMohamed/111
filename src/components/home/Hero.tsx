'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-950 pt-20" dir="ltr">
      
      {/* خلفية تكنولوجية (Cyber Grid & Glow) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-12">
        
        {/* النص (اليسار) */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            Next-Gen Tech Available
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[1.1] mb-6">
            THE FUTURE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">IS NOW.</span>
          </h1>
          
          <p className="text-zinc-400 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 mb-10 font-light leading-relaxed">
            Equip yourself with top-tier electronics. From blazing-fast laptops to immersive VR headsets, discover the tech that redefines reality.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <Link href="#products">
              <button className="px-8 py-4 bg-cyan-500 text-zinc-950 font-black uppercase tracking-widest rounded-full hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all transform hover:-translate-y-1">
                Explore Gear
              </button>
            </Link>
            <Link href="#deals">
              <button className="px-8 py-4 bg-transparent border border-white/10 text-white font-bold uppercase tracking-widest rounded-full hover:border-cyan-500 hover:text-cyan-400 transition-colors flex items-center gap-2">
                View Specs
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </button>
            </Link>
          </div>

          {/* إحصائيات تقنية */}
          <div className="grid grid-cols-3 gap-6 mt-16 pt-8 border-t border-white/5 max-w-lg mx-auto lg:mx-0">
            <div>
              <h4 className="text-3xl font-black text-white">50<span className="text-cyan-500">+</span></h4>
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mt-1">Premium Devices</p>
            </div>
            <div>
              <h4 className="text-3xl font-black text-white">24<span className="text-cyan-500">h</span></h4>
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mt-1">Express Delivery</p>
            </div>
            <div>
              <h4 className="text-3xl font-black text-white">2<span className="text-cyan-500">Y</span></h4>
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mt-1">Pro Warranty</p>
            </div>
          </div>
        </motion.div>

        {/* الصورة (اليمين) - صورة نظارة VR خرافية */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="flex-1 relative hidden lg:block"
        >
          <div className="relative w-full aspect-square flex items-center justify-center">
            {/* دوائر هولوجرام خلف الصورة */}
            <div className="absolute inset-4 border border-cyan-500/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
            <div className="absolute inset-12 border border-blue-500/10 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
            
            <motion.img 
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              src="https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&q=80&w=1000" 
              alt="Next Gen Tech" 
              className="relative z-10 w-4/5 object-cover rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-white/5"
            />

            {/* كروت طايرة حول الصورة */}
            <motion.div 
              animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
              className="absolute -right-8 top-1/4 bg-zinc-900/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl z-20"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Ultra Fast</p>
                  <p className="text-zinc-500 text-xs">M3 Processing</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}