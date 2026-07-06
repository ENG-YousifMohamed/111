'use client';

import { useMemo, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { useStoreProducts } from '@/hooks/useStoreProducts';

const PAGE_SIZE = 12;

export default function AllProductsPage() {
  const { products, isLoading, error } = useStoreProducts();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [availability, setAvailability] = useState('all');
  const [sort, setSort] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [discountOnly, setDiscountOnly] = useState(false);
  const [page, setPage] = useState(1);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(products.map((product) => product.category).filter(Boolean)))],
    [products],
  );

  const brands = useMemo(
    () => [
      'All',
      ...Array.from(
        new Set(products.map((product) => product.brand).filter((brand): brand is string => Boolean(brand))),
      ),
    ],
    [products],
  );

  const suggestions = useMemo(() => {
    const term = query.toLowerCase().trim();
    if (!term) return [];

    return products
      .filter((product) => product.title.toLowerCase().includes(term))
      .slice(0, 5);
  }, [products, query]);

  const filteredProducts = useMemo(() => {
    const term = query.toLowerCase().trim();
    const min = minPrice ? Number(minPrice) : undefined;
    const max = maxPrice ? Number(maxPrice) : undefined;

    let result = products.filter((product) => {
      const price = product.rawPrice ?? 0;
      const matchesQuery =
        !term ||
        [product.title, product.category, product.brand, product.description, product.sku]
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(term));
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesBrand = selectedBrand === 'All' || product.brand === selectedBrand;
      const matchesAvailability =
        availability === 'all' ||
        (availability === 'in-stock' && (product.stock ?? 0) > 0) ||
        (availability === 'out-of-stock' && (product.stock ?? 0) === 0);
      const matchesPrice =
        (min === undefined || price >= min) && (max === undefined || price <= max);
      const matchesRating = (product.rating ?? 0) >= minRating;
      const matchesDiscount = !discountOnly || (product.discount ?? 0) > 0 || Boolean(product.comparePrice);

      return (
        matchesQuery &&
        matchesCategory &&
        matchesBrand &&
        matchesAvailability &&
        matchesPrice &&
        matchesRating &&
        matchesDiscount
      );
    });

    if (sort === 'price-asc') {
      result = [...result].sort((a, b) => (a.rawPrice ?? 0) - (b.rawPrice ?? 0));
    } else if (sort === 'price-desc') {
      result = [...result].sort((a, b) => (b.rawPrice ?? 0) - (a.rawPrice ?? 0));
    } else if (sort === 'rating') {
      result = [...result].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    } else if (sort === 'best-selling') {
      result = [...result].sort((a, b) => Number(Boolean(b.discount)) - Number(Boolean(a.discount)));
    }

    return result;
  }, [
    availability,
    discountOnly,
    maxPrice,
    minPrice,
    minRating,
    products,
    query,
    selectedBrand,
    selectedCategory,
    sort,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const visibleProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function resetPage(action: () => void) {
    action();
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans">
      <Navbar />
      <div className="h-32 flex-shrink-0" />

      <main className="flex-1 container mx-auto px-6 pb-24">
        <header className="mb-10">
          <div className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">
            Live Search // Advanced Filters
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8">
            Product Database
          </h1>

          <div className="relative">
            <input
              value={query}
              onChange={(event) => resetPage(() => setQuery(event.target.value))}
              placeholder="Search by product, SKU, brand, category..."
              className="w-full rounded-2xl border border-white/10 bg-zinc-900/60 px-5 py-4 text-white outline-none transition focus:border-cyan-400"
            />
            {suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-40 mt-2 rounded-2xl border border-white/10 bg-zinc-950 p-2 shadow-2xl">
                {suggestions.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => resetPage(() => setQuery(product.title))}
                    className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
                  >
                    <span>{product.title}</span>
                    <span className="text-xs text-cyan-400">{product.price}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="h-max rounded-2xl border border-white/10 bg-zinc-900/35 p-5">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-widest">Filters</h2>
              <button
                onClick={() => {
                  setQuery('');
                  setSelectedCategory('All');
                  setSelectedBrand('All');
                  setAvailability('all');
                  setSort('newest');
                  setMinPrice('');
                  setMaxPrice('');
                  setMinRating(0);
                  setDiscountOnly(false);
                  setPage(1);
                }}
                className="text-xs font-bold text-zinc-500 hover:text-cyan-400"
              >
                Reset
              </button>
            </div>

            <FilterSelect label="Category" value={selectedCategory} values={categories} onChange={(value) => resetPage(() => setSelectedCategory(value))} />
            <FilterSelect label="Brand" value={selectedBrand} values={brands} onChange={(value) => resetPage(() => setSelectedBrand(value))} />
            <FilterSelect label="Availability" value={availability} values={['all', 'in-stock', 'out-of-stock']} onChange={(value) => resetPage(() => setAvailability(value))} />
            <FilterSelect label="Sort" value={sort} values={['newest', 'price-asc', 'price-desc', 'rating', 'best-selling']} onChange={(value) => resetPage(() => setSort(value))} />

            <div className="mb-5">
              <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500">Price</label>
              <div className="grid grid-cols-2 gap-2">
                <input value={minPrice} onChange={(event) => resetPage(() => setMinPrice(event.target.value))} inputMode="decimal" placeholder="Min" className="rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-cyan-400" />
                <input value={maxPrice} onChange={(event) => resetPage(() => setMaxPrice(event.target.value))} inputMode="decimal" placeholder="Max" className="rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-cyan-400" />
              </div>
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500">Rating</label>
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={minRating}
                onChange={(event) => resetPage(() => setMinRating(Number(event.target.value)))}
                className="w-full accent-cyan-400"
              />
              <div className="text-xs text-zinc-500">{minRating}+ stars</div>
            </div>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-zinc-950 px-3 py-3 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={discountOnly}
                onChange={(event) => resetPage(() => setDiscountOnly(event.target.checked))}
                className="accent-cyan-400"
              />
              Discount only
            </label>
          </aside>

          <section>
            <div className="mb-5 flex items-center justify-between gap-4 text-sm text-zinc-500">
              <span>{filteredProducts.length} products found</span>
              <span>Page {page} / {totalPages}</span>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-80 animate-pulse rounded-2xl border border-white/5 bg-zinc-900/40" />
                ))}
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-500/20 bg-red-950/10 p-10 text-center text-red-300">
                {error}
              </div>
            ) : visibleProducts.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-zinc-900/35 p-10 text-center text-zinc-500">
                No products match the selected filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {visibleProducts.map((product) => (
                  <ProductCard product={product} key={product.id} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-3">
                <button onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page === 1} className="rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-zinc-300 disabled:opacity-30">
                  Previous
                </button>
                <button onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={page === totalPages} className="rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-zinc-300 disabled:opacity-30">
                  Next
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function FilterSelect({
  label,
  value,
  values,
  onChange,
}: {
  label: string;
  value: string;
  values: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="mb-5 block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-3 text-sm text-white outline-none focus:border-cyan-400"
      >
        {values.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </label>
  );
}
