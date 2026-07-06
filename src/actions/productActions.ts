'use server';

import { revalidatePath } from 'next/cache';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAdminForMutation } from '@/lib/auth';
import { writeAuditLog } from '@/services/audit-service';

type DatabaseProduct = Prisma.ProductGetPayload<object>;

export type DashboardProduct = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  stock: number;
  category: string | null;
  images: string[];
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

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

function productSku(product: Pick<DatabaseProduct, 'id' | 'slug'>) {
  const catalogId = product.slug.match(/product-(\d+)/)?.[1];
  return catalogId
    ? `ALP-${catalogId.padStart(3, '0')}`
    : `ALP-${product.id.slice(0, 8).toUpperCase()}`;
}

function toDashboardProduct(product: DatabaseProduct): DashboardProduct {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: productSku(product),
    price: toNumber(product.price),
    stock: product.stock ?? 0,
    category: product.category,
    images: product.images,
  };
}

export async function getProducts(): Promise<DashboardProduct[]> {
  try {
    await requireAdminForMutation();

    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return products.map(toDashboardProduct);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function deleteProduct(id: string) {
  try {
    const admin = await requireAdminForMutation();

    await prisma.product.delete({
      where: { id },
    });

    await writeAuditLog({
      actorId: admin.id,
      action: 'product.delete',
      entity: 'Product',
      entityId: id,
    });

    revalidatePath('/dashboard');
    revalidatePath('/products');

    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { success: false, error: 'Could not delete product' };
  }
}

export async function updateProductStock(id: string, stock: number) {
  try {
    const admin = await requireAdminForMutation();

    if (!Number.isFinite(stock) || stock < 0) {
      return { success: false, error: 'Invalid stock value' };
    }

    await prisma.product.update({
      where: { id },
      data: { stock: Math.floor(stock) },
    });

    await writeAuditLog({
      actorId: admin.id,
      action: 'product.stock.update',
      entity: 'Product',
      entityId: id,
      metadata: { stock: Math.floor(stock) },
    });

    revalidatePath('/dashboard');
    revalidatePath('/products');

    return { success: true };
  } catch (error) {
    console.error('Error updating product stock:', error);
    return { success: false, error: 'Could not update stock' };
  }
}

export async function createProduct(formData: FormData) {
  try {
    const admin = await requireAdminForMutation();

    const name = String(formData.get('name') ?? '').trim();
    const price = Number(formData.get('price'));
    const stock = Number(formData.get('stock'));
    const description = String(formData.get('description') ?? '').trim() || 'No description';
    const categoryName = String(formData.get('category') ?? 'General').trim() || 'General';

    if (!name || !Number.isFinite(price) || !Number.isFinite(stock)) {
      return { success: false, error: 'Invalid product data' };
    }

    const categorySlug = slugify(categoryName);
    await prisma.category.upsert({
      where: { slug: categorySlug },
      update: { name: categoryName },
      create: {
        id: `cat_${categorySlug}`,
        name: categoryName,
        slug: categorySlug,
        description: `${categoryName} products`,
      },
    });

    const slug = `${slugify(name)}-${Date.now()}`;

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        sku: `ALP-${Date.now().toString(36).toUpperCase()}`,
        price,
        stock: Math.floor(stock),
        description,
        category: categoryName,
        images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&auto=format&fit=crop&q=60'],
      },
    });

    await writeAuditLog({
      actorId: admin.id,
      action: 'product.create',
      entity: 'Product',
      entityId: product.id,
      metadata: { name, category: categoryName, stock: Math.floor(stock), price },
    });

    revalidatePath('/dashboard');
    revalidatePath('/products');

    return { success: true };
  } catch (error) {
    console.error('Error creating product:', error);
    return { success: false, error: 'Could not create product' };
  }
}
