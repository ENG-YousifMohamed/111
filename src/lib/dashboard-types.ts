export type DashboardData = {
  source: 'database';
  stats: {
    totalRevenue: number;
    orderCount: number;
    customerCount: number;
    productCount: number;
    lowStockCount: number;
    outOfStockCount: number;
    conversionRate: number;
    averageOrder: number;
  };
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customer: string;
    total: number;
    status: string;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    units: number;
    revenue: number;
    image: string;
    category: string;
  }>;
  categories: Array<{
    name: string;
    percent: number;
  }>;
  admins: Array<{
    id: string;
    name: string;
    phone: string;
    role: string;
    createdAt: string;
  }>;
  inventory: Array<{
    id: string;
    name: string;
    sku: string;
    stock: number;
    price: number;
    status: 'in-stock' | 'low-stock' | 'out-of-stock';
  }>;
};
