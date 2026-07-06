'use client';

import Link from 'next/link';
import { ProductCard } from '@/components/product/ProductCard';
import { useStoreProducts } from '@/hooks/useStoreProducts';

const FAQ_ITEMS = [
  {
    question: 'How do I track my order?',
    answer: 'After checkout, orders appear in your account dashboard with status and tracking fields.',
  },
  {
    question: 'Can I pay cash on delivery?',
    answer: 'Yes. Cash on Delivery is available from the checkout payment method step.',
  },
  {
    question: 'How are admin accounts protected?',
    answer: 'Only Admin and Super Admin roles can open the dashboard or admin APIs.',
  },
  {
    question: 'Are products loaded from the database?',
    answer: 'Yes. Storefront products, search, deals, and dashboard inventory use the database catalog.',
  },
];

export default function CommerceSections() {
  const { products, isLoading } = useStoreProducts();
  const inStockProducts = products.filter((product) => (product.stock ?? 0) > 0);
  const bestSellers = [...inStockProducts]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 4);
  const deals = products
    .filter((product) => (product.discount ?? 0) > 0 || Boolean(product.comparePrice))
    .slice(0, 4);
  const trending = products.slice(0, 4);
  const brands = Array.from(new Set(products.map((product) => product.brand).filter(Boolean))).slice(0, 8);

  return (
    <>
      <ProductRail title="Best Sellers" subtitle="Highest rated database products" products={bestSellers} isLoading={isLoading} />
      <ProductRail title="Today's Deals" subtitle="Discounts and limited stock offers" products={deals.length > 0 ? deals : trending} isLoading={isLoading} />
      <ProductRail title="Trending Products" subtitle="Recently added catalog items" products={trending} isLoading={isLoading} />

      <section className="bg-zinc-950 py-20 text-white" dir="ltr">
        <div className="container mx-auto px-6">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Brands</p>
              <h2 className="text-3xl font-black uppercase tracking-tight md:text-5xl">Brand Management Ready</h2>
            </div>
            <Link href="/products" className="hidden rounded-full border border-white/10 px-5 py-3 text-xs font-black uppercase tracking-widest text-zinc-300 hover:border-cyan-400 hover:text-white md:block">
              Browse All
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {(brands.length > 0 ? brands : ['Alpha Store', 'Database Brands', 'Admin Managed', 'SEO Ready']).map((brand) => (
              <div key={brand} className="rounded-2xl border border-white/10 bg-zinc-900/35 p-5 text-center text-sm font-black uppercase tracking-widest text-zinc-300">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-zinc-950 py-20 text-white" dir="ltr">
        <div className="container mx-auto grid grid-cols-1 gap-8 px-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-zinc-900/35 p-8">
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Newsletter</p>
            <h2 className="mb-4 text-3xl font-black uppercase tracking-tight">Offers, drops, and product alerts</h2>
            <form onSubmit={(event) => event.preventDefault()} className="flex flex-col gap-3 sm:flex-row">
              <input type="email" required placeholder="email@example.com" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 outline-none focus:border-cyan-400" />
              <button className="rounded-xl bg-white px-6 py-3 text-sm font-black uppercase tracking-widest text-zinc-950 hover:bg-cyan-400">
                Subscribe
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-900/35 p-8">
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">FAQ</p>
            <div className="space-y-3">
              {FAQ_ITEMS.map((item) => (
                <details key={item.question} className="rounded-xl border border-white/10 bg-zinc-950/70 p-4">
                  <summary className="cursor-pointer text-sm font-bold text-white">{item.question}</summary>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ProductRail({
  title,
  subtitle,
  products,
  isLoading,
}: {
  title: string;
  subtitle: string;
  products: ReturnType<typeof useStoreProducts>['products'];
  isLoading: boolean;
}) {
  return (
    <section className="bg-zinc-950 py-20 text-white" dir="ltr">
      <div className="container mx-auto px-6">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">{subtitle}</p>
            <h2 className="text-3xl font-black uppercase tracking-tight md:text-5xl">{title}</h2>
          </div>
          <Link href="/products" className="hidden rounded-full border border-white/10 px-5 py-3 text-xs font-black uppercase tracking-widest text-zinc-300 hover:border-cyan-400 hover:text-white md:block">
            View All
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-72 animate-pulse rounded-2xl border border-white/5 bg-zinc-900/40" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-900/35 p-10 text-center text-zinc-500">
            Add products from the dashboard to fill this section.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard product={product} key={product.id} compact />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
