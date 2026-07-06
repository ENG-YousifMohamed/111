'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/products';
import { useApp } from '@/context/AppContext';

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const { addToCart, toggleWishlist } = useApp();
  const inStock = (product.stock ?? 0) > 0;

  return (
    <Link href={`/product/${product.id}`} className="group block h-full">
      <article className="flex h-full flex-col rounded-2xl border border-white/5 bg-zinc-900/35 p-4 transition hover:border-cyan-500/35 hover:bg-zinc-900/70">
        <div className="relative mb-4 aspect-square overflow-hidden rounded-xl bg-zinc-950">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes={compact ? '180px' : '(max-width: 768px) 100vw, 25vw'}
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          {Boolean(product.discount) && (
            <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white">
              -{product.discount}%
            </span>
          )}
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              toggleWishlist(product);
            }}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-red-500"
            aria-label={`Save ${product.title}`}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="truncate text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">
            {product.brand ?? product.category}
          </span>
          <span className={`text-[10px] font-bold ${inStock ? 'text-emerald-400' : 'text-red-400'}`}>
            {inStock ? 'In Stock' : 'Out'}
          </span>
        </div>

        <h3 className="line-clamp-2 min-h-[2.75rem] text-sm font-bold text-zinc-100 transition group-hover:text-white">
          {product.title}
        </h3>

        {!compact && (
          <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-zinc-500">
            {product.description ?? product.specs}
          </p>
        )}

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            {product.comparePrice && (
              <div className="text-xs text-zinc-500 line-through">{product.comparePrice}</div>
            )}
            <div className="text-lg font-black text-white">{product.price}</div>
          </div>
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              if (inStock) addToCart(product);
            }}
            disabled={!inStock}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-zinc-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={`Add ${product.title} to cart`}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.7" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
      </article>
    </Link>
  );
}
