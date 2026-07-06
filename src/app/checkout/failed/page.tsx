'use client';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function FailedPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center z-10 mt-20">
        <div className="w-32 h-32 rounded-full border border-red-500/30 bg-red-500/10 flex items-center justify-center mb-8 shadow-[0_0_100px_rgba(239,68,68,0.2)]">
          <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">
          Transaction <span className="text-red-500">Failed</span>
        </h1>
        <p className="text-zinc-400 font-mono text-lg mb-2">The payment gateway rejected the transfer. No funds were deducted.</p>
        <p className="text-zinc-600 font-mono text-sm mb-12">ERROR_CODE: <span className="text-white">AUTH_DECLINED_0x99</span></p>

        <div className="flex gap-4">
          <Link href="/checkout" className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-red-500 transition-all">
            Retry Payment
          </Link>
          <Link href="/cart" className="px-8 py-4 bg-zinc-900 border border-white/10 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:border-red-500 transition-all">
            Return to Cart
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}