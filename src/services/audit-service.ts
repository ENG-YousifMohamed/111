import 'server-only';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export async function writeAuditLog({
  actorId,
  action,
  entity,
  entityId,
  metadata,
}: {
  actorId?: string;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Prisma.InputJsonObject;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        actorId,
        action,
        entity,
        entityId,
        metadata,
      },
    });
  } catch (error) {
    console.error('Could not write audit log:', error);
  }
}
