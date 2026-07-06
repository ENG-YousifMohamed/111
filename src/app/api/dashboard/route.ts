import { getCurrentSession } from '@/lib/auth';
import { getDashboardData } from '@/lib/store-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getCurrentSession();

  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.role !== 'ADMIN') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const dashboard = await getDashboardData();
  return Response.json(dashboard);
}
