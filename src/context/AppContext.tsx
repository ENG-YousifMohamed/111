'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Product } from '@/lib/products';

export type CartProduct = Product;

export type CartItem = {
  product: CartProduct;
  quantity: number;
};

type Toast = {
  id: string;
  message: string;
};

type AppContextValue = {
  cart: CartItem[];
  cartCount: number;
  wishlist: CartProduct[];
  recentSearches: string[];
  isCartOpen: boolean;
  setIsCartOpen: Dispatch<SetStateAction<boolean>>;
  isSearchOpen: boolean;
  setIsSearchOpen: Dispatch<SetStateAction<boolean>>;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  addToCart: (product: CartProduct) => void;
  removeFromCart: (id: CartProduct['id']) => void;
  updateQuantity: (id: CartProduct['id'], quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: CartProduct) => void;
  removeFromWishlist: (id: CartProduct['id']) => void;
  addRecentSearch: (query: string) => void;
  applyCoupon: (code: string) => void;
  showToast: (message: string) => void;
};

const CART_KEY = 'zentra_cart';
const WISHLIST_KEY = 'zentra_wishlist';
const RECENT_SEARCHES_KEY = 'zentra_recent_searches';

const AppContext = createContext<AppContextValue | null>(null);

function parsePrice(price: string) {
  const parsed = Number.parseFloat(price.replace(/[^0-9.-]+/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function readStoredArray<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];

  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T[]) : [];
  } catch {
    return [];
  }
}

function createToastId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => readStoredArray<CartItem>(CART_KEY));
  const [wishlist, setWishlist] = useState<CartProduct[]>(() =>
    readStoredArray<CartProduct>(WISHLIST_KEY),
  );
  const [recentSearches, setRecentSearches] = useState<string[]>(() =>
    readStoredArray<string>(RECENT_SEARCHES_KEY),
  );
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recentSearches));
  }, [recentSearches]);

  const showToast = useCallback((message: string) => {
    const id = createToastId();
    setToasts((current) => [...current, { id, message }]);

    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 2500);
  }, []);

  const addToCart = useCallback(
    (product: CartProduct) => {
      setCart((current) => {
        const existingItem = current.find((item) => item.product.id === product.id);

        if (existingItem) {
          showToast(`Quantity updated // ${product.title}`);
          return current.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        }

        showToast(`Added to cart // ${product.title}`);
        return [...current, { product, quantity: 1 }];
      });
    },
    [showToast],
  );

  const removeFromCart = useCallback((id: CartProduct['id']) => {
    setCart((current) => current.filter((item) => item.product.id !== id));
  }, []);

  const updateQuantity = useCallback((id: CartProduct['id'], quantity: number) => {
    setCart((current) => {
      if (quantity <= 0) {
        return current.filter((item) => item.product.id !== id);
      }

      return current.map((item) =>
        item.product.id === id ? { ...item, quantity } : item,
      );
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setDiscount(0);
  }, []);

  const toggleWishlist = useCallback(
    (product: CartProduct) => {
      setWishlist((current) => {
        const isSaved = current.some((item) => item.id === product.id);

        if (isSaved) {
          showToast(`Removed from wishlist // ${product.title}`);
          return current.filter((item) => item.id !== product.id);
        }

        showToast(`Saved to wishlist // ${product.title}`);
        return [...current, product];
      });
    },
    [showToast],
  );

  const removeFromWishlist = useCallback((id: CartProduct['id']) => {
    setWishlist((current) => current.filter((item) => item.id !== id));
  }, []);

  const addRecentSearch = useCallback((query: string) => {
    const cleanedQuery = query.trim();
    if (!cleanedQuery) return;

    setRecentSearches((current) => {
      const nextSearches = [
        cleanedQuery,
        ...current.filter((item) => item.toLowerCase() !== cleanedQuery.toLowerCase()),
      ];

      return nextSearches.slice(0, 6);
    });
  }, []);

  const applyCoupon = useCallback(
    (code: string) => {
      const normalizedCode = code.trim().toUpperCase();

      if (['ALPHA30', 'CYBER30', 'VIP30'].includes(normalizedCode)) {
        setDiscount(0.3);
        showToast(`Coupon applied // ${normalizedCode}`);
        return;
      }

      setDiscount(0);
      showToast('Coupon not recognized');
    },
    [showToast],
  );

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + parsePrice(item.product.price) * item.quantity,
        0,
      ),
    [cart],
  );
  const discountedSubtotal = subtotal * (1 - discount);
  const shipping = discountedSubtotal > 3000 || discountedSubtotal === 0 ? 0 : 50;
  const tax = discountedSubtotal * 0.14;
  const total = discountedSubtotal + shipping + tax;
  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  );

  const value = useMemo<AppContextValue>(
    () => ({
      cart,
      cartCount,
      wishlist,
      recentSearches,
      isCartOpen,
      setIsCartOpen,
      isSearchOpen,
      setIsSearchOpen,
      subtotal,
      shipping,
      tax,
      discount,
      total,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleWishlist,
      removeFromWishlist,
      addRecentSearch,
      applyCoupon,
      showToast,
    }),
    [
      addRecentSearch,
      addToCart,
      applyCoupon,
      cart,
      cartCount,
      clearCart,
      discount,
      isCartOpen,
      isSearchOpen,
      recentSearches,
      removeFromCart,
      removeFromWishlist,
      shipping,
      showToast,
      subtotal,
      tax,
      toggleWishlist,
      total,
      updateQuantity,
      wishlist,
    ],
  );

  return (
    <AppContext.Provider value={value}>
      {children}

      <div className="fixed top-24 right-4 sm:right-8 z-[9999] flex w-full max-w-sm flex-col gap-4 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="pointer-events-auto relative flex items-center gap-5 overflow-hidden rounded-xl border border-cyan-500/30 border-l-4 border-l-cyan-500 bg-[#0a0a0a] p-5 text-white shadow-[0_10px_40px_-10px_rgba(6,182,212,0.4)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent" />
              <div className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-cyan-500/50 bg-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <svg
                  className="h-6 w-6 text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="relative z-10 flex-1">
                <div className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                  System Alert
                </div>
                <div className="font-mono text-sm leading-relaxed tracking-wide text-zinc-200">
                  {toast.message}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useApp must be used inside AppProvider');
  }

  return context;
}
