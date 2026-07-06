'use client';

import { useEffect, useMemo, useState } from 'react';
import type { UserRole } from '@prisma/client';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import Link from 'next/link';
import { STORE_CATEGORIES } from '@/config/commerce';
import { useApp } from '@/context/AppContext';
import { isAdminRole, roleLabel } from '@/lib/roles';

type NavbarUser = {
  name: string;
  role: UserRole;
} | null;

export default function Navbar() {
  const { setIsSearchOpen, cartCount, wishlist } = useApp();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<NavbarUser>(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [language, setLanguage] = useState<'ar' | 'en'>(() => {
    if (typeof window === 'undefined') return 'ar';
    const storedLanguage = window.localStorage.getItem('language');
    return storedLanguage === 'en' || storedLanguage === 'ar' ? storedLanguage : 'ar';
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.localStorage.getItem('theme') !== 'light';
  });

  const wishlistCount = wishlist.length;
  const featuredCategories = useMemo(() => STORE_CATEGORIES.slice(0, 10), []);

  useEffect(() => {
    let isMounted = true;

    async function loadShellData() {
      try {
        const [authResponse, notificationsResponse] = await Promise.all([
          fetch('/api/auth/me', { cache: 'no-store' }),
          fetch('/api/notifications', { cache: 'no-store' }),
        ]);
        const authData = (await authResponse.json()) as { user: NavbarUser };
        const notificationsData = (await notificationsResponse.json()) as { unread?: number };

        if (isMounted) {
          setUser(authData.user);
          setUnreadNotifications(notificationsData.unread ?? 0);
        }
      } catch {
        if (isMounted) {
          setUser(null);
          setUnreadNotifications(0);
        }
      }
    }

    void loadShellData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = isDarkMode ? 'dark' : 'light';
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [isDarkMode, language]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    window.location.href = '/';
  };

  const toggleTheme = () => {
    const nextTheme = !isDarkMode;
    setIsDarkMode(nextTheme);
    document.documentElement.dataset.theme = nextTheme ? 'dark' : 'light';
    window.localStorage.setItem('theme', nextTheme ? 'dark' : 'light');
  };

  const toggleLanguage = () => {
    const nextLanguage = language === 'ar' ? 'en' : 'ar';
    setLanguage(nextLanguage);
    window.localStorage.setItem('language', nextLanguage);
    document.documentElement.lang = nextLanguage;
    document.documentElement.dir = nextLanguage === 'ar' ? 'rtl' : 'ltr';
  };

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(latest > previous && latest > 200);
    setIsScrolled(latest > 50);
  });

  return (
    <motion.nav
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: '-150%', opacity: 0 },
      }}
      animate={hidden ? 'hidden' : 'visible'}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled ? 'top-3' : 'top-0 md:top-4'
      }`}
      dir="ltr"
    >
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="flex items-center justify-between rounded-full border border-white/10 bg-zinc-950/55 px-4 py-3 backdrop-blur-xl md:px-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white text-zinc-950 flex items-center justify-center rounded-full font-black text-xl group-hover:bg-cyan-400 group-hover:scale-105 transition-all duration-300">
              A
            </div>
            <span className="text-xl font-black tracking-widest text-white uppercase hidden sm:block">
              Alpha<span className="text-cyan-500">.</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8 text-xs font-black uppercase tracking-[0.15em] text-zinc-300">
            <Link href="/products" className="hover:text-white transition-colors">
              Products
            </Link>

            <div className="relative group">
              <button className="hover:text-white transition-colors">Categories</button>
              <div className="invisible absolute left-1/2 top-full z-50 mt-4 w-[520px] -translate-x-1/2 rounded-2xl border border-white/10 bg-zinc-950/95 p-4 opacity-0 shadow-2xl backdrop-blur-xl transition group-hover:visible group-hover:opacity-100">
                <div className="grid grid-cols-2 gap-2">
                  {featuredCategories.map((category) => (
                    <Link
                      key={category}
                      href={`/category/${encodeURIComponent(category.toLowerCase())}`}
                      className="rounded-xl border border-white/5 px-4 py-3 text-zinc-400 hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-300"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {user && (
              <Link href="/account" className="hover:text-white transition-colors">
                Account
              </Link>
            )}

            {user && isAdminRole(user.role) && (
              <Link href="/dashboard" className="hover:text-white transition-colors">
                Dashboard
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-10 h-10 md:w-auto md:px-5 md:py-2.5 rounded-full bg-black/40 border border-white/10 flex items-center justify-center gap-2 text-zinc-300 hover:bg-white/10 hover:text-white transition-all group"
              aria-label="Search"
            >
              <svg className="w-4 h-4 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="hidden md:block text-xs font-mono uppercase tracking-widest opacity-70 group-hover:opacity-100">Search</span>
            </button>

            <button
              onClick={toggleTheme}
              className="hidden sm:flex w-10 h-10 rounded-full bg-black/40 border border-white/10 items-center justify-center text-xs font-black text-zinc-300 hover:text-white"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? 'D' : 'L'}
            </button>

            <button
              onClick={toggleLanguage}
              className="hidden sm:flex h-10 px-3 rounded-full bg-black/40 border border-white/10 items-center justify-center text-xs font-black text-zinc-300 hover:text-white"
            >
              {language.toUpperCase()}
            </button>

            <Link href="/wishlist" className="relative w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-cyan-500/50 transition-all" aria-label="Wishlist">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && <CounterBadge value={wishlistCount} />}
            </Link>

            <Link href="/cart" className="relative w-10 h-10 rounded-full bg-white text-zinc-950 flex items-center justify-center hover:bg-cyan-400 transition-all" aria-label="Cart">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && <CounterBadge value={cartCount} tone="red" />}
            </Link>

            {user && (
              <Link href="/account#notifications" className="relative w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white" aria-label="Notifications">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0a3 3 0 11-6 0" />
                </svg>
                {unreadNotifications > 0 && <CounterBadge value={unreadNotifications} />}
              </Link>
            )}

            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/account" className="h-10 px-4 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-xs font-black uppercase tracking-widest text-zinc-300 hover:text-white">
                  {roleLabel(user.role)}
                </Link>
                <button
                  onClick={handleLogout}
                  className="h-10 px-4 rounded-full bg-black/40 border border-white/10 text-xs font-black uppercase tracking-widest text-zinc-300 hover:text-white hover:border-red-500/50 transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="hidden md:flex h-10 px-4 rounded-full bg-black/40 border border-white/10 items-center justify-center text-xs font-black uppercase tracking-widest text-zinc-300 hover:text-white hover:border-cyan-500/50 transition-all">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

function CounterBadge({ value, tone = 'cyan' }: { value: number; tone?: 'cyan' | 'red' }) {
  return (
    <span
      className={`absolute -top-1 -right-1 w-4 h-4 ${
        tone === 'red' ? 'bg-red-500 text-white' : 'bg-cyan-500 text-zinc-950'
      } text-[9px] font-black flex items-center justify-center rounded-full`}
    >
      {value}
    </span>
  );
}
