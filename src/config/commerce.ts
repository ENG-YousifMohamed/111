export const STORE_ROLES = ['Guest', 'Customer', 'Admin', 'Super Admin'] as const;

export const STORE_CATEGORIES = [
  'Men',
  'Women',
  'Kids',
  'Electronics',
  'Fashion',
  'Shoes',
  'Accessories',
  'Beauty',
  'Sports',
  'Gaming',
  'Books',
  'Home',
  'Furniture',
  'Groceries',
] as const;

export const HOME_SECTIONS = [
  'Hero Section',
  'Featured Products',
  'Categories',
  'Best Sellers',
  "Today's Deals",
  'Flash Sale Countdown',
  'Trending Products',
  'Brands',
  'Testimonials',
  'Newsletter',
  'FAQ',
  'Footer',
] as const;

export const PRODUCT_FILTERS = [
  'Category',
  'Brand',
  'Price',
  'Rating',
  'Color',
  'Size',
  'Availability',
  'Discount',
  'Newest',
  'Best Selling',
  'Popularity',
] as const;

export const ORDER_STATUSES = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'REFUND_REQUESTED',
  'REFUNDED',
] as const;

export const ADMIN_MODULES = [
  'Statistics',
  'Sales Analytics',
  'Revenue Charts',
  'Visitors',
  'Conversion Rate',
  'Top Products',
  'Top Categories',
  'Recent Orders',
  'Users',
  'Notifications',
  'System Logs',
  'Product Management',
  'Category Management',
  'Brand Management',
  'Order Management',
  'Discount Management',
  'CMS',
  'SEO',
] as const;

export const SECURITY_FEATURES = [
  'Rate Limiting',
  'CORS',
  'CSRF Protection',
  'XSS Protection',
  'SQL Injection Protection',
  'Input Validation',
  'Sanitize Inputs',
  'Secure Cookies',
  'Environment Variables',
  'Audit Logs',
] as const;

export const SUPPORTED_LANGUAGES = [
  { code: 'ar', label: 'Arabic' },
  { code: 'en', label: 'English' },
] as const;

export const SUPPORTED_CURRENCIES = ['USD', 'EGP', 'SAR', 'AED'] as const;
