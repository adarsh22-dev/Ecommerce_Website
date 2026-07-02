import { createClient } from "@/lib/supabase/client";
import type {
  Coupon,
  Order,
  OrderWithDetails,
  Product,
  ProductImage,
  Review,
} from "@/lib/types";

function getSupabase() {
  return createClient();
}

// Admin Orders
export async function adminGetOrders(params: {
  page?: number;
  status?: string;
  paymentStatus?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}) {
  const supabase = getSupabase();
  if (!supabase) return { orders: [] as OrderWithDetails[], total: 0 };

  let query = supabase
    .from("orders")
    .select("*, order_items(*), profiles(full_name, email)", {
      count: "exact",
    })
    .order("created_at", { ascending: false });

  if (params.status) {
    query = query.eq("fulfillment_status", params.status);
  }
  if (params.paymentStatus) {
    query = query.eq("payment_status", params.paymentStatus);
  }
  if (params.search) {
    query = query.or(
      `order_number.ilike.%${params.search}%,email.ilike.%${params.search}%`
    );
  }
  if (params.dateFrom) {
    query = query.gte("created_at", params.dateFrom);
  }
  if (params.dateTo) {
    query = query.lte("created_at", params.dateTo);
  }

  const page = params.page || 1;
  const limit = 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) throw error;
  return { orders: data as OrderWithDetails[], total: count || 0 };
}

export async function adminUpdateOrderStatus(
  orderId: string,
  status: Order["fulfillment_status"],
  note?: string,
  userId?: string
) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const { error: updateError } = await supabase
    .from("orders")
    .update({
      fulfillment_status: status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (updateError) throw updateError;

  const { error: timelineError } = await supabase
    .from("order_timeline")
    .insert({
      order_id: orderId,
      status,
      note: note || `Status updated to ${status}`,
      created_by: userId,
    });

  if (timelineError) throw timelineError;
}

export async function adminUpdateOrderShipping(
  orderId: string,
  trackingNumber: string,
  carrier: string
) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase
    .from("orders")
    .update({
      tracking_number: trackingNumber,
      tracking_carrier: carrier,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (error) throw error;
}

// Admin Products
export async function adminGetProducts(params: {
  page?: number;
  status?: string;
  search?: string;
  categoryId?: string;
}) {
  const supabase = getSupabase();
  if (!supabase) return { products: [], total: 0 };

  let query = supabase
    .from("products")
    .select("*, product_images(*), category:categories(name)", {
      count: "exact",
    })
    .order("created_at", { ascending: false });

  if (params.status) {
    query = query.eq("status", params.status);
  }
  if (params.search) {
    query = query.or(
      `title.ilike.%${params.search}%,sku.ilike.%${params.search}%`
    );
  }
  if (params.categoryId) {
    query = query.eq("category_id", params.categoryId);
  }

  const page = params.page || 1;
  const limit = 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) throw error;
  return { products: data, total: count || 0 };
}

export async function adminCreateProduct(
  product: Omit<Product, "id" | "created_at" | "updated_at">
) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function adminUpdateProduct(
  id: string,
  updates: Partial<Product>
) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase
    .from("products")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function adminDeleteProduct(id: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function adminAddProductImage(
  image: Omit<ProductImage, "id">
) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase
    .from("product_images")
    .insert(image)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function adminDeleteProductImage(id: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase.from("product_images").delete().eq("id", id);
  if (error) throw error;
}

// Admin Customers
export async function adminGetCustomers(params: {
  page?: number;
  search?: string;
}) {
  const supabase = getSupabase();
  if (!supabase) return { customers: [], total: 0 };

  let query = supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .eq("role", "customer")
    .order("created_at", { ascending: false });

  if (params.search) {
    query = query.or(
      `full_name.ilike.%${params.search}%,email.ilike.%${params.search}%`
    );
  }

  const page = params.page || 1;
  const limit = 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) throw error;
  return { customers: data, total: count || 0 };
}

// Admin Coupons
export async function adminGetCoupons() {
  const supabase = getSupabase();
  if (!supabase) return [] as Coupon[];

  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Coupon[];
}

export async function adminCreateCoupon(
  coupon: Omit<Coupon, "id" | "created_at" | "times_used">
) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase
    .from("coupons")
    .insert({ ...coupon, times_used: 0 })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function adminUpdateCoupon(
  id: string,
  updates: Partial<Coupon>
) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase
    .from("coupons")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function adminDeleteCoupon(id: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase.from("coupons").delete().eq("id", id);
  if (error) throw error;
}

// Admin Categories
export async function adminGetCategories() {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data;
}

export async function adminCreateCategory(
  category: Omit<import("@/lib/types").Category, "id" | "created_at">
) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase
    .from("categories")
    .insert(category)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function adminUpdateCategory(
  id: string,
  updates: Partial<import("@/lib/types").Category>
) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase
    .from("categories")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function adminDeleteCategory(id: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}

// Admin Settings
export async function adminGetSiteSettings() {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
}

export async function adminUpdateSiteSettings(
  settings: Partial<import("@/lib/types").SiteSettings>
) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const existing = await adminGetSiteSettings();

  if (existing) {
    const { data, error } = await supabase
      .from("site_settings")
      .update({ ...settings, updated_at: new Date().toISOString() })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from("site_settings")
      .insert({
        ...settings,
        id: "1",
        site_name: settings.site_name || "ECOM",
        currency_code: settings.currency_code || "USD",
        currency_symbol: settings.currency_symbol || "$",
        tax_rate: settings.tax_rate || 0,
        tax_inclusive: settings.tax_inclusive || false,
        announcement_bar_active: settings.announcement_bar_active || false,
        updated_at: new Date().toISOString(),
      } as import("@/lib/types").SiteSettings)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

// Admin Analytics
export async function adminGetDashboardStats() {
  const supabase = getSupabase();
  if (!supabase) {
    return {
      totalRevenue: 0,
      totalOrders: 0,
      totalCustomers: 0,
      avgOrderValue: 0,
      revenueChange: 0,
      lowStockProducts: [],
      recentOrders: [],
    };
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  // Current period stats
  const [orders, customers, products] = await Promise.all([
    supabase
      .from("orders")
      .select("total, created_at", { count: "exact" })
      .gte("created_at", thirtyDaysAgo.toISOString()),
    supabase
      .from("profiles")
      .select("id", { count: "exact" })
      .eq("role", "customer"),
    supabase
      .from("products")
      .select("id, stock_quantity", { count: "exact" }),
  ]);

  // Previous period stats
  const { data: prevOrders } = await supabase
    .from("orders")
    .select("total")
    .gte("created_at", sixtyDaysAgo.toISOString())
    .lt("created_at", thirtyDaysAgo.toISOString());

  const currentRevenue =
    orders.data?.reduce((sum: number, o: { total?: number }) => sum + (o.total || 0), 0) || 0;
  const prevRevenue =
    prevOrders?.reduce((sum: number, o: { total?: number }) => sum + (o.total || 0), 0) || 0;
  const revenueChange =
    prevRevenue > 0
      ? ((currentRevenue - prevRevenue) / prevRevenue) * 100
      : 0;

  const lowStockProducts =
    products.data?.filter(
      (p: { stock_quantity: number }) => p.stock_quantity <= 10 && p.stock_quantity > 0
    ) || [];

  return {
    totalRevenue: currentRevenue,
    totalOrders: orders.count || 0,
    totalCustomers: customers.count || 0,
    avgOrderValue:
      (orders.count || 0) > 0 ? currentRevenue / (orders.count || 1) : 0,
    revenueChange,
    lowStockProducts,
    recentOrders: orders.data?.slice(0, 10) || [],
  };
}

export async function adminGetRevenueChart(period: "7d" | "30d" | "90d" | "1y") {
  const supabase = getSupabase();
  if (!supabase) return [];

  const now = new Date();
  let startDate: Date;

  switch (period) {
    case "7d":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "30d":
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case "90d":
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case "1y":
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
  }

  const { data, error } = await supabase
    .from("orders")
    .select("total, created_at")
    .gte("created_at", startDate!.toISOString())
    .order("created_at", { ascending: true });

  if (error) throw error;

  // Group by date
  const grouped: Record<string, number> = {};
  data?.forEach((order: { created_at: string; total?: number }) => {
    const date = new Date(order.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    grouped[date] = (grouped[date] || 0) + (order.total || 0);
  });

  return Object.entries(grouped).map(([date, revenue]) => ({
    date,
    revenue,
  }));
}

// Admin Reviews
export async function adminGetReviews(params: { page?: number }) {
  const supabase = getSupabase();
  if (!supabase) return { reviews: [], total: 0 };

  const page = params.page || 1;
  const limit = 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from("reviews")
    .select("*, profiles(full_name, email), products(title)", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { reviews: data, total: count || 0 };
}

export async function adminDeleteReview(id: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) throw error;
}

// Coupon validation
export async function validateCoupon(
  code: string,
  orderTotal: number,
  userId: string
) {
  const supabase = getSupabase();
  if (!supabase) return { valid: false, error: "Supabase not configured" };

  const { data: coupon, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", code.toUpperCase())
    .eq("is_active", true)
    .single();

  if (error || !coupon) {
    return { valid: false, error: "Invalid coupon code" };
  }

  const now = new Date();
  if (coupon.valid_from && new Date(coupon.valid_from) > now) {
    return { valid: false, error: "Coupon is not yet active" };
  }
  if (coupon.valid_to && new Date(coupon.valid_to) < now) {
    return { valid: false, error: "Coupon has expired" };
  }
  if (coupon.usage_limit && coupon.times_used >= coupon.usage_limit) {
    return { valid: false, error: "Coupon usage limit reached" };
  }
  if (coupon.min_order_amount && orderTotal < coupon.min_order_amount) {
    return {
      valid: false,
      error: `Minimum order amount is $${coupon.min_order_amount}`,
    };
  }

  const discount =
    coupon.type === "percentage"
      ? (orderTotal * coupon.value) / 100
      : coupon.value;

  return {
    valid: true,
    coupon,
    discount: Math.min(discount, orderTotal),
  };
}
