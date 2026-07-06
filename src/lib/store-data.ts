import 'server-only';
import type { Prisma } from '@prisma/client';
import type { DashboardData } from '@/lib/dashboard-types';
import type { Product } from '@/lib/products';
import { prisma } from '@/lib/prisma';

export type OrderCartItem = {
  product: Product;
  quantity: number;
};

type DatabaseProduct = Prisma.ProductGetPayload<object>;

export function parseProductPrice(price: string) {
  const parsed = Number.parseFloat(price.replace(/[^0-9.-]+/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function productSku(product: Pick<DatabaseProduct, 'id' | 'slug'>) {
  const catalogId = product.slug.match(/product-(\d+)/)?.[1];
  return catalogId
    ? `ALP-${catalogId.padStart(3, '0')}`
    : `ALP-${product.id.slice(0, 8).toUpperCase()}`;
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

function stockStatus(stock: number): 'in-stock' | 'low-stock' | 'out-of-stock' {
  if (stock === 0) return 'out-of-stock';
  return stock <= 15 ? 'low-stock' : 'in-stock';
}

export async function syncCatalogToDatabase() {
  // Products are now managed only through the database/dashboard.
}

function emptyDashboardData(): DashboardData {
  return {
    source: 'database',
    stats: {
      totalRevenue: 0,
      orderCount: 0,
      customerCount: 0,
      productCount: 0,
      lowStockCount: 0,
      outOfStockCount: 0,
      conversionRate: 0,
      averageOrder: 0,
    },
    recentOrders: [],
    topProducts: [],
    categories: [],
    admins: [],
    inventory: [],
  };
}

async function getDashboardDataFromDatabase(): Promise<DashboardData> {
  const [
    productCount,
    orderCount,
    lowStockCount,
    outOfStockCount,
    revenueAggregate,
    recentOrders,
    categoryGroups,
    inventoryProducts,
    customerGroups,
    adminUsers,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.product.count({ where: { stock: { gt: 0, lte: 15 } } }),
    prisma.product.count({ where: { stock: 0 } }),
    prisma.order.aggregate({ _sum: { total: true }, _avg: { total: true } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    }),
    prisma.product.groupBy({
      by: ['category'],
      _count: { _all: true },
    }),
    prisma.product.findMany({
      take: 6,
      orderBy: [{ stock: 'asc' }, { createdAt: 'desc' }],
    }),
    prisma.order.groupBy({ by: ['userId'] }),
    prisma.user.findMany({
      where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } },
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, phone: true, role: true, createdAt: true },
    }),
  ]);

  const orderedProductIds = Array.from(
    new Set(recentOrders.flatMap((order) => order.items.map((item) => item.productId))),
  );
  const orderedProducts = orderedProductIds.length
    ? await prisma.product.findMany({ where: { id: { in: orderedProductIds } } })
    : [];
  const productsById = new Map(orderedProducts.map((product) => [product.id, product]));
  const totalRevenue = revenueAggregate._sum.total ?? 0;
  const averageOrder = revenueAggregate._avg.total ?? 0;
  const categoryProductTotal = categoryGroups.reduce(
    (sum, category) => sum + category._count._all,
    0,
  );
  const topProductMap = new Map<
    string,
    { id: string; name: string; units: number; revenue: number; image: string; category: string }
  >();

  for (const order of recentOrders) {
    for (const item of order.items) {
      const product = productsById.get(item.productId);
      const current = topProductMap.get(item.productId) ?? {
        id: item.productId,
        name: product?.name ?? 'Unknown Product',
        units: 0,
        revenue: 0,
        image: product?.images[0] ?? '',
        category: product?.category ?? 'Uncategorized',
      };

      current.units += item.quantity;
      current.revenue += item.price * item.quantity;
      topProductMap.set(item.productId, current);
    }
  }

  const topProducts = Array.from(topProductMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 4);

  return {
    source: 'database',
    stats: {
      totalRevenue,
      orderCount,
      customerCount: customerGroups.length,
      productCount,
      lowStockCount,
      outOfStockCount,
      conversionRate: orderCount > 0 ? Math.min(12.5, 2.5 + orderCount / 10) : 0,
      averageOrder,
    },
    recentOrders: recentOrders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customer: order.userId,
      total: order.total,
      status: order.status,
    })),
    topProducts,
    categories: categoryGroups.map((category) => ({
      name: category.category ?? 'Uncategorized',
      percent:
        categoryProductTotal === 0
          ? 0
          : Math.round((category._count._all / categoryProductTotal) * 100),
    })),
    admins: adminUsers.map((user) => ({
      id: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    })),
    inventory: inventoryProducts.map((product) => {
      const stock = product.stock ?? 0;

      return {
        id: product.id,
        name: product.name,
        sku: productSku(product),
        stock,
        price: toNumber(product.price),
        status: stockStatus(stock),
      };
    }),
  };
}

function isTransientDatabaseError(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error.code === 'P1001' || error.code === 'P1002')
  );
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getDashboardData(): Promise<DashboardData> {
  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return await getDashboardDataFromDatabase();
    } catch (error) {
      lastError = error;
      if (!isTransientDatabaseError(error) || attempt === 1) {
        break;
      }
      await wait(500);
    }
  }

  console.error('Dashboard database read failed:', lastError);
  return emptyDashboardData();
}

export async function createDatabaseOrder({
  cart,
  paymentMethod,
  totals,
  shippingAddress,
}: {
  cart: OrderCartItem[];
  paymentMethod: string;
  totals: { subtotal: number; tax: number; shipping: number; total: number };
  shippingAddress: Prisma.InputJsonObject;
}) {
  if (cart.length === 0) {
    throw new Error('Cannot create an empty order');
  }

  const productIds = cart.map((item) => item.product.id);
  const existingProducts = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true },
  });
  const existingProductIds = new Set(existingProducts.map((product) => product.id));

  if (productIds.some((id) => !existingProductIds.has(id))) {
    throw new Error('One or more products are no longer available');
  }

  const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;

  return prisma.order.create({
    data: {
      orderNumber,
      userId: 'guest',
      status: paymentMethod === 'cod' ? 'PENDING' : 'PROCESSING',
      total: totals.total,
      subtotal: totals.subtotal,
      tax: totals.tax,
      shipping: totals.shipping,
      shippingAddress,
      paymentMethod,
      paidAt: paymentMethod === 'cod' ? null : new Date(),
      items: {
        create: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: parseProductPrice(item.product.price),
        })),
      },
    },
  });
}
