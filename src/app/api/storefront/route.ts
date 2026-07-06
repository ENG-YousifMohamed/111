import {
  ADMIN_MODULES,
  HOME_SECTIONS,
  PRODUCT_FILTERS,
  SECURITY_FEATURES,
  STORE_CATEGORIES,
  STORE_ROLES,
  SUPPORTED_CURRENCIES,
  SUPPORTED_LANGUAGES,
} from '@/config/commerce';
import { getCatalogFilters } from '@/services/catalog-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  const catalog = await getCatalogFilters();

  return Response.json({
    roles: STORE_ROLES,
    homeSections: HOME_SECTIONS,
    categories: catalog.categories.length > 0 ? catalog.categories : STORE_CATEGORIES,
    filters: PRODUCT_FILTERS,
    adminModules: ADMIN_MODULES,
    security: SECURITY_FEATURES,
    languages: SUPPORTED_LANGUAGES,
    currencies: SUPPORTED_CURRENCIES,
  });
}
