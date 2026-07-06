'use client';
import { motion } from 'framer-motion';

export default function BentoFeatures() {
  return (
    <section className="py-32 bg-zinc-950" dir="ltr">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-widest mb-4">Why <span className="text-cyan-500">Alpha?</span></h2>
          <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">Built for the uncompromising tech enthusiast</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          
          {/* Box 1 */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="md:col-span-2 bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/5 rounded-[2rem] p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/20 transition-colors"></div>
            <div className="relative z-10 h-full flex flex-col justify-end">
              <h3 className="text-3xl font-black text-white uppercase tracking-widest mb-2">Military-Grade Security</h3>
              <p className="text-zinc-400 max-w-md">Your transactions are secured with AES-256 encryption. We take your data protection as seriously as you take your hardware.</p>
            </div>
          </motion.div>

          {/* Box 2 */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-zinc-900/50 border border-white/5 rounded-[2rem] p-10 flex flex-col justify-center text-center hover:bg-zinc-900/80 transition-colors">
            <span className="text-5xl mb-6">⚡</span>
            <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-2">Warp Speed Delivery</h3>
            <p className="text-zinc-500 text-sm">Next-day shipping on all flagship devices.</p>
          </motion.div>

          {/* Box 3 */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-zinc-900/50 border border-white/5 rounded-[2rem] p-10 flex flex-col justify-center text-center hover:bg-zinc-900/80 transition-colors">
            <span className="text-5xl mb-6">🛡️</span>
            <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-2">Ironclad Warranty</h3>
            <p className="text-zinc-500 text-sm">2-year premium replacement guarantee.</p>
          </motion.div>

          {/* Box 4 */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="md:col-span-2 bg-gradient-to-bl from-zinc-900 to-black border border-white/5 rounded-[2rem] p-10 relative overflow-hidden group">
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 group-hover:bg-cyan-500/20 transition-colors"></div>
            <div className="relative z-10 h-full flex flex-col justify-end">
              <h3 className="text-3xl font-black text-white uppercase tracking-widest mb-2">24/7 Engineer Support</h3>
              <p className="text-zinc-400 max-w-md">Talk to real PC builders and tech experts, not bots. We are online and ready to help you configure your ultimate setup.</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}