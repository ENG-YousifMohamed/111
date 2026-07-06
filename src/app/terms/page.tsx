import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <div className="h-32" />
      <main className="container mx-auto max-w-4xl px-6 pb-24">
        <h1 className="mb-6 text-4xl font-black uppercase tracking-tight md:text-6xl">Terms</h1>
        <p className="rounded-2xl border border-white/10 bg-zinc-900/35 p-8 leading-relaxed text-zinc-300">
          Orders, payments, refunds, shipment tracking, coupons, and loyalty rewards are governed by the store configuration and order status workflow.
        </p>
      </main>
      <Footer />
    </div>
  );
}
