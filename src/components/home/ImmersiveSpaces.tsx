'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';

export default function ImmersiveSpaces() {
  const [activeSpot, setActiveSpot] = useState<number | null>(null);

  // إحداثيات النقاط التفاعلية على الصورة
  const hotspots = [
    { id: 1, x: '45%', y: '60%', title: 'Zaha Lounge Chair', price: '$1,200', align: 'left' },
    { id: 2, x: '70%', y: '40%', title: 'Suspended Light', price: '$450', align: 'right' },
    { id: 3, x: '25%', y: '75%', title: 'Abstract Rug', price: '$300', align: 'left' },
  ];

  return (
    <section className="py-24 bg-zinc-950 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-zinc-100 uppercase tracking-widest">
            Shop By <span className="text-amber-500">Space</span>
          </h2>
          <p className="text-zinc-400 mt-4 text-lg">تفاعل مع القطع داخل مساحتها الطبيعية.</p>
        </div>

        <div className="relative w-full aspect-video rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
          {/* صورة الرندر المعماري للغرفة بالكامل */}
          <img 
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1920&q=80" 
            alt="Immersive 3D Space" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-zinc-950/30 transition-colors duration-500"></div>

          {/* النقاط التفاعلية (Hotspots) */}
          {hotspots.map((spot) => (
            <div key={spot.id} className="absolute" style={{ top: spot.y, left: spot.x }}>
              {/* النقطة المضيئة */}
              <button 
                onClick={() => setActiveSpot(activeSpot === spot.id ? null : spot.id)}
                className="relative flex items-center justify-center w-8 h-8 group z-20"
              >
                <span className="absolute w-full h-full bg-amber-500 rounded-full animate-ping opacity-60"></span>
                <span className="relative w-4 h-4 bg-amber-400 rounded-full border-2 border-zinc-950 group-hover:scale-150 transition-transform"></span>
              </button>

              {/* الكارت اللي بيظهر لما تدوس على النقطة */}
              <AnimatePresence>
                {activeSpot === spot.id && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`absolute top-10 ${spot.align === 'left' ? '-left-20' : '-right-20'} w-48 bg-zinc-900/90 backdrop-blur-md border border-amber-500/30 rounded-2xl p-4 z-30 shadow-2xl`}
                  >
                    <h4 className="text-zinc-100 font-bold text-sm mb-1">{spot.title}</h4>
                    <p className="text-amber-500 text-xs font-bold mb-3">{spot.price}</p>
                    <Link href="/products" className="block w-full py-2 bg-zinc-100 text-zinc-950 text-xs font-bold rounded-lg hover:bg-amber-500 transition-colors text-center">
                      عرض التفاصيل
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
