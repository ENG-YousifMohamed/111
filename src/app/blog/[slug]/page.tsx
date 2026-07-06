import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.blog.findUnique({ where: { slug } });

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <div className="h-32" />
      <main className="container mx-auto max-w-4xl px-6 pb-24">
        {!post ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-900/35 p-10 text-center text-zinc-500">
            Article not found.
          </div>
        ) : (
          <article className="rounded-2xl border border-white/10 bg-zinc-900/35 p-8">
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">{post.category ?? 'Article'}</p>
            <h1 className="mb-6 text-4xl font-black uppercase tracking-tight md:text-6xl">{post.title}</h1>
            <p className="mb-8 text-lg leading-relaxed text-zinc-400">{post.excerpt}</p>
            <div className="whitespace-pre-wrap leading-8 text-zinc-300">{post.content}</div>
          </article>
        )}
      </main>
      <Footer />
    </div>
  );
}
