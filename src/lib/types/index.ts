export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at">;
        Update: Partial<Omit<Profile, "id" | "created_at" | "status">>;
      };
      categories: {
        Row: Category;
        Insert: Omit<Category, "id" | "created_at">;
        Update: Partial<Omit<Category, "id" | "created_at">>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Product, "id" | "created_at">>;
      };
      product_images: {
        Row: ProductImage;
        Insert: Omit<ProductImage, "id">;
        Update: Partial<Omit<ProductImage, "id">>;
      };
      product_options: {
        Row: ProductOption;
        Insert: Omit<ProductOption, "id">;
        Update: Partial<Omit<ProductOption, "id">>;
      };
      product_option_values: {
        Row: ProductOptionValue;
        Insert: Omit<ProductOptionValue, "id">;
        Update: Partial<Omit<ProductOptionValue, "id">>;
      };
      product_variants: {
        Row: ProductVariant;
        Insert: Omit<ProductVariant, "id" | "created_at">;
        Update: Partial<Omit<ProductVariant, "id" | "created_at">>;
      };
      addresses: {
        Row: Address;
        Insert: Omit<Address, "id" | "created_at">;
        Update: Partial<Omit<Address, "id" | "created_at">>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Order, "id" | "created_at">>;
      };
      order_items: {
        Row: OrderItem;
        Insert: Omit<OrderItem, "id">;
        Update: Partial<Omit<OrderItem, "id">>;
      };
      order_timeline: {
        Row: OrderTimeline;
        Insert: Omit<OrderTimeline, "id" | "created_at">;
        Update: Partial<Omit<OrderTimeline, "id">>;
      };
      reviews: {
        Row: Review;
        Insert: Omit<Review, "id" | "created_at">;
        Update: Partial<Omit<Review, "id" | "created_at">>;
      };
      coupons: {
        Row: Coupon;
        Insert: Omit<Coupon, "id" | "created_at">;
        Update: Partial<Omit<Coupon, "id" | "created_at">>;
      };
      subscribers: {
        Row: Subscriber;
        Insert: Omit<Subscriber, "id" | "created_at">;
        Update: Partial<Omit<Subscriber, "id">>;
      };
      hero_slides: {
        Row: HeroSlide;
        Insert: Omit<HeroSlide, "id">;
        Update: Partial<Omit<HeroSlide, "id">>;
      };
      wishlist: {
        Row: WishlistItem;
        Insert: Omit<WishlistItem, "id" | "created_at">;
        Update: Partial<Omit<WishlistItem, "id">>;
      };
      media: {
        Row: Media;
        Insert: Omit<Media, "id" | "created_at">;
        Update: Partial<Omit<Media, "id">>;
      };
      site_settings: {
        Row: SiteSettings;
        Insert: SiteSettings;
        Update: Partial<SiteSettings>;
      };
      seo_settings: {
        Row: SeoSettings;
        Insert: SeoSettings;
        Update: Partial<SeoSettings>;
      };
      page_seo: {
        Row: PageSeo;
        Insert: Omit<PageSeo, "id">;
        Update: Partial<Omit<PageSeo, "id">>;
      };
    };
    Enums: {
      user_role: "customer" | "admin" | "wholesaler" | "vendor" | "super_admin";
      product_status: "draft" | "active";
      payment_status: "pending" | "paid" | "failed" | "refunded";
      fulfillment_status:
        | "pending"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled";
      coupon_type: "percentage" | "fixed";
    };
  };
};

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  role: "customer" | "admin" | "wholesaler" | "vendor" | "super_admin";
  status: "pending" | "approved" | "suspended" | "rejected";
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  tagline: string | null;
  logo_url: string | null;
  logo_inverted_url: string | null;
  favicon_url: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  business_address: string | null;
  currency_code: string;
  currency_symbol: string;
  tax_rate: number;
  tax_inclusive: boolean;
  announcement_bar_active: boolean;
  announcement_bar_text: string | null;
  announcement_bar_link: string | null;
  announcement_bar_color: string | null;
  social_instagram: string | null;
  social_facebook: string | null;
  social_twitter: string | null;
  social_tiktok: string | null;
  social_youtube: string | null;
  openrouter_api_key: string | null;
  openrouter_model: string | null;
  updated_at: string;
}

export interface SeoSettings {
  id: string;
  meta_title_template: string;
  default_meta_description: string | null;
  og_default_image_url: string | null;
  ga_tracking_id: string | null;
  fb_pixel_id: string | null;
  search_console_meta: string | null;
  robots_txt: string | null;
  updated_at: string;
}

export interface PageSeo {
  id: string;
  page_slug: string;
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category_id: string | null;
  vendor_id: string | null;
  price: number;
  sale_price: number | null;
  sale_start: string | null;
  sale_end: string | null;
  sku: string;
  stock_quantity: number;
  track_inventory: boolean;
  allow_backorders: boolean;
  status: "draft" | "active";
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  sort_order: number;
  alt_text: string | null;
}

export interface ProductVideo {
  id: string;
  product_id: string;
  video_url: string;
  thumbnail_url: string | null;
  title: string | null;
  sort_order: number;
  duration: number | null;
}

export interface ProductOption {
  id: string;
  product_id: string;
  name: string;
  sort_order: number;
}

export interface ProductOptionValue {
  id: string;
  option_id: string;
  value: string;
  sort_order: number;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  price: number | null;
  stock_quantity: number;
  option_values: { option_name: string; value: string }[];
  created_at: string;
}

export interface ProductWithDetails extends Product {
  product_images: ProductImage[];
  product_options: (ProductOption & {
    product_option_values: ProductOptionValue[];
  })[];
  product_variants: ProductVariant[];
  category?: Category;
  review_count?: number;
  average_rating?: number;
}

export interface Address {
  id: string;
  user_id: string;
  full_name: string;
  phone: string | null;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string | null;
  zip: string;
  country: string;
  is_default: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  email: string;
  shipping_address: Record<string, unknown>;
  billing_address: Record<string, unknown> | null;
  shipping_method: string | null;
  shipping_cost: number;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total: number;
  coupon_code: string | null;
  payment_status: "pending" | "paid" | "failed" | "refunded";
  fulfillment_status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  tracking_number: string | null;
  tracking_carrier: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderWithDetails extends Order {
  order_items: OrderItem[];
  order_timeline: OrderTimeline[];
  profiles?: Profile;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string | null;
  title: string;
  variant_info: Record<string, unknown> | null;
  quantity: number;
  unit_price: number;
  line_total: number;
  product_images?: ProductImage[];
}

export interface OrderTimeline {
  id: string;
  order_id: string;
  status: string;
  note: string | null;
  created_by: string | null;
  created_at: string;
  profiles?: Profile;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string | null;
  body: string | null;
  is_verified: boolean;
  created_at: string;
  profiles?: Profile;
}

export interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  min_order_amount: number | null;
  usage_limit: number | null;
  per_customer_limit: number | null;
  times_used: number;
  valid_from: string | null;
  valid_to: string | null;
  applicable_products: string[] | null;
  applicable_categories: string[] | null;
  is_active: boolean;
  created_at: string;
}

export interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

export interface HeroSlide {
  id: string;
  image_url: string;
  heading: string | null;
  subheading: string | null;
  cta_text: string | null;
  cta_link: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export interface Media {
  id: string;
  url: string;
  filename: string;
  size: number;
  mime_type: string;
  uploaded_by: string | null;
  created_at: string;
}

// Cart types
export interface CartItem {
  product: ProductWithDetails & { sale_price?: number | null };
  variant?: ProductVariant;
  quantity: number;
  selectedOptions?: Record<string, string>;
}

// API response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// Filter types
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  color?: string;
  size?: string;
  rating?: number;
  inStock?: boolean;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

// Sort options
export type SortOption =
  | "newest"
  | "price-asc"
  | "price-desc"
  | "best-selling"
  | "rating";

// Homepage Section types
export type HomepageSectionType =
  | "hero"
  | "trust_badges"
  | "categories"
  | "products_grid"
  | "featured_products"
  | "banner"
  | "instagram"
  | "newsletter"
  | "custom_text"
  | "testimonials"
  | "blogs"
  | "deal_today"
  | "sale_banner_industrial";

export interface HomepageSection {
  id: string;
  type: HomepageSectionType;
  title?: string;
  subtitle?: string;
  settings: Record<string, any>;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// =====================================================
// Custom Pages & Menu Types
// =====================================================

export interface CustomPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  meta_title: string | null;
  meta_description: string | null;
  status: "draft" | "published";
  show_in_footer: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: string;
  label: string;
  url: string | null;
  type: "custom" | "category" | "page" | "divider" | "heading";
  target_id: string | null;
  parent_id: string | null;
  sort_order: number;
  is_mega_menu: boolean;
  mega_menu_columns: number;
  icon: string | null;
  css_class: string | null;
  target_blank: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  children?: MenuItem[];
}

// =====================================================
// Enterprise Types
// =====================================================

// Vendor Types
export interface VendorProfile {
  id: string;
  user_id: string;
  business_name: string;
  business_description: string | null;
  business_logo_url: string | null;
  business_address: string | null;
  business_phone: string | null;
  business_email: string | null;
  tax_id: string | null;
  gst_number: string | null;
  pan_number: string | null;
  bank_account_number: string | null;
  bank_ifsc: string | null;
  bank_name: string | null;
  commission_rate: number;
  status: "pending" | "approved" | "suspended" | "rejected";
  verification_status: "unverified" | "pending" | "verified" | "rejected";
  rating: number | null;
  total_sales: number;
  total_orders: number;
  created_at: string;
  updated_at: string;
  user?: Profile;
  wallet?: VendorWallet;
}

export interface VendorWallet {
  id: string;
  vendor_id: string;
  pending_balance: number;
  available_balance: number;
  total_earned: number;
  total_withdrawn: number;
  created_at: string;
  updated_at: string;
  transactions?: VendorWalletTransaction[];
}

export interface VendorWalletTransaction {
  id: string;
  vendor_id: string;
  type: "credit" | "debit" | "withdrawal" | "commission";
  amount: number;
  description: string | null;
  reference_id: string | null;
  reference_type: string | null;
  status: "pending" | "completed" | "failed";
  created_at: string;
}

// Wholesaler Types
export interface WholesalerProfile {
  id: string;
  user_id: string;
  business_name: string;
  business_description: string | null;
  business_logo_url: string | null;
  business_address: string | null;
  business_phone: string | null;
  business_email: string | null;
  tax_id: string | null;
  gst_number: string | null;
  pan_number: string | null;
  min_order_amount: number;
  credit_limit: number;
  credit_used: number;
  payment_terms_days: number;
  status: "pending" | "approved" | "suspended" | "rejected";
  verification_status: "unverified" | "pending" | "verified" | "rejected";
  rating: number | null;
  total_sales: number;
  total_orders: number;
  created_at: string;
  updated_at: string;
  user?: Profile;
}

export interface WholesalePricing {
  id: string;
  product_id: string;
  wholesaler_id: string | null;
  min_quantity: number;
  max_quantity: number | null;
  price_per_unit: number;
  created_at: string;
  product?: Product;
}

export interface RfqRequest {
  id: string;
  customer_id: string;
  wholesaler_id: string | null;
  product_id: string | null;
  product_name: string;
  quantity: number;
  specifications: Record<string, unknown> | null;
  target_price: number | null;
  notes: string | null;
  status: "pending" | "quoted" | "accepted" | "rejected" | "expired";
  quoted_price: number | null;
  quoted_at: string | null;
  valid_until: string | null;
  created_at: string;
  updated_at: string;
  customer?: Profile;
  wholesaler?: WholesalerProfile;
  product?: Product;
}

// Customer Wallet Types
export interface CustomerWallet {
  id: string;
  user_id: string;
  balance: number;
  total_earned: number;
  total_spent: number;
  created_at: string;
  updated_at: string;
}

export interface RewardPoint {
  id: string;
  user_id: string;
  points: number;
  expires_at: string | null;
  source: string | null;
  reference_id: string | null;
  created_at: string;
}

export interface GiftCard {
  id: string;
  code: string;
  balance: number;
  initial_amount: number;
  buyer_id: string | null;
  recipient_email: string | null;
  recipient_name: string | null;
  status: "active" | "used" | "expired";
  valid_from: string;
  valid_to: string | null;
  created_at: string;
}

// Enterprise System Types
export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_values: string | null;
  new_values: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  user?: Profile;
}

export interface FeatureFlag {
  id: string;
  name: string;
  description: string | null;
  is_enabled: boolean;
  target_roles: string[];
  created_at: string;
  updated_at: string;
}

export interface SystemHealth {
  id: string;
  service_name: string;
  status: "healthy" | "degraded" | "down";
  response_time_ms: number | null;
  last_check: string;
  details: string | null;
  created_at: string;
}

export interface ApiKey {
  id: string;
  user_id: string;
  name: string;
  key_hash: string;
  prefix: string;
  permissions: string[];
  last_used_at: string | null;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
  user?: Profile;
}

export interface VendorProductApproval {
  id: string;
  product_id: string;
  vendor_id: string;
  status: "pending" | "approved" | "rejected";
  review_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  product?: Product;
  vendor?: VendorProfile;
}

export interface VendorSubscription {
  id: string;
  vendor_id: string;
  plan_name: string;
  plan_price: number;
  status: "active" | "cancelled" | "expired";
  starts_at: string;
  expires_at: string | null;
  created_at: string;
}

// Super Admin Dashboard Types
export interface SuperAdminDashboard {
  totalUsers: number;
  totalVendors: number;
  totalWholesalers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingVendors: number;
  pendingWholesalers: number;
}

// Vendor Dashboard Types
export interface VendorDashboard {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  averageOrderValue: number;
}

// Wholesaler Dashboard Types
export interface WholesalerDashboard {
  totalSales: number;
  totalOrders: number;
  creditLimit: number;
  creditUsed: number;
  rfqCount: number;
  acceptedCount: number;
  conversionRate: number;
}

// Order status colors
export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  paid: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-orange-100 text-orange-800",
};

// Vendor Status Colors
export const VENDOR_STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  suspended: "bg-red-100 text-red-800",
  rejected: "bg-gray-100 text-gray-800",
};

// RFQ Status Colors
export const RFQ_STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  quoted: "bg-blue-100 text-blue-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  expired: "bg-gray-100 text-gray-800",
};
