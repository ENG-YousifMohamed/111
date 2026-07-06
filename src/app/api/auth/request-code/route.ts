import { requestPhoneCode } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';
import { validatePhoneLoginPayload } from '@/validation/commerce';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = validatePhoneLoginPayload(await request.json());

  if (!body.isValid) {
    return Response.json(
      { ok: false, error: 'Enter a valid name and phone number.' },
      { status: 400 },
    );
  }

  const rateLimit = checkRateLimit(`otp:${body.phone}`, 5, 10 * 60 * 1000);
  if (!rateLimit.ok) {
    return Response.json(
      { ok: false, error: 'Too many verification code requests. Please try again later.' },
      { status: 429 },
    );
  }

  const result = await requestPhoneCode({
    name: body.name,
    phone: body.phone,
    purpose: body.mode === 'register' ? 'REGISTER' : 'LOGIN',
  });

  return Response.json(result, { status: result.ok ? 200 : 400 });
}
