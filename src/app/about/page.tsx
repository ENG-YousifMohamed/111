import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function AboutPage() {
  return <CmsPage title="About" text="Alpha Store is a database-driven commerce platform with customer accounts, admin management, catalog controls, and scalable storefront modules." />;
}

function CmsPage({ title, text }: { title: string; text: string }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <div className="h-32" />
      <main className="container mx-auto max-w-4xl px-6 pb-24">
        <h1 className="mb-6 text-4xl font-black uppercase tracking-tight md:text-6xl">{title}</h1>
        <p className="rounded-2xl border border-white/10 bg-zinc-900/35 p-8 leading-relaxed text-zinc-300">{text}</p>
      </main>
      <Footer />
    </div>
  );
}
