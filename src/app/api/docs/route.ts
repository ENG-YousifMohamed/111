export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json({
    openapi: '3.1.0',
    info: {
      title: 'Alpha Store API',
      version: '1.0.0',
      description: 'REST API for storefront, catalog, auth, account, admin, coupons, and orders.',
    },
    paths: {
      '/api/products': {
        get: { summary: 'List products with optional pagination, filtering, and sorting' },
      },
      '/api/products/{id}': {
        get: { summary: 'Get product details' },
      },
      '/api/auth/request-code': {
        post: { summary: 'Request phone verification code' },
      },
      '/api/auth/verify-code': {
        post: { summary: 'Verify code and create a session' },
      },
      '/api/account': {
        get: { summary: 'Get authenticated customer dashboard' },
      },
      '/api/dashboard': {
        get: { summary: 'Get admin dashboard data' },
      },
      '/api/admin/users': {
        get: { summary: 'List users for Admin and Super Admin' },
      },
      '/api/admin/logs': {
        get: { summary: 'List audit logs for Admin and Super Admin' },
      },
      '/api/coupons/validate': {
        post: { summary: 'Validate coupon code' },
      },
      '/api/orders': {
        post: { summary: 'Create order from cart' },
      },
    },
  });
}
