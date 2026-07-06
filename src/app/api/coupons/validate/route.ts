import { prisma } from '@/lib/prisma';
import { fail } from '@/lib/api-response';
import { sanitizeText } from '@/utils/sanitize';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = (await request.json()) as { code?: unknown; subtotal?: unknown };
  const code = sanitizeText(body.code, 40).toUpperCase();
  const subtotal = Number(body.subtotal ?? 0);

  if (!code || !Number.isFinite(subtotal)) {
    return fail('Invalid coupon payload');
  }

  const coupon = await prisma.coupon.findUnique({ where: { code } });
  const now = new Date();

  if (
    !coupon ||
    !coupon.isActive ||
    (coupon.startsAt && coupon.startsAt > now) ||
    (coupon.expiresAt && coupon.expiresAt < now) ||
    (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) ||
    (coupon.minOrder !== null && subtotal < Number(coupon.minOrder))
  ) {
    return fail('Coupon is not valid', 404);
  }

  let discount = 0;
  if (coupon.type === 'PERCENTAGE') {
    discount = subtotal * (Number(coupon.value) / 100);
  } else if (coupon.type === 'FIXED_AMOUNT') {
    discount = Number(coupon.value);
  }

  return Response.json({
    code: coupon.code,
    type: coupon.type,
    value: Number(coupon.value),
    discount: Math.min(subtotal, discount),
    freeShipping: coupon.type === 'FREE_SHIPPING',
  });
}
