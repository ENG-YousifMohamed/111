import 'server-only';
import type { Prisma } from '@prisma/client';
import type { Product } from '@/lib/products';
import { prisma } from '@/lib/prisma';

type DatabaseProduct = Prisma.ProductGetPayload<object>;

function toNumber(value: unknown) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (
    value &&
    typeof value === 'object' &&
    'toNumber' in value &&
    typeof value.toNumber === 'function'
  ) {
    return value.toNumber();
  }
  return 0;
}

function formatPrice(value: unknown) {
  return toNumber(value).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
}

function toRecord(value: unknown): Record<string, string | number | boolean> | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;

  const entries = Object.entries(value as Record<string, unknown>).filter(
    (entry): entry is [string, string | number | boolean] =>
      ['string', 'number', 'boolean'].includes(typeof entry[1]),
  );

  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
}

export function toStoreProduct(product: DatabaseProduct): Product {
  const stock = product.stock ?? 0;
  const rawPrice = toNumber(product.price);
  const discount = toNumber(product.discount);

  return {
    id: product.id,
    title: product.name,
    category: product.category ?? 'Uncategorized',
    price: formatPrice(rawPrice),
    rawPrice,
    comparePrice: product.comparePrice ? formatPrice(product.comparePrice) : undefined,
    discount,
    image:
      product.images[0] ??
      'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&auto=format&fit=crop&q=60',
    images: product.images,
    videos: product.videos,
    sku: product.sku ?? `ALP-${product.id.slice(0, 8).toUpperCase()}`,
    brand: product.brand ?? undefined,
    rating: toNumber(product.rating),
    reviewsCount: product.numReviews ?? 0,
    colors: product.colors,
    sizes: product.sizes,
    tags: product.tags,
    specifications: toRecord(product.specifications),
    shippingInfo: product.shippingInfo ?? 'Standard and express delivery are available at checkout.',
    returnPolicy: product.returnPolicy ?? 'Returns are accepted within 14 days for eligible items.',
    sellerInfo: product.sellerInfo ?? 'Sold by Alpha Store.',
    specs: `${product.category ?? 'Product'} · ${stock} in stock`,
    description: product.description ?? `${product.name} is available from the store database.`,
    stock,
  };
}

export async function getStoreProducts() {
  const products = await prisma.product.findMany({
    orderBy: [{ createdAt: 'desc' }],
  });

  return products.map(toStoreProduct);
}

export async function getStoreProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  return product ? toStoreProduct(product) : null;
}
