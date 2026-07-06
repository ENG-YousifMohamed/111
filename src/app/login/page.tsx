'use client';

import { FormEvent, Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

type Mode = 'login' | 'register';

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6" dir="rtl">
          <div className="text-zinc-400 font-mono">Loading login...</div>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = useMemo(() => searchParams.get('next') || '/', [searchParams]);
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'details' | 'code'>('details');
  const [message, setMessage] = useState('');
  const [devCode, setDevCode] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function requestCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setDevCode(null);

    try {
      const response = await fetch('/api/auth/request-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, mode }),
      });
      const result = (await response.json()) as {
        ok: boolean;
        error?: string;
        devCode?: string;
      };

      if (!response.ok || !result.ok) {
        setMessage(result.error ?? 'Could not send code.');
        return;
      }

      setDevCode(result.devCode ?? null);
      setStep('code');
      setMessage('Verification code sent.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code, mode }),
      });
      const result = (await response.json()) as { ok: boolean; error?: string };

      if (!response.ok || !result.ok) {
        setMessage(result.error ?? 'Invalid code.');
        return;
      }

      router.push(nextUrl);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6" dir="rtl">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900/70 p-6 shadow-2xl">
        <Link href="/" className="text-xs text-cyan-400 font-bold uppercase tracking-widest">
          Alpha Store
        </Link>

        <div className="mt-6 mb-8">
          <h1 className="text-3xl font-black">
            {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب'}
          </h1>
          <p className="text-sm text-zinc-400 mt-2">
            الاسم ورقم الموبايل ثم كود التحقق.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setStep('details');
              setMessage('');
            }}
            className={`py-3 rounded-xl text-sm font-bold transition ${
              mode === 'login' ? 'bg-cyan-500 text-zinc-950' : 'bg-zinc-800 text-zinc-300'
            }`}
          >
            دخول
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setStep('details');
              setMessage('');
            }}
            className={`py-3 rounded-xl text-sm font-bold transition ${
              mode === 'register' ? 'bg-cyan-500 text-zinc-950' : 'bg-zinc-800 text-zinc-300'
            }`}
          >
            حساب جديد
          </button>
        </div>

        {step === 'details' ? (
          <form onSubmit={requestCode} className="space-y-4">
            <label className="block">
              <span className="text-xs text-zinc-400">الاسم</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2 w-full rounded-xl bg-zinc-950 border border-white/10 px-4 py-3 outline-none focus:border-cyan-400"
                required
              />
            </label>
            <label className="block">
              <span className="text-xs text-zinc-400">رقم الموبايل</span>
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                inputMode="tel"
                className="mt-2 w-full rounded-xl bg-zinc-950 border border-white/10 px-4 py-3 outline-none focus:border-cyan-400"
                placeholder="+201000000000"
                required
              />
            </label>
            <button
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-white text-zinc-950 font-black disabled:opacity-50"
            >
              إرسال الكود
            </button>
          </form>
        ) : (
          <form onSubmit={verifyCode} className="space-y-4">
            <label className="block">
              <span className="text-xs text-zinc-400">كود التحقق</span>
              <input
                value={code}
                onChange={(event) => setCode(event.target.value)}
                inputMode="numeric"
                maxLength={6}
                className="mt-2 w-full rounded-xl bg-zinc-950 border border-white/10 px-4 py-3 text-center tracking-[0.5em] outline-none focus:border-cyan-400"
                required
              />
            </label>
            {devCode && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">
                Dev code: <span className="font-mono font-bold">{devCode}</span>
              </div>
            )}
            <button
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-cyan-500 text-zinc-950 font-black disabled:opacity-50"
            >
              تأكيد الدخول
            </button>
            <button
              type="button"
              onClick={() => setStep('details')}
              className="w-full py-3 rounded-xl bg-zinc-800 text-zinc-300 font-bold"
            >
              تعديل البيانات
            </button>
          </form>
        )}

        {message && (
          <p className="mt-4 text-sm text-center text-zinc-300">{message}</p>
        )}
      </div>
    </main>
  );
}
