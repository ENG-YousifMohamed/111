import { fail } from '@/lib/api-response';
import { getAccountDashboard } from '@/services/account-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  const account = await getAccountDashboard();

  if (!account) {
    return fail('Unauthorized', 401);
  }

  return Response.json(account);
}
