import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const posts = await prisma.blog.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { publishedAt: 'desc' },
    take: 24,
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <div className="h-32" />
      <main className="container mx-auto max-w-6xl px-6 pb-24">
        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Blog</p>
        <h1 className="mb-10 text-4xl font-black uppercase tracking-tight md:text-6xl">Articles</h1>
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-900/35 p-10 text-center text-zinc-500">
            No published articles yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="rounded-2xl border border-white/10 bg-zinc-900/35 p-6 transition hover:border-cyan-400/40">
                <div className="mb-3 text-xs font-bold uppercase tracking-widest text-cyan-400">{post.category ?? 'Article'}</div>
                <h2 className="mb-3 text-xl font-black">{post.title}</h2>
                <p className="line-clamp-3 text-sm leading-relaxed text-zinc-400">{post.excerpt}</p>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
