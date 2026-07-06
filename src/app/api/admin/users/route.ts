import { fail } from '@/lib/api-response';
import { getCurrentSession } from '@/lib/auth';
import { isAdminRole } from '@/lib/roles';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getCurrentSession();

  if (!session || !isAdminRole(session.user.role)) {
    return fail('Forbidden', 403);
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      role: true,
      isBlocked: true,
      rewardPoints: true,
      vipLevel: true,
      createdAt: true,
    },
  });

  return Response.json(
    users.map((user) => ({
      ...user,
      createdAt: user.createdAt.toISOString(),
    })),
  );
}
