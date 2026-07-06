'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { useApp } from '@/context/AppContext';
import type { Product } from '@/lib/products';
import type { AccountDashboard } from '@/types/commerce';

const TABS = [
  'Profile',
  'Orders',
  'Wishlist',
  'Addresses',
  'Payment Methods',
  'Notifications',
  'Reviews',
  'Recently Viewed',
  'Security Settings',
  'Delete Account',
] as const;

export default function AccountPage() {
  const { wishlist, removeFromWishlist, addToCart } = useApp();
  const [account, setAccount] = useState<AccountDashboard | null>(null);
  const [recentlyViewed] = useState<Product[]>(() => {
    if (typeof window === 'undefined') return [];
    return JSON.parse(window.localStorage.getItem('recently_viewed') ?? '[]') as Product[];
  });
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>('Profile');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadAccount() {
      try {
        const response = await fetch('/api/account', { cache: 'no-store' });
        if (!response.ok) {
          setAccount(null);
          return;
        }
        const data = (await response.json()) as AccountDashboard;
        if (isMounted) setAccount(data);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadAccount();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <div className="h-32" />
      <main className="container mx-auto max-w-7xl px-6 pb-24">
        <header className="mb-10">
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">
            User Dashboard
          </p>
          <h1 className="text-4xl font-black uppercase tracking-tight md:text-6xl">My Account</h1>
        </header>

        {isLoading ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-900/35 p-10 text-center text-zinc-500">
            Loading account...
          </div>
        ) : !account ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-900/35 p-10 text-center">
            <p className="mb-6 text-zinc-400">Login with your name and phone number to open your dashboard.</p>
            <Link href="/login?next=/account" className="rounded-xl bg-white px-6 py-3 text-sm font-black uppercase tracking-widest text-zinc-950 hover:bg-cyan-400">
              Login
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
            <aside className="h-max rounded-2xl border border-white/10 bg-zinc-900/35 p-4">
              <div className="mb-4 rounded-xl bg-zinc-950 p-4">
                <div className="text-lg font-black">{account.profile.name}</div>
                <div className="text-xs text-zinc-500">{account.profile.phone}</div>
                <div className="mt-3 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-cyan-300">
                  {account.profile.role}
                </div>
              </div>
              <nav className="space-y-2">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`w-full rounded-xl px-4 py-3 text-left text-sm font-bold transition ${
                      activeTab === tab
                        ? 'bg-cyan-500 text-zinc-950'
                        : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </aside>

            <section className="rounded-2xl border border-white/10 bg-zinc-900/35 p-6">
              {activeTab === 'Profile' && (
                <Panel title="Profile">
                  <InfoGrid
                    items={[
                      ['Name', account.profile.name],
                      ['Phone', account.profile.phone],
                      ['Role', account.profile.role],
                      ['VIP Level', account.profile.vipLevel],
                      ['Reward Points', String(account.profile.rewardPoints)],
                      ['Wallet', account.profile.walletBalance],
                    ]}
                  />
                </Panel>
              )}

              {activeTab === 'Orders' && (
                <Panel title="Orders">
                  {account.orders.length === 0 ? (
                    <EmptyState text="No orders yet." />
                  ) : (
                    <div className="space-y-3">
                      {account.orders.map((order) => (
                        <div key={order.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-zinc-950 p-4">
                          <div>
                            <div className="font-bold">#{order.orderNumber}</div>
                            <div className="text-xs text-zinc-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                          </div>
                          <div className="text-sm text-zinc-300">{order.status}</div>
                          <div className="font-mono font-black">${order.total.toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </Panel>
              )}

              {activeTab === 'Wishlist' && (
                <Panel title="Wishlist">
                  {wishlist.length === 0 ? (
                    <EmptyState text="No saved products yet." />
                  ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {wishlist.map((product) => (
                        <div key={product.id} className="rounded-2xl border border-white/10 bg-zinc-950 p-3">
                          <ProductCard product={product} compact />
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <button onClick={() => addToCart(product)} className="rounded-xl bg-white px-3 py-2 text-xs font-black text-zinc-950">Move To Cart</button>
                            <button onClick={() => removeFromWishlist(product.id)} className="rounded-xl border border-white/10 px-3 py-2 text-xs font-black text-zinc-300">Remove</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Panel>
              )}

              {activeTab === 'Addresses' && (
                <Panel title="Addresses">
                  {account.addresses.length === 0 ? <EmptyState text="No saved addresses yet." /> : (
                    <InfoGrid items={account.addresses.map((address) => [address.label, `${address.city} - ${address.line1}${address.isDefault ? ' (Default)' : ''}`])} />
                  )}
                </Panel>
              )}

              {activeTab === 'Payment Methods' && (
                <Panel title="Payment Methods">
                  <EmptyState text="Stripe cards and saved payment methods are ready at the data layer and can be connected to a live provider." />
                </Panel>
              )}

              {activeTab === 'Notifications' && (
                <Panel title="Notifications">
                  {account.notifications.length === 0 ? <EmptyState text="No notifications yet." /> : (
                    <div className="space-y-3">
                      {account.notifications.map((notification) => (
                        <div key={notification.id} className="rounded-xl border border-white/10 bg-zinc-950 p-4">
                          <div className="font-bold">{notification.title}</div>
                          <div className="mt-1 text-sm text-zinc-400">{notification.body}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </Panel>
              )}

              {activeTab === 'Reviews' && (
                <Panel title="Reviews">
                  <EmptyState text="Product reviews support stars, photos, videos, likes, replies, and verified purchase badges." />
                </Panel>
              )}

              {activeTab === 'Recently Viewed' && (
                <Panel title="Recently Viewed">
                  {recentlyViewed.length === 0 ? <EmptyState text="Open product pages to build your recently viewed list." /> : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {recentlyViewed.map((product) => <ProductCard product={product} key={product.id} compact />)}
                    </div>
                  )}
                </Panel>
              )}

              {activeTab === 'Security Settings' && (
                <Panel title="Security Settings">
                  <InfoGrid items={[
                    ['Login', 'Name + phone + verification code'],
                    ['Cookies', 'HTTP-only secure session cookie'],
                    ['Admin Access', 'Admin and Super Admin roles only'],
                    ['Input Validation', 'Sanitized API payloads'],
                  ]} />
                </Panel>
              )}

              {activeTab === 'Delete Account' && (
                <Panel title="Delete Account">
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-200">
                    Account deletion is intentionally not one-click. Add a confirmation workflow and audit log entry before enabling this destructive action.
                  </div>
                </Panel>
              )}
            </section>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-black uppercase tracking-tight">{title}</h2>
      {children}
    </div>
  );
}

function InfoGrid({ items }: { items: Array<[string, string]> }) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-xl border border-white/10 bg-zinc-950 p-4">
          <div className="mb-1 text-xs font-black uppercase tracking-widest text-zinc-500">{label}</div>
          <div className="text-zinc-200">{value}</div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-white/10 bg-zinc-950 p-8 text-center text-sm text-zinc-500">
      {text}
    </div>
  );
}
