// 商品の型定義
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  sizes: string[];
  colors: string[];
  images: string[];
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ユーザーの型定義
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

// カートアイテムの型定義
export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  product: Product;
  size: string;
  color: string;
  quantity: number;
  created_at: string;
}

// 注文の型定義
export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  shipping_address: ShippingAddress;
  payment_method: string;
  tracking_number?: string;
  order_date: string;
  updated_at: string;
}

// 配送先住所の型定義
export interface ShippingAddress {
  name: string;
  postal_code: string;
  prefecture: string;
  city: string;
  address: string;
  building?: string;
  phone: string;
}

// レビューの型定義
export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  user: User;
  rating: number;
  comment?: string;
  is_verified_purchase: boolean;
  created_at: string;
}

// 支払い方法の型定義
export type PaymentMethod = 'credit_card' | 'paypay' | 'apple_pay' | 'convenience_store';

// カテゴリの型定義
export interface Category {
  id: string;
  name: string;
  name_ja: string;
  slug: string;
  parent_id?: string;
  sort_order: number;
  is_active: boolean;
}

// サイズの型定義
export interface Size {
  id: string;
  name: string;
  category: string;
  measurements?: {
    [key: string]: number;
  };
}

// 色の型定義
export interface Color {
  id: string;
  name: string;
  name_ja: string;
  hex_code: string;
}

// APIレスポンスの基本型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ページネーションの型定義
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

// 商品検索フィルターの型定義
export interface ProductFilters {
  category?: string;
  min_price?: number;
  max_price?: number;
  sizes?: string[];
  colors?: string[];
  brands?: string[];
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
  page?: number;
  limit?: number;
}