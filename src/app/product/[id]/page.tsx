'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { ProductCard } from '@/components/product/ProductCard';
import { useApp } from '@/context/AppContext';
import { useStoreProducts } from '@/hooks/useStoreProducts';
import type { Product } from '@/lib/products';

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, toggleWishlist, wishlist } = useApp();
  const { products } = useStoreProducts();
  const productId = String(params?.id ?? '');
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedMedia, setSelectedMedia] = useState('');
  const [isLoading, setIsLoading] = useState(Boolean(productId));
  const [error, setError] = useState<string | null>(null);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (!productId) return;

    const controller = new AbortController();

    async function loadProduct() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/products/${encodeURIComponent(productId)}`, {
          cache: 'no-store',
          signal: controller.signal,
        });

        if (response.status === 404) {
          setProduct(null);
          setError('Product not found in the database');
          return;
        }

        if (!response.ok) {
          throw new Error('Could not load product');
        }

        const nextProduct = (await response.json()) as Product;
        setProduct(nextProduct);
        setSelectedMedia(nextProduct.image);
      } catch (loadError) {
        if (controller.signal.aborted) return;
        setProduct(null);
        setError(loadError instanceof Error ? loadError.message : 'Could not load product');
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadProduct();

    return () => controller.abort();
  }, [productId]);

  useEffect(() => {
    if (!product) return;

    const existing = JSON.parse(window.localStorage.getItem('recently_viewed') ?? '[]') as Product[];
    const next = [product, ...existing.filter((item) => item.id !== product.id)].slice(0, 8);
    window.localStorage.setItem('recently_viewed', JSON.stringify(next));
  }, [product]);

  const relatedProducts = useMemo(
    () =>
      product
        ? products
            .filter((item) => item.id !== product.id && item.category === product.category)
            .slice(0, 4)
        : [],
    [product, products],
  );

  const mediaItems = useMemo(() => {
    if (!product) return [];
    return Array.from(new Set([...(product.images ?? []), product.image]));
  }, [product]);

  const isSharedInWishlist = product
    ? wishlist.some((item) => item.id === product.id)
    : false;
  const inStock = product ? (product.stock ?? 0) > 0 : false;

  const handleAddToCart = () => {
    if (!product || !inStock) return;

    addToCart(product);
    setIsAdded(true);
    window.setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product || !inStock) return;
    addToCart(product);
    router.push('/checkout');
  };

  const handleShare = async () => {
    if (!product) return;
    const url = window.location.href;

    if (navigator.share) {
      await navigator.share({ title: product.title, text: product.description, url });
      return;
    }

    await navigator.clipboard.writeText(url);
  };

  if (isLoading) {
    return (
      <ProductShell>
        <div className="rounded-3xl border border-white/5 bg-[#0a0a0a] py-20 text-center">
          <p className="font-mono text-zinc-500">Loading database product...</p>
        </div>
      </ProductShell>
    );
  }

  if (!product) {
    return (
      <ProductShell>
        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-500 transition-colors hover:text-cyan-400"
        >
          Back to Database
        </button>
        <div className="rounded-3xl border border-white/5 bg-[#0a0a0a] py-20 text-center">
          <p className="font-mono text-zinc-500">{error ?? 'Product not found in the database.'}</p>
        </div>
      </ProductShell>
    );
  }

  return (
    <ProductShell>
      <button
        onClick={() => router.back()}
        className="mb-8 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-500 transition-colors hover:text-cyan-400"
      >
        Back to Database
      </button>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <section className="lg:col-span-6">
          <div className="relative flex h-[520px] items-center justify-center overflow-hidden rounded-[2rem] border border-white/5 bg-[#0a0a0a] p-6 shadow-2xl">
            <Image
              src={selectedMedia || product.image}
              alt={product.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-8 transition duration-700 hover:scale-110"
              priority
            />
            <span className="absolute left-6 top-6 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-zinc-400">
              Zoom Preview
            </span>
          </div>

          <div className="mt-4 grid grid-cols-5 gap-3">
            {mediaItems.map((image) => (
              <button
                key={image}
                onClick={() => setSelectedMedia(image)}
                className={`relative aspect-square overflow-hidden rounded-xl border ${
                  selectedMedia === image ? 'border-cyan-400' : 'border-white/10'
                } bg-zinc-900`}
              >
                <Image src={image} alt={product.title} fill sizes="120px" className="object-cover" />
              </button>
            ))}
            {product.videos?.map((video) => (
              <a key={video} href={video} target="_blank" className="flex aspect-square items-center justify-center rounded-xl border border-white/10 bg-zinc-900 text-xs font-black uppercase tracking-widest text-cyan-400">
                Video
              </a>
            ))}
          </div>
        </section>

        <section className="space-y-8 lg:col-span-6">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-cyan-400">
              <span>{product.brand ?? product.category}</span>
              <span className="text-zinc-700">/</span>
              <span>{product.sku}</span>
            </div>
            <h1 className="mb-4 text-4xl font-black uppercase leading-tight tracking-tighter md:text-5xl">
              {product.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-zinc-300">{product.category}</span>
              <span className={inStock ? 'text-emerald-400' : 'text-red-400'}>
                {inStock ? `${product.stock} in stock` : 'Out of stock'}
              </span>
              <span className="text-amber-300">{(product.rating ?? 0).toFixed(1)} stars</span>
              <span className="text-zinc-500">{product.reviewsCount ?? 0} reviews</span>
            </div>
          </div>

          <div className="border-y border-white/10 py-6">
            {product.comparePrice && <div className="text-lg text-zinc-500 line-through">{product.comparePrice}</div>}
            <div className="font-mono text-4xl font-black text-white">{product.price}</div>
            {Boolean(product.discount) && (
              <div className="mt-2 text-sm font-bold text-red-400">{product.discount}% discount applied</div>
            )}
          </div>

          <p className="max-w-xl text-base font-light leading-relaxed text-zinc-400">
            {product.description ?? product.specs ?? 'Premium product ready for checkout.'}
          </p>

          <OptionChips title="Color" values={product.colors ?? []} />
          <OptionChips title="Size" values={product.sizes ?? []} />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              onClick={handleAddToCart}
              disabled={!inStock || isAdded}
              className="rounded-xl bg-white px-8 py-5 text-xs font-black uppercase tracking-widest text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isAdded ? 'Added To Cart' : 'Add To Cart'}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!inStock}
              className="rounded-xl bg-cyan-500 px-8 py-5 text-xs font-black uppercase tracking-widest text-zinc-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Buy Now
            </button>
            <button
              onClick={() => toggleWishlist(product)}
              className={`rounded-xl border px-8 py-4 text-xs font-black uppercase tracking-widest transition ${
                isSharedInWishlist
                  ? 'border-red-500 bg-red-500/10 text-red-400'
                  : 'border-white/10 text-white hover:border-red-500 hover:text-red-400'
              }`}
            >
              Wishlist
            </button>
            <button
              onClick={handleShare}
              className="rounded-xl border border-white/10 px-8 py-4 text-xs font-black uppercase tracking-widest text-white transition hover:border-cyan-400 hover:text-cyan-300"
            >
              Share Product
            </button>
          </div>
        </section>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <InfoPanel title="Specifications">
          {product.specifications ? (
            <dl className="space-y-3 text-sm">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between gap-4 border-b border-white/5 pb-2">
                  <dt className="text-zinc-500">{key}</dt>
                  <dd className="text-right text-zinc-200">{String(value)}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p>{product.specs ?? 'No specifications have been added yet.'}</p>
          )}
        </InfoPanel>
        <InfoPanel title="Shipping Info">{product.shippingInfo}</InfoPanel>
        <InfoPanel title="Return Policy">{product.returnPolicy}</InfoPanel>
        <InfoPanel title="Seller Info">{product.sellerInfo}</InfoPanel>
        <InfoPanel title="Frequently Bought Together">
          {relatedProducts[0] ? `${product.title} pairs well with ${relatedProducts[0].title}.` : 'Recommendations will appear as more products are added.'}
        </InfoPanel>
        <InfoPanel title="Reviews">
          Verified purchase reviews support star ratings, photos, videos, likes, and replies through the reviews table.
        </InfoPanel>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-20">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Related Products</p>
              <h2 className="text-3xl font-black uppercase tracking-tight">More From This Category</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((item) => (
              <ProductCard product={item} key={item.id} compact />
            ))}
          </div>
        </section>
      )}
    </ProductShell>
  );
}

function ProductShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      <Navbar />
      <div className="h-32 flex-shrink-0" />
      <main className="flex-1 container mx-auto max-w-7xl px-6 pb-24">{children}</main>
      <Footer />
    </div>
  );
}

function OptionChips({ title, values }: { title: string; values: string[] }) {
  if (values.length === 0) return null;

  return (
    <div>
      <div className="mb-3 text-xs font-black uppercase tracking-widest text-zinc-500">{title}</div>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => (
          <span key={value} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-zinc-300">
            {value}
          </span>
        ))}
      </div>
    </div>
  );
}

function InfoPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-zinc-900/35 p-6 text-sm leading-relaxed text-zinc-400">
      <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-white">{title}</h3>
      {children}
    </section>
  );
}
