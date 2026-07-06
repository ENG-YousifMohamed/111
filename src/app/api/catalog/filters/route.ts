import { getCatalogFilters } from '@/services/catalog-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  const filters = await getCatalogFilters();
  return Response.json(filters);
}
