import { createClient } from "@/lib/supabase/client";
import type { HomepageSection } from "@/lib/types";

function getSupabase() {
  const allowLive = process.env.NEXT_PUBLIC_ENABLE_SUPABASE_DATA === "true";
  if (!allowLive) return null;
  return createClient();
}

export async function getHomepageSections() {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("homepage_sections")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data as HomepageSection[];
}

export async function adminGetHomepageSections() {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase
    .from("homepage_sections")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data as HomepageSection[];
}

export async function adminCreateHomepageSection(
  section: Omit<HomepageSection, "id" | "created_at" | "updated_at">
) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase
    .from("homepage_sections")
    .insert(section)
    .select()
    .single();

  if (error) throw error;
  return data as HomepageSection;
}

export async function adminUpdateHomepageSection(
  id: string,
  updates: Partial<HomepageSection>
) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase
    .from("homepage_sections")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as HomepageSection;
}

export async function adminDeleteHomepageSection(id: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase
    .from("homepage_sections")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function adminReorderHomepageSections(
  orderedIds: string[]
) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const updates = orderedIds.map((id, index) => ({
    id,
    sort_order: index,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from("homepage_sections")
    .upsert(updates);

  if (error) throw error;
}
