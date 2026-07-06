import 'server-only';
import { prisma } from '@/lib/prisma';
import { getCurrentSession } from '@/lib/auth';
import type { AccountDashboard } from '@/types/commerce';

function decimalToString(value: unknown) {
  if (value && typeof value === 'object' && 'toString' in value) {
    return value.toString();
  }
  return String(value ?? '0');
}

export async function getAccountDashboard(): Promise<AccountDashboard | null> {
  const session = await getCurrentSession();
  if (!session) return null;

  const [user, orders, addresses, notifications] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id } }),
    prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    }),
    prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ]);

  if (!user) return null;

  return {
    profile: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      rewardPoints: user.rewardPoints,
      walletBalance: decimalToString(user.walletBalance),
      vipLevel: user.vipLevel,
    },
    orders: orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      total: order.total,
      createdAt: order.createdAt.toISOString(),
    })),
    addresses: addresses.map((address) => ({
      id: address.id,
      label: address.label,
      city: address.city,
      line1: address.line1,
      isDefault: address.isDefault,
    })),
    notifications: notifications.map((notification) => ({
      id: notification.id,
      title: notification.title,
      body: notification.body,
      type: notification.type,
      isRead: notification.isRead,
      createdAt: notification.createdAt.toISOString(),
    })),
  };
}
