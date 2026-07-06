import { getCurrentSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getCurrentSession();

  if (!session) {
    return Response.json({ unread: 0, notifications: [] });
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  return Response.json({
    unread: notifications.filter((notification) => !notification.isRead).length,
    notifications: notifications.map((notification) => ({
      id: notification.id,
      type: notification.type,
      title: notification.title,
      body: notification.body,
      href: notification.href,
      isRead: notification.isRead,
      createdAt: notification.createdAt.toISOString(),
    })),
  });
}
