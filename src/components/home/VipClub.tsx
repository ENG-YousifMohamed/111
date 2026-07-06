'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';

// عناصر الهاردوير المتحركة في الخلفية
const CYBER_ELEMENTS = [
  { id: 1, type: 'GPU', label: 'GPU-NODE', x: '10%', y: '15%', size: 'text-6xl', delay: 0 },
  { id: 2, type: 'CPU', label: 'CPU-NODE', x: '85%', y: '20%', size: 'text-7xl', delay: 2 },
  { id: 3, type: 'RAM', label: 'DDR5-64GB', x: '12%', y: '75%', size: 'text-5xl', delay: 4 },
  { id: 4, type: 'CHIP', label: 'CHIP-NODE', x: '80%', y: '70%', size: 'text-6xl', delay: 1 },
];

export default function VipClub() {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <section className="py-40 relative overflow-hidden bg-zinc-950 flex items-center justify-center min-h-[90vh]" dir="ltr">
      
      {/* ================= خلفية متحركة ديناميكية (Tech Matrix & Motherboard Background) ================= */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        
        {/* شبكة الدوائر الإلكترونية */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:30px_30px] opacity-70"></div>
        
        {/* خطوط اللوحة الأم المضيئة السارية (Motherboard Traces) */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <motion.path 
            d="M -50 100 L 300 100 L 450 250 L 450 600" 
            stroke="rgba(6, 182, 212, 0.4)" strokeWidth="1.5" fill="none"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 3, ease: "easeInOut" }}
          />
          <motion.path 
            d="M 1200 800 L 900 800 L 750 650 L 750 300" 
            stroke="rgba(245, 158, 11, 0.3)" strokeWidth="1.5" fill="none"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 3, ease: "easeInOut", delay: 0.5 }}
          />
        </svg>

        {/* عينات الهاردوير العائمة (Floating Hardware Artifacts) */}
        {CYBER_ELEMENTS.map((elem) => (
          <motion.div
            key={elem.id}
            style={{ left: elem.x, top: elem.y }}
            className="absolute flex flex-col items-center opacity-10 group-hover:opacity-30 transition-opacity duration-750"
            animate={{ 
              y: [0, -25, 0],
              rotate: [0, 5, -5, 0],
              filter: ['drop-shadow(0 0 0px rgba(6,182,212,0))', 'drop-shadow(0 0 15px rgba(6,182,212,0.3))', 'drop-shadow(0 0 0px rgba(6,182,212,0))']
            }}
            transition={{ 
              duration: 6 + elem.id, 
              repeat: Infinity, 
              ease: "easeInOut", 
              delay: elem.delay 
            }}
          >
            {/* أيقونات تعبيرية تكنولوجية مجسمة */}
            <span className={`${elem.size} mb-2 filter saturate-50`}>
              {elem.type === 'GPU' && '📟'}
              {elem.type === 'CPU' && '🎛️'}
              {elem.type === 'RAM' && '🎚️'}
              {elem.type === 'CHIP' && '🔮'}
            </span>
            <span className="font-mono text-[9px] tracking-widest text-cyan-400 bg-zinc-900/80 px-2 py-0.5 rounded border border-white/5 shadow-sm">
              {elem.label}
            </span>
          </motion.div>
        ))}

        {/* كتل البيانات الثنائية (Binary Data Cascades) العايمة في الأطراف */}
        <div className="absolute top-1/3 left-5 font-mono text-[10px] text-zinc-800 leading-none space-y-1 hidden xl:block">
          <div>01101001 01101110</div>
          <div>01110100 01100101</div>
          <div>01101100 01011011</div>
        </div>
        <div className="absolute bottom-1/3 right-5 font-mono text-[10px] text-zinc-800 leading-none space-y-1 hidden xl:block">
          <div>11001011 00110101</div>
          <div>10101110 11110001</div>
          <div>00011011 01101100</div>
        </div>

        {/* هالات النيون المركزية الناعمة جداً */}
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full filter blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full filter blur-[120px] pointer-events-none"></div>
      </div>

      {/* ================= الكارت الرئيسي المحمي والمعدل ================= */}
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto bg-zinc-900/20 backdrop-blur-xl border border-white/5 rounded-[3rem] p-8 md:p-16 text-center shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative overflow-hidden"
        >
          {/* خط ليزر علوي دقيق جداً */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>

          <div className="relative z-10">
            {/* مؤشر الحالة الفاخر */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/40 border border-white/5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]"></span>
              <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-400">Comms Link Setup</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase mb-4">
              Stay Ahead <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">of the curve.</span>
            </h2>
            
            <p className="text-zinc-400 text-sm md:text-base max-w-xl mx-auto mb-12 font-light leading-relaxed tracking-wide">
              Subscribe to establish a secure data line. Receive critical alerts regarding hardware restocks, component drops, and exclusive insider pricing modules.
            </p>

            {/* الفلتر والكبسولة النظيفة لمنع أخطاء التداخل كما في image_91d842.png */}
            <div className={`max-w-lg mx-auto p-1 rounded-full transition-all duration-500 bg-white/5 border ${isFocused ? 'border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.15)] bg-black/40' : 'border-white/10'}`}>
              <form 
                className="flex items-center" 
                onSubmit={(e) => e.preventDefault()}
              >
                <input 
                  type="email" 
                  placeholder="ENTER LOG_EMAIL_ADDRESS..." 
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="flex-1 bg-transparent border-none text-white px-5 py-3.5 outline-none placeholder:text-zinc-700 text-xs md:text-sm font-mono tracking-widest uppercase"
                  required
                />
                <button 
                  type="submit"
                  className="bg-white text-zinc-950 px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-cyan-400 hover:text-zinc-950 transition-all duration-300 flex-shrink-0 shadow-lg"
                >
                  Connect
                </button>
              </form>
            </div>

            {/* بروتوكولات الأمان */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
              <span className="flex items-center gap-2 bg-zinc-950/40 px-3 py-1.5 rounded-md border border-white/5">
                <svg className="w-3.5 h-3.5 text-cyan-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                AES-256 Protocol
              </span>
              <span className="flex items-center gap-2 bg-zinc-950/40 px-3 py-1.5 rounded-md border border-white/5">
                <svg className="w-3.5 h-3.5 text-emerald-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Anti-Spam Filtered
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
