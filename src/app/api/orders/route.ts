import type { Prisma } from '@prisma/client';
import { createDatabaseOrder, type OrderCartItem } from '@/lib/store-data';

export const dynamic = 'force-dynamic';

type OrderRequestBody = {
  cart?: OrderCartItem[];
  paymentMethod?: string;
  totals?: {
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  };
  shippingAddress?: Prisma.InputJsonObject;
};

export async function POST(request: Request) {
  const body = (await request.json()) as OrderRequestBody;

  if (!body.cart?.length || !body.paymentMethod || !body.totals) {
    return Response.json({ error: 'Invalid order payload' }, { status: 400 });
  }

  try {
    const order = await createDatabaseOrder({
      cart: body.cart,
      paymentMethod: body.paymentMethod,
      totals: body.totals,
      shippingAddress: body.shippingAddress ?? {},
    });

    return Response.json({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
    });
  } catch {
    return Response.json({ error: 'Order creation failed' }, { status: 500 });
  }
}
