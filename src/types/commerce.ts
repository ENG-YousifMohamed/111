import type { UserRole } from '@prisma/client';

export type StoreRole = UserRole | 'GUEST';

export type ApiSuccess<T> = {
  ok: true;
  data: T;
};

export type ApiFailure = {
  ok: false;
  error: string;
};

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

export type ProductSort = 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'best-selling';

export type ProductFilters = {
  query?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  color?: string;
  size?: string;
  availability?: 'in-stock' | 'out-of-stock' | 'all';
  discount?: boolean;
  sort?: ProductSort;
};

export type AccountDashboard = {
  profile: {
    id: string;
    name: string;
    phone: string;
    role: StoreRole;
    rewardPoints: number;
    walletBalance: string;
    vipLevel: string;
  };
  orders: Array<{
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    createdAt: string;
  }>;
  addresses: Array<{
    id: string;
    label: string;
    city: string;
    line1: string;
    isDefault: boolean;
  }>;
  notifications: Array<{
    id: string;
    title: string;
    body: string;
    type: string;
    isRead: boolean;
    createdAt: string;
  }>;
};
