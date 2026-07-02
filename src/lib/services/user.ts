import { createClient } from "@/lib/supabase/client";
import type { Address, Order, OrderWithDetails, Profile } from "@/lib/types";

function getSupabase() {
  return createClient();
}

// Profile
export async function getProfile(userId: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function updateProfile(
  userId: string,
  updates: Partial<Profile>
) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Addresses
export async function getAddresses(userId: string) {
  const supabase = getSupabase();
  if (!supabase) return [] as Address[];

  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", userId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Address[];
}

export async function createAddress(
  address: Omit<Address, "id" | "created_at">
) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase
    .from("addresses")
    .insert(address)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateAddress(
  id: string,
  updates: Partial<Address>
) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase
    .from("addresses")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteAddress(id: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase.from("addresses").delete().eq("id", id);
  if (error) throw error;
}

// Orders
export async function getOrders(userId: string, page: number = 1) {
  const supabase = getSupabase();
  if (!supabase) return { orders: [] as OrderWithDetails[], total: 0 };

  const limit = 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from("orders")
    .select("*, order_items(*, product_images(*))", { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { orders: data as OrderWithDetails[], total: count || 0 };
}

export async function getOrderById(orderId: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase
    .from("orders")
    .select(
      "*, order_items(*, product_images(*)), order_timeline(*, profiles(full_name, avatar_url))"
    )
    .eq("id", orderId)
    .single();

  if (error) throw error;
  return data as OrderWithDetails;
}

// Wishlist
export async function getWishlist(userId: string) {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("wishlist")
    .select(
      "*, products(*, product_images(*), category:categories(*))"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function addToWishlist(userId: string, productId: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase
    .from("wishlist")
    .insert({ user_id: userId, product_id: productId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeFromWishlist(userId: string, productId: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase
    .from("wishlist")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);

  if (error) throw error;
}

export async function isInWishlist(userId: string, productId: string) {
  const supabase = getSupabase();
  if (!supabase) return false;

  const { data, error } = await supabase
    .from("wishlist")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return !!data;
}
