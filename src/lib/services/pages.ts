import { createClient } from "@/lib/supabase/client";
import type { CustomPage, MenuItem } from "@/lib/types";

function getSupabase() {
  return createClient();
}

export async function getCustomPages(status?: "draft" | "published") {
  const supabase = getSupabase();
  if (!supabase) return [];

  let query = supabase.from("custom_pages").select("*").order("sort_order", { ascending: true });
  if (status) query = query.eq("status", status);
  const { data } = await query;
  return (data || []) as CustomPage[];
}

export async function getCustomPageBySlug(slug: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const { data } = await supabase
    .from("custom_pages")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  return data as CustomPage | null;
}

export async function saveCustomPage(page: Partial<CustomPage> & { id?: string }) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  if (page.id) {
    const { error } = await supabase.from("custom_pages").update(page).eq("id", page.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("custom_pages").insert(page);
    if (error) throw error;
  }
}

export async function deleteCustomPage(id: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");
  const { error } = await supabase.from("custom_pages").delete().eq("id", id);
  if (error) throw error;
}

export async function getMenuItems() {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data } = await supabase.from("menu_items").select("*").order("sort_order", { ascending: true });
  const items = (data || []) as MenuItem[];

  // Build tree structure
  const map = new Map<string, MenuItem & { children: MenuItem[] }>();
  const roots: (MenuItem & { children: MenuItem[] })[] = [];

  for (const item of items) {
    map.set(item.id, { ...item, children: [] });
  }

  for (const item of items) {
    const node = map.get(item.id)!;
    if (item.parent_id && map.has(item.parent_id)) {
      map.get(item.parent_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

export async function saveMenuItem(item: Partial<MenuItem> & { id?: string }) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  if (item.id) {
    const { error } = await supabase.from("menu_items").update(item).eq("id", item.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("menu_items").insert(item);
    if (error) throw error;
  }
}

export async function deleteMenuItem(id: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) throw error;
}

export async function getFooterPages() {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data } = await supabase
    .from("custom_pages")
    .select("*")
    .eq("status", "published")
    .eq("show_in_footer", true)
    .order("sort_order", { ascending: true });
  return (data || []) as CustomPage[];
}
