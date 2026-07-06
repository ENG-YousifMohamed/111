'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const articles = [
  {
    id: 1,
    title: "Deconstructing Comfort",
    category: "Design Architecture",
    date: "OCT 2026",
    img: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    title: "The Golden Era of Minimalism",
    category: "Material Study",
    date: "NOV 2026",
    img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
  }
];

export default function Journal() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // تأثير حركة بطيئة للصور (Parallax) أثناء الـ Scroll
  const y = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  return (
    <section ref={containerRef} className="py-32 bg-zinc-950 relative border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20">
          <div>
            <h2 className="text-4xl md:text-6xl font-black text-zinc-100 uppercase tracking-tighter">
              THE <span className="text-amber-500">JOURNAL</span>
            </h2>
            <p className="text-zinc-400 mt-4 text-lg">أفكار، إلهام، وما وراء كواليس التصميم التفكيكي.</p>
          </div>
          <button className="mt-6 md:mt-0 pb-1 border-b border-amber-500 text-amber-500 hover:text-amber-400 hover:border-amber-400 transition-colors uppercase tracking-widest text-sm font-bold">
            Read All Articles
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8">
          {articles.map((article, index) => (
            <div key={article.id} className={`flex flex-col ${index === 1 ? 'md:mt-32' : ''}`}>
              {/* الماوس الجديد هيشتغل هنا بسبب data-cursor="view" */}
              <div 
                data-cursor="view" 
                className="relative h-[60vh] w-full overflow-hidden rounded-3xl group "
              >
                <div className="absolute inset-0 bg-zinc-950/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                
                <motion.div style={{ y }} className="w-full h-[120%] -top-[10%] relative">
                  <img 
                    src={article.img} 
                    alt={article.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                  />
                </motion.div>
              </div>

              <div className="pt-8">
                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-amber-500 mb-3">
                  <span>{article.category}</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                  <span className="text-zinc-500">{article.date}</span>
                </div>
                <h3 className="text-3xl font-bold text-zinc-100 hover:text-amber-400 transition-colors cursor-pointer">
                  {article.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}