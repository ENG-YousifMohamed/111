import 'server-only';
import { prisma } from '@/lib/prisma';
import { toStoreProduct } from '@/lib/product-data';
import type { ProductFilters } from '@/types/commerce';

export async function getCatalogFilters() {
  const [categories, brands, products] = await Promise.all([
    prisma.category.findMany({ orderBy: [{ order: 'asc' }, { name: 'asc' }] }),
    prisma.brand.findMany({ orderBy: { name: 'asc' } }),
    prisma.product.findMany({ select: { category: true, brand: true, colors: true, sizes: true } }),
  ]);

  return {
    categories:
      categories.length > 0
        ? categories.map((category) => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
            icon: category.icon,
            image: category.image,
          }))
        : Array.from(new Set(products.map((product) => product.category).filter(Boolean))).map(
            (category) => ({
              id: String(category),
              name: String(category),
              slug: String(category).toLowerCase().replace(/\s+/g, '-'),
              icon: null,
              image: null,
            }),
          ),
    brands:
      brands.length > 0
        ? brands.map((brand) => ({
            id: brand.id,
            name: brand.name,
            slug: brand.slug,
            logo: brand.logo,
          }))
        : Array.from(new Set(products.map((product) => product.brand).filter(Boolean))).map(
            (brand) => ({
              id: String(brand),
              name: String(brand),
              slug: String(brand).toLowerCase().replace(/\s+/g, '-'),
              logo: null,
            }),
          ),
    colors: Array.from(new Set(products.flatMap((product) => product.colors))),
    sizes: Array.from(new Set(products.flatMap((product) => product.sizes))),
  };
}

export async function getFilteredProducts(filters: ProductFilters) {
  const products = await prisma.product.findMany({
    orderBy: [{ createdAt: 'desc' }],
  });

  const query = filters.query?.toLowerCase().trim();
  let result = products.map(toStoreProduct);

  if (query) {
    result = result.filter((product) =>
      [product.title, product.category, product.brand, product.description, product.sku]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(query)),
    );
  }

  if (filters.category) {
    result = result.filter(
      (product) => product.category.toLowerCase() === filters.category?.toLowerCase(),
    );
  }

  if (filters.brand) {
    result = result.filter((product) => product.brand?.toLowerCase() === filters.brand?.toLowerCase());
  }

  if (filters.minPrice !== undefined) {
    result = result.filter((product) => (product.rawPrice ?? 0) >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    result = result.filter((product) => (product.rawPrice ?? 0) <= filters.maxPrice!);
  }

  if (filters.rating !== undefined) {
    result = result.filter((product) => (product.rating ?? 0) >= filters.rating!);
  }

  if (filters.color) {
    result = result.filter((product) => product.colors?.includes(filters.color!));
  }

  if (filters.size) {
    result = result.filter((product) => product.sizes?.includes(filters.size!));
  }

  if (filters.availability === 'in-stock') {
    result = result.filter((product) => (product.stock ?? 0) > 0);
  }

  if (filters.availability === 'out-of-stock') {
    result = result.filter((product) => (product.stock ?? 0) === 0);
  }

  if (filters.discount) {
    result = result.filter((product) => (product.discount ?? 0) > 0 || Boolean(product.comparePrice));
  }

  if (filters.sort === 'price-asc') {
    result = [...result].sort((a, b) => (a.rawPrice ?? 0) - (b.rawPrice ?? 0));
  } else if (filters.sort === 'price-desc') {
    result = [...result].sort((a, b) => (b.rawPrice ?? 0) - (a.rawPrice ?? 0));
  } else if (filters.sort === 'rating') {
    result = [...result].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  }

  return result;
}
