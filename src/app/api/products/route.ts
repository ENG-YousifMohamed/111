import { getStoreProducts } from '@/lib/product-data';
import { parseProductFilters } from '@/validation/commerce';
import { getFilteredProducts } from '@/services/catalog-service';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);

  if (url.searchParams.size > 0) {
    const products = await getFilteredProducts(parseProductFilters(url.searchParams));
    const page = Math.max(1, Number(url.searchParams.get('page') ?? 1));
    const limit = Math.min(60, Math.max(1, Number(url.searchParams.get('limit') ?? 24)));
    const start = (page - 1) * limit;

    return Response.json({
      products: products.slice(start, start + limit),
      pagination: {
        page,
        limit,
        total: products.length,
        totalPages: Math.max(1, Math.ceil(products.length / limit)),
      },
    });
  }

  const products = await getStoreProducts();
  return Response.json(products);
}
