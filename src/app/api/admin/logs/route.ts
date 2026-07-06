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

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return Response.json(
    logs.map((log) => ({
      id: log.id,
      actorId: log.actorId,
      action: log.action,
      entity: log.entity,
      entityId: log.entityId,
      metadata: log.metadata,
      createdAt: log.createdAt.toISOString(),
    })),
  );
}
