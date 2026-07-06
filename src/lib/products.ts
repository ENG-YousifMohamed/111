export interface Product {
  id: string;
  title: string;
  category: string;
  price: string;
  rawPrice?: number;
  comparePrice?: string;
  discount?: number;
  image: string;
  images?: string[];
  videos?: string[];
  sku?: string;
  brand?: string;
  rating?: number;
  reviewsCount?: number;
  colors?: string[];
  sizes?: string[];
  tags?: string[];
  specifications?: Record<string, string | number | boolean>;
  shippingInfo?: string;
  returnPolicy?: string;
  sellerInfo?: string;
  specs?: string;
  description?: string;
  stock?: number;
}
