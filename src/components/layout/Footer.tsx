'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 pt-20 pb-10 text-zinc-400 font-sans" dir="ltr">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* العلامة التجارية */}
          <div>
            <h3 className="text-2xl font-black text-white tracking-widest uppercase mb-6 flex items-center gap-2">
              Alpha<span className="text-cyan-500">.</span>
            </h3>
            <p className="text-sm leading-relaxed mb-6 font-light">
              Engineered for the future. We provide high-performance hardware, cutting-edge peripherals, and next-gen electronics for those who demand the absolute best.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center hover:bg-cyan-500 hover:text-black transition-colors cursor-pointer">
                <span className="font-bold text-xs">X</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center hover:bg-cyan-500 hover:text-black transition-colors cursor-pointer">
                <span className="font-bold text-xs">IG</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center hover:bg-cyan-500 hover:text-black transition-colors cursor-pointer">
                <span className="font-bold text-xs">YT</span>
              </div>
            </div>
          </div>

          {/* روابط الهاردوير */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6 border-b border-white/10 pb-2 inline-block">Hardware</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/products" className="hover:text-cyan-400 transition-colors flex items-center gap-2"><span className="text-cyan-500 opacity-0 hover:opacity-100">&rarr;</span> Pre-built Systems</Link></li>
              <li><Link href="/category/laptop" className="hover:text-cyan-400 transition-colors flex items-center gap-2"><span className="text-cyan-500 opacity-0 hover:opacity-100">&rarr;</span> Laptops & Workstations</Link></li>
              <li><Link href="/category/mobile" className="hover:text-cyan-400 transition-colors flex items-center gap-2"><span className="text-cyan-500 opacity-0 hover:opacity-100">&rarr;</span> PC Components</Link></li>
              <li><Link href="/category/gaming" className="hover:text-cyan-400 transition-colors flex items-center gap-2"><span className="text-cyan-500 opacity-0 hover:opacity-100">&rarr;</span> Gaming Peripherals</Link></li>
            </ul>
          </div>

          {/* الدعم الفني */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6 border-b border-white/10 pb-2 inline-block">Support</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/products" className="hover:text-cyan-400 transition-colors">Drivers & Manuals</Link></li>
              <li><Link href="/checkout/success" className="hover:text-cyan-400 transition-colors">Warranty Info</Link></li>
              <li><Link href="/cart" className="hover:text-cyan-400 transition-colors">Track Shipment</Link></li>
              <li><Link href="/checkout" className="hover:text-cyan-400 transition-colors">Contact Engineers</Link></li>
            </ul>
          </div>

          {/* حالة السيرفرات والموقع */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6 border-b border-white/10 pb-2 inline-block">System Status</h4>
            <div className="bg-zinc-900/50 border border-white/5 p-5 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-sm text-white font-bold uppercase tracking-wider">All Systems Online</span>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-zinc-500 font-mono">SERVER: CAIRO_EG (NODE-01)</p>
                <p className="text-xs text-zinc-500 font-mono">LATENCY: 12ms</p>
                <p className="text-xs text-zinc-500 font-mono">SECURE: AES-256 ENCRYPTED</p>
              </div>
            </div>
          </div>
        </div>

        {/* الشريط السفلي */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-mono uppercase tracking-widest text-zinc-600">
          <p>&copy; 2026 Alpha ELECTRONICS. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6">
            <Link href="/products" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link>
            <Link href="/cart" className="hover:text-cyan-400 transition-colors">Terms of Service</Link>
            <Link href="/dashboard" className="hover:text-cyan-400 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
