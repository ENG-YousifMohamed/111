import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const [products, posts] = await Promise.all([
    prisma.product.findMany({ select: { id: true, updatedAt: true } }),
    prisma.blog.findMany({ where: { publishedAt: { not: null } }, select: { slug: true, updatedAt: true } }),
  ]);

  return [
    '',
    '/products',
    '/cart',
    '/wishlist',
    '/checkout',
    '/blog',
    '/about',
    '/privacy',
    '/terms',
    '/contact',
    ...products.map((product) => `/product/${product.id}`),
    ...posts.map((post) => `/blog/${post.slug}`),
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified:
      path.startsWith('/product/')
        ? products.find((product) => path.endsWith(product.id))?.updatedAt ?? new Date()
        : path.startsWith('/blog/')
          ? posts.find((post) => path.endsWith(post.slug))?.updatedAt ?? new Date()
          : new Date(),
  }));
}
