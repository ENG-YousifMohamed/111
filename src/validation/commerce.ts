import { clampNumber, sanitizePhone, sanitizeText } from '@/utils/sanitize';
import type { ProductFilters, ProductSort } from '@/types/commerce';

export function validatePhoneLoginPayload(body: unknown) {
  const payload = body && typeof body === 'object' ? (body as Record<string, unknown>) : {};
  const name = sanitizeText(payload.name, 80);
  const phone = sanitizePhone(payload.phone);
  const mode = payload.mode === 'register' ? 'register' : 'login';

  return {
    name,
    phone,
    mode,
    isValid: name.length >= 2 && phone.length >= 8,
  };
}

export function parseProductFilters(searchParams: URLSearchParams): ProductFilters {
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const rating = searchParams.get('rating');

  const availabilityParam = searchParams.get('availability');
  const availability: ProductFilters['availability'] =
    availabilityParam === 'in-stock' || availabilityParam === 'out-of-stock'
      ? availabilityParam
      : 'all';
  const sortParam = searchParams.get('sort');
  const sort: ProductSort =
    sortParam === 'price-asc' ||
    sortParam === 'price-desc' ||
    sortParam === 'rating' ||
    sortParam === 'best-selling'
      ? sortParam
      : 'newest';

  return {
    query: sanitizeText(searchParams.get('q') ?? '', 120),
    category: sanitizeText(searchParams.get('category') ?? '', 80),
    brand: sanitizeText(searchParams.get('brand') ?? '', 80),
    minPrice: minPrice ? clampNumber(minPrice, 0, 1000000) : undefined,
    maxPrice: maxPrice ? clampNumber(maxPrice, 0, 1000000) : undefined,
    rating: rating ? clampNumber(rating, 0, 5) : undefined,
    color: sanitizeText(searchParams.get('color') ?? '', 40),
    size: sanitizeText(searchParams.get('size') ?? '', 40),
    availability,
    discount: searchParams.get('discount') === 'true',
    sort,
  };
}
