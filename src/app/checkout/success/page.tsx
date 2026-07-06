import Link from 'next/link';

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;
  const orderId = order ?? 'ORDER_CONFIRMED';

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans">
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-xl w-full text-center border border-cyan-500/20 bg-zinc-950 rounded-[2rem] p-10 shadow-[0_0_40px_rgba(6,182,212,0.15)]">
          <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-cyan-500 text-black flex items-center justify-center font-black text-3xl">
            ✓
          </div>
          <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-[0.3em] mb-3">
            TRANSACTION_COMPLETE
          </p>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">
            Order Secured
          </h1>
          <p className="text-zinc-400 font-mono text-sm mb-8">
            Reference: <span className="text-white">{orderId}</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-cyan-400 transition-all">
              Back Home
            </Link>
            <Link href="/dashboard" className="px-8 py-4 bg-zinc-900 border border-white/10 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:border-cyan-500 transition-all">
              Open Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
