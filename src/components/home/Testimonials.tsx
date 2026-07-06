'use client';
import { motion } from 'framer-motion';

const REVIEWS = [
  { name: "Alex Chen", role: "Tech YouTuber", text: "The shipping speed is insane. Got my workstation order perfectly packaged. This is the only place I buy my studio gear now.", rating: 5 },
  { name: "Sarah 'Viper' Jones", role: "Esports Pro", text: "Picked up my custom rig and 240Hz monitor from them. Zero latency, perfect condition. Absolutely essential for competitive gaming.", rating: 5 },
  { name: "David Miller", role: "Software Engineer", text: "Their hardware selection is unmatched. Found parts for my server build that were out of stock literally everywhere else.", rating: 5 },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-zinc-950 border-t border-white/5" dir="ltr">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-widest mb-4">Community <span className="text-cyan-500">Feedback</span></h2>
          <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">Verified Tech Enthusiasts</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((review, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }} key={i}
              className="bg-zinc-900/30 border border-white/5 p-8 rounded-3xl hover:bg-zinc-900/60 hover:border-cyan-500/30 transition-all group"
            >
              <div className="flex text-cyan-400 mb-6">
                {[...Array(review.rating)].map((_, j) => (
                  <svg key={j} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <p className="text-zinc-300 leading-relaxed mb-8 font-light">&ldquo;{review.text}&rdquo;</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-white border border-white/10 group-hover:border-cyan-500 transition-colors">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">{review.name}</h4>
                  <p className="text-cyan-500/80 text-xs font-mono uppercase tracking-wider">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
