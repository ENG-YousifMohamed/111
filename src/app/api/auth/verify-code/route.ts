import { verifyPhoneCode } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = (await request.json()) as {
    phone?: string;
    code?: string;
    mode?: 'login' | 'register';
  };

  const result = await verifyPhoneCode({
    phone: body.phone ?? '',
    code: body.code ?? '',
    purpose: body.mode === 'register' ? 'REGISTER' : 'LOGIN',
  });

  return Response.json(result, { status: result.ok ? 200 : 400 });
}
