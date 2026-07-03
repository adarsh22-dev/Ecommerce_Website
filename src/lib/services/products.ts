import { createClient } from "@/lib/supabase/client";
import type { ProductFilters, SortOption } from "@/lib/types";

const fallbackCategories = [
  { id: "cat-001", name: "Engine & Drivetrain", slug: "engine-drivetrain", description: "Engine components and drivetrain parts", image_url: null, parent_id: null, sort_order: 1, created_at: new Date().toISOString() },
  { id: "cat-002", name: "Brakes & Suspension", slug: "brakes-suspension", description: "Brake pads, rotors, and suspension parts", image_url: null, parent_id: null, sort_order: 2, created_at: new Date().toISOString() },
  { id: "cat-003", name: "Electrical & Lighting", slug: "electrical-lighting", description: "Auto electrical components and lighting", image_url: null, parent_id: null, sort_order: 3, created_at: new Date().toISOString() },
];

const fallbackProducts = [
  {
    id: "prod-001",
    title: "Diesel Engine Cylinder Head Assembly",
    slug: "diesel-engine-cylinder-head-assembly",
    description: "Premium cast iron cylinder head compatible with Tata Motors BS6 engines. CNC-machined valve guides and seats for optimal compression.",
    category_id: "cat-001",
    vendor_id: null,
    price: 28500,
    sale_price: 24999,
    sale_start: null,
    sale_end: null,
    sku: "ENG-CH-001",
    stock_quantity: 15,
    track_inventory: true,
    allow_backorders: false,
    status: "active",
    meta_title: null,
    meta_description: null,
    og_image_url: null,
    tags: ["engine", "cylinder-head", "tata", "diesel"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    product_images: [{ id: "img-001", product_id: "prod-001", image_url: "/images/products/product-1.jpg", sort_order: 1, alt_text: null }],
    category: fallbackCategories[0],
    product_variants: [],
  },
  {
    id: "prod-002",
    title: "Heavy-Duty Brake Disc Rotor Set",
    slug: "heavy-duty-brake-disc-rotor-set",
    description: "Vented brake rotors for commercial trucks and buses. High-carbon alloy with anti-corrosion coating.",
    category_id: "cat-002",
    vendor_id: null,
    price: 18500,
    sale_price: 15999,
    sale_start: null,
    sale_end: null,
    sku: "BRK-DSC-002",
    stock_quantity: 30,
    track_inventory: true,
    allow_backorders: false,
    status: "active",
    meta_title: null,
    meta_description: null,
    og_image_url: null,
    tags: ["brakes", "rotors", "commercial", "truck"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    product_images: [{ id: "img-002", product_id: "prod-002", image_url: "/images/products/product-2.jpg", sort_order: 1, alt_text: null }],
    category: fallbackCategories[1],
    product_variants: [],
  },
  {
    id: "prod-003",
    title: "LED Headlight Assembly Kit",
    slug: "led-headlight-assembly-kit",
    description: "High-lumen LED headlight assembly for heavy vehicles. IP67 rated with integrated daytime running lights.",
    category_id: "cat-003",
    vendor_id: null,
    price: 12500,
    sale_price: 9999,
    sale_start: null,
    sale_end: null,
    sku: "ELC-LED-003",
    stock_quantity: 50,
    track_inventory: true,
    allow_backorders: false,
    status: "active",
    meta_title: null,
    meta_description: null,
    og_image_url: null,
    tags: ["lighting", "led", "headlight", "truck"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    product_images: [{ id: "img-003", product_id: "prod-003", image_url: "/images/products/product-3.jpg", sort_order: 1, alt_text: null }],
    category: fallbackCategories[2],
    product_variants: [],
  },
];

function getSupabase() {
  const allowLiveSupabase = process.env.NEXT_PUBLIC_ENABLE_SUPABASE_DATA === "true";
  if (!allowLiveSupabase) {
    return null as any;
  }
  return createClient();
}

function getFallbackProductsData(filters: ProductFilters = {}) {
  let items = [...fallbackProducts];

  if (filters.category) {
    items = items.filter((product) => product.category_id === filters.category);
  }
  if (filters.minPrice !== undefined) {
    items = items.filter((product) => product.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    items = items.filter((product) => product.price <= filters.maxPrice!);
  }
  if (filters.search) {
    const term = filters.search.toLowerCase();
    items = items.filter((product) =>
      product.title.toLowerCase().includes(term) || product.description?.toLowerCase().includes(term)
    );
  }
  if (filters.inStock) {
    items = items.filter((product) => product.stock_quantity > 0);
  }

  switch (filters.sort as SortOption) {
    case "price-asc":
      items.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      items.sort((a, b) => b.price - a.price);
      break;
    case "newest":
    case "best-selling":
    case "rating":
    default:
      items.sort((a, b) => Number(new Date(b.created_at)) - Number(new Date(a.created_at)));
  }

  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const from = (page - 1) * limit;
  const to = from + limit;

  return { products: items.slice(from, to), total: items.length };
}

function getFallbackCategoryBySlug(slug: string) {
  return fallbackCategories.find((category) => category.slug === slug) || null;
}

function getFallbackProductBySlug(slug: string) {
  return fallbackProducts.find((product) => product.slug === slug) || null;
}

function getFallbackProductById(id: string) {
  return fallbackProducts.find((product) => product.id === id) || null;
}

function getFallbackCategories() {
  return fallbackCategories;
}

function getLocalStorageKey(tableName: string) {
  return `ecom:${tableName}:imported`;
}

function readLocalImportedRecords(tableName: string) {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(getLocalStorageKey(tableName));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLocalImportedRecords(tableName: string, records: any[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(getLocalStorageKey(tableName), JSON.stringify(records));
}

function getDeletedKey(tableName: string) {
  return `ecom:${tableName}:deleted`;
}

function readLocalDeletedRecords(tableName: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(getDeletedKey(tableName));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLocalDeletedRecords(tableName: string, ids: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(getDeletedKey(tableName), JSON.stringify(ids));
}

export function deleteLocalRecord(tableName: string, id: string) {
  const deleted = readLocalDeletedRecords(tableName);
  if (!deleted.includes(id)) {
    deleted.push(id);
    writeLocalDeletedRecords(tableName, deleted);
  }
  // Also remove from imported records if present
  const imported = readLocalImportedRecords(tableName);
  const filtered = imported.filter((r: any) => r.id !== id);
  if (filtered.length !== imported.length) {
    writeLocalImportedRecords(tableName, filtered);
  }
}

function filterDeletedRecords<T extends { id: string }>(tableName: string, records: T[]): T[] {
  const deleted = readLocalDeletedRecords(tableName);
  if (deleted.length === 0) return records;
  return records.filter((r) => !deleted.includes(r.id));
}

export async function importCsvRecords(tableName: string, rows: Record<string, any>[]) {
  const importedRows = [...readLocalImportedRecords(tableName)];
  const normalizedRows = rows.map((row) => ({ ...row }));

  for (const row of normalizedRows) {
    if (tableName === "categories") {
      const category = {
        id: `local-cat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: row.name || "Imported Category",
        slug: row.slug || (row.name || "imported-category").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        description: row.description || row.meta_description || null,
        image_url: row.image_url || null,
        parent_id: row.parent_id || null,
        sort_order: Number(row.sort_order || importedRows.length + 1),
        created_at: new Date().toISOString(),
      };
      importedRows.push(category);
    }

    if (tableName === "products") {
      const product = {
        id: `local-prod-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title: row.title || row.name || "Imported Product",
        slug: row.slug || (row.title || row.name || "imported-product").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        description: row.description || null,
        category_id: row.category_id || null,
        vendor_id: row.vendor_id || null,
        price: Number(row.price || 0),
        sale_price: Number(row.sale_price || row.price || 0),
        sku: row.sku || `SKU-${importedRows.length + 1}`,
        stock_quantity: Number(row.stock_quantity || 0),
        track_inventory: row.track_inventory !== "false",
        allow_backorders: row.allow_backorders === "true",
        status: row.status || "active",
        tags: row.tags ? String(row.tags).split(",") : [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        product_images: [],
        category: null,
        product_variants: [],
      };
      importedRows.push(product);
    }
  }

  writeLocalImportedRecords(tableName, importedRows);

  return {
    successCount: normalizedRows.length,
    errorCount: 0,
  };
}

export async function getProducts(filters: ProductFilters = {}) {
  const supabase = getSupabase();
  if (!supabase) {
    const localProducts = readLocalImportedRecords("products") as any[];
    const mergedProducts = filterDeletedRecords("products", [...fallbackProducts, ...localProducts]);
    const items = mergedProducts.filter((product) => product.status !== "draft");
    const filtered = items.filter((product) => {
      if (filters.category) {
        return product.category_id === filters.category;
      }
      return true;
    }).filter((product) => {
      if (filters.minPrice !== undefined) {
        return product.price >= filters.minPrice!;
      }
      return true;
    }).filter((product) => {
      if (filters.maxPrice !== undefined) {
        return product.price <= filters.maxPrice!;
      }
      return true;
    }).filter((product) => {
      if (filters.search) {
        const term = filters.search.toLowerCase();
        return product.title.toLowerCase().includes(term) || product.description?.toLowerCase().includes(term);
      }
      return true;
    }).filter((product) => {
      if (filters.inStock) {
        return product.stock_quantity > 0;
      }
      return true;
    });

    const sorted = [...filtered].sort((a, b) => {
      switch (filters.sort as SortOption) {
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "newest":
        case "best-selling":
        case "rating":
        default: return Number(new Date(b.created_at)) - Number(new Date(a.created_at));
      }
    });

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const from = (page - 1) * limit;
    const to = from + limit;

    return { products: sorted.slice(from, to), total: sorted.length };
  }

  let query = supabase
    .from("products")
    .select(
      `
      *,
      product_images(*),
      category:categories(*),
      product_variants(*)
    `
    )
    .eq("status", "active");

  if (filters.category) {
    query = query.eq("category_id", filters.category);
  }
  if (filters.minPrice !== undefined) {
    query = query.gte("price", filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    query = query.lte("price", filters.maxPrice);
  }
  if (filters.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,tags.cs.{${filters.search}}`
    );
  }
  if (filters.inStock) {
    query = query.gt("stock_quantity", 0);
  }

  // Sorting
  switch (filters.sort as SortOption) {
    case "price-asc":
      query = query.order("price", { ascending: true });
      break;
    case "price-desc":
      query = query.order("price", { ascending: false });
      break;
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    case "best-selling":
      query = query.order("created_at", { ascending: false });
      break;
    case "rating":
      query = query.order("created_at", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error("getProducts failed", error);
    const localProducts = readLocalImportedRecords("products") as any[];
    const mergedProducts = [...fallbackProducts, ...localProducts];
    const items = mergedProducts.filter((product) => product.status !== "draft");
    const filtered = items.filter((product) => {
      if (filters.category) {
        return product.category_id === filters.category;
      }
      return true;
    }).filter((product) => {
      if (filters.minPrice !== undefined) {
        return product.price >= filters.minPrice!;
      }
      return true;
    }).filter((product) => {
      if (filters.maxPrice !== undefined) {
        return product.price <= filters.maxPrice!;
      }
      return true;
    }).filter((product) => {
      if (filters.search) {
        const term = filters.search.toLowerCase();
        return product.title.toLowerCase().includes(term) || product.description?.toLowerCase().includes(term);
      }
      return true;
    }).filter((product) => {
      if (filters.inStock) {
        return product.stock_quantity > 0;
      }
      return true;
    });

    const sorted = [...filtered].sort((a, b) => {
      switch (filters.sort as SortOption) {
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "newest":
        case "best-selling":
        case "rating":
        default: return Number(new Date(b.created_at)) - Number(new Date(a.created_at));
      }
    });

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const from = (page - 1) * limit;
    const to = from + limit;

    return { products: sorted.slice(from, to), total: sorted.length };
  }

  return { products: data || [], total: count || data?.length || 0 };
}

export async function getProductBySlug(slug: string) {
  const supabase = getSupabase();
  if (!supabase) return getFallbackProductBySlug(slug);

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      product_images(*),
      product_options(
        *,
        product_option_values(*)
      ),
      product_variants(*),
      category:categories(*)
    `
    )
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (error) {
    console.error("getProductBySlug failed", error);
    return getFallbackProductBySlug(slug);
  }
  return data;
}

export async function getProductById(id: string) {
  const supabase = getSupabase();
  if (!supabase) return getFallbackProductById(id);

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      product_images(*),
      product_options(
        *,
        product_option_values(*)
      ),
      product_variants(*),
      category:categories(*)
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("getProductById failed", error);
    return getFallbackProductById(id);
  }
  return data;
}

export async function getProductReviews(
  productId: string,
  page: number = 1,
  limit: number = 10
) {
  const supabase = getSupabase();
  if (!supabase) return { reviews: [], total: 0 };

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from("reviews")
    .select("*, profiles(full_name, avatar_url)", { count: "exact" })
    .eq("product_id", productId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("getProductReviews failed", error);
    return { reviews: [], total: 0 };
  }
  return { reviews: data || [], total: count || 0 };
}

export async function getCategories() {
  const supabase = getSupabase();
  if (!supabase) {
    const localCategories = readLocalImportedRecords("categories");
    return filterDeletedRecords("categories", [...getFallbackCategories(), ...localCategories]);
  }

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getCategories failed", error);
    const localCategories = readLocalImportedRecords("categories");
    return filterDeletedRecords("categories", [...getFallbackCategories(), ...localCategories]);
  }
  const localCategories = readLocalImportedRecords("categories");
  return filterDeletedRecords("categories", [...(data || []), ...localCategories]);
}

export async function getCategoryBySlug(slug: string) {
  const supabase = getSupabase();
  if (!supabase) return getFallbackCategoryBySlug(slug);

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("getCategoryBySlug failed", error);
    return getFallbackCategoryBySlug(slug);
  }
  return data;
}

export async function getFeaturedProducts(limit: number = 8) {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*), category:categories(*)")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function getNewArrivals(limit: number = 8) {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*), category:categories(*)")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function getHeroSlides() {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("hero_slides")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getSiteSettings() {
  const supabase = getSupabase();
  if (!supabase) {
    return {
      site_name: "ECOM",
      tagline: "Premium Shopping Experience",
      logo_url: null,
      logo_inverted_url: null,
      currency_code: "USD",
      currency_symbol: "$",
      tax_rate: 0,
      tax_inclusive: false,
      announcement_bar_active: false,
      announcement_bar_text: null,
      announcement_bar_link: null,
      announcement_bar_color: null,
      social_instagram: null,
      social_facebook: null,
      social_twitter: null,
      social_tiktok: null,
      social_youtube: null,
    };
  }

  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .single();

  if (error) {
    // Return defaults if no settings exist
    return {
      site_name: "ECOM",
      tagline: "Premium Shopping Experience",
      logo_url: null,
      logo_inverted_url: null,
      currency_code: "USD",
      currency_symbol: "$",
      tax_rate: 0,
      tax_inclusive: false,
      announcement_bar_active: false,
      announcement_bar_text: null,
      announcement_bar_link: null,
      announcement_bar_color: null,
      social_instagram: null,
      social_facebook: null,
      social_twitter: null,
      social_tiktok: null,
      social_youtube: null,
    };
  }
  return data;
}

export async function subscribeToNewsletter(email: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase
    .from("subscribers")
    .insert({ email })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return { success: true, message: "You're already subscribed!" };
    }
    throw error;
  }
  return { success: true, message: "Successfully subscribed!" };
}

export async function getRelatedProducts(
  categoryId: string,
  productId: string,
  limit: number = 4
) {
  const supabase = getSupabase();
  if (!supabase) {
    const localProducts = readLocalImportedRecords("products") as any[];
    const merged = filterDeletedRecords("products", [...fallbackProducts, ...localProducts]);
    return merged
      .filter((p) => p.category_id === categoryId && p.id !== productId && p.status !== "draft")
      .slice(0, limit);
  }

  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*), category:categories(*)")
    .eq("status", "active")
    .eq("category_id", categoryId)
    .neq("id", productId)
    .limit(limit);

  if (error) {
    console.error("getRelatedProducts failed", error);
    const localProducts = readLocalImportedRecords("products") as any[];
    const merged = filterDeletedRecords("products", [...fallbackProducts, ...localProducts]);
    return merged
      .filter((p) => p.category_id === categoryId && p.id !== productId && p.status !== "draft")
      .slice(0, limit);
  }
  return data;
}

export function getCrossSellProducts(
  productId: string,
  limit: number = 4
) {
  const localProducts = readLocalImportedRecords("products") as any[];
  const merged = filterDeletedRecords("products", [...fallbackProducts, ...localProducts]);
  return merged
    .filter((p) => p.id !== productId && p.status !== "draft")
    .sort(() => Math.random() - 0.5)
    .slice(0, limit);
}
