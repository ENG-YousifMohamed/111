import 'server-only';
import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { User, UserRole } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { isAdminRole } from '@/lib/roles';

export const SESSION_COOKIE = 'alpha_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const OTP_MAX_AGE_MINUTES = 10;

export type AuthUser = Pick<User, 'id' | 'name' | 'phone' | 'role'>;

function authSecret() {
  return process.env.NEXTAUTH_SECRET || process.env.SESSION_SECRET || 'dev-alpha-session-secret';
}

function hashValue(value: string) {
  return crypto.createHmac('sha256', authSecret()).update(value).digest('hex');
}

export function normalizePhone(phone: string) {
  return phone.trim().replace(/[^\d+]/g, '');
}

function generateCode() {
  return crypto.randomInt(100000, 999999).toString();
}

function toAuthUser(user: User): AuthUser {
  return {
    id: user.id,
    name: user.name,
    phone: user.phone,
    role: user.role,
  };
}

async function sendSmsCode(phone: string, code: string) {
  const message = `Alpha Store verification code: ${code}`;
  const webhookUrl = process.env.SMS_WEBHOOK_URL;

  if (!webhookUrl) {
    console.log(`[DEV SMS] ${phone}: ${code}`);
    return { sent: false, devCode: code };
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to: phone, message, code }),
  });

  if (!response.ok) {
    throw new Error('SMS provider rejected the message');
  }

  return { sent: true, devCode: undefined };
}

export async function requestPhoneCode({
  name,
  phone,
  purpose,
}: {
  name: string;
  phone: string;
  purpose: 'LOGIN' | 'REGISTER';
}) {
  const cleanName = name.trim();
  const cleanPhone = normalizePhone(phone);

  if (cleanName.length < 2 || cleanPhone.length < 8) {
    return { ok: false as const, error: 'Enter a valid name and phone number.' };
  }

  const existingUser = await prisma.user.findUnique({ where: { phone: cleanPhone } });

  if (existingUser?.isBlocked) {
    return { ok: false as const, error: 'This account is blocked.' };
  }

  if (purpose === 'LOGIN' && !existingUser) {
    return { ok: false as const, error: 'No account exists for this phone number.' };
  }

  if (purpose === 'REGISTER' && existingUser) {
    return { ok: false as const, error: 'This phone already has an account. Please log in.' };
  }

  const code = generateCode();
  const expiresAt = new Date(Date.now() + OTP_MAX_AGE_MINUTES * 60 * 1000);

  await prisma.loginCode.create({
    data: {
      name: cleanName,
      phone: cleanPhone,
      purpose,
      codeHash: hashValue(`${cleanPhone}:${code}`),
      expiresAt,
      userId: existingUser?.id,
    },
  });

  const sms = await sendSmsCode(cleanPhone, code);

  return {
    ok: true as const,
    phone: cleanPhone,
    expiresAt: expiresAt.toISOString(),
    devCode: process.env.NODE_ENV === 'production' ? undefined : sms.devCode,
  };
}

export async function verifyPhoneCode({
  phone,
  code,
  purpose,
}: {
  phone: string;
  code: string;
  purpose: 'LOGIN' | 'REGISTER';
}) {
  const cleanPhone = normalizePhone(phone);
  const cleanCode = code.trim();

  if (cleanPhone.length < 8 || cleanCode.length !== 6) {
    return { ok: false as const, error: 'Invalid phone or code.' };
  }

  const loginCode = await prisma.loginCode.findFirst({
    where: {
      phone: cleanPhone,
      purpose,
      codeHash: hashValue(`${cleanPhone}:${cleanCode}`),
      consumedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!loginCode || loginCode.attempts >= 5) {
    return { ok: false as const, error: 'The code is incorrect or expired.' };
  }

  const existingUser = await prisma.user.findUnique({ where: { phone: cleanPhone } });
  const firstAccount = (await prisma.user.count()) === 0;

  if (purpose === 'LOGIN' && !existingUser) {
    return { ok: false as const, error: 'No account exists for this phone number.' };
  }

  const role: UserRole = firstAccount ? 'SUPER_ADMIN' : 'CUSTOMER';
  let user =
    existingUser ??
    (await prisma.user.create({
      data: {
        name: loginCode.name,
        phone: cleanPhone,
        role,
        phoneVerifiedAt: new Date(),
      },
    }));

  if (existingUser && existingUser.name !== loginCode.name) {
    user = await prisma.user.update({
      where: { id: existingUser.id },
      data: { name: loginCode.name, phoneVerifiedAt: existingUser.phoneVerifiedAt ?? new Date() },
    });
  }

  if (user.isBlocked) {
    return { ok: false as const, error: 'This account is blocked.' };
  }

  await prisma.loginCode.update({
    where: { id: loginCode.id },
    data: { consumedAt: new Date() },
  });

  const token = crypto.randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);

  await prisma.authSession.create({
    data: {
      tokenHash: hashValue(token),
      userId: user.id,
      expiresAt,
    },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const cookieStore = await cookies();
  cookieStore.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  return { ok: true as const, user: toAuthUser(user) };
}

export async function getCurrentSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.authSession.findUnique({
    where: { tokenHash: hashValue(token) },
    include: { user: true },
  });

  if (!session || session.expiresAt <= new Date() || session.user.isBlocked) {
    return null;
  }

  return {
    id: session.id,
    user: toAuthUser(session.user),
  };
}

export async function requireAdmin() {
  const session = await getCurrentSession();

  if (!session) {
    redirect('/login?next=/dashboard');
  }

  if (!isAdminRole(session.user.role)) {
    redirect('/');
  }

  return session.user;
}

export async function requireAdminForMutation() {
  const session = await getCurrentSession();

  if (!session || !isAdminRole(session.user.role)) {
    throw new Error('Unauthorized');
  }

  return session.user;
}

export async function logoutCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    await prisma.authSession.deleteMany({
      where: { tokenHash: hashValue(token) },
    });
  }

  cookieStore.set({
    name: SESSION_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
}
