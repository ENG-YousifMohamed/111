import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <div className="h-32" />
      <main className="container mx-auto max-w-4xl px-6 pb-24">
        <h1 className="mb-6 text-4xl font-black uppercase tracking-tight md:text-6xl">Contact</h1>
        <form className="space-y-4 rounded-2xl border border-white/10 bg-zinc-900/35 p-8">
          <input placeholder="Name" className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 outline-none focus:border-cyan-400" />
          <input placeholder="Phone or email" className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 outline-none focus:border-cyan-400" />
          <textarea placeholder="Message" rows={5} className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 outline-none focus:border-cyan-400" />
          <button type="button" className="rounded-xl bg-white px-6 py-3 text-sm font-black uppercase tracking-widest text-zinc-950 hover:bg-cyan-400">Send</button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
