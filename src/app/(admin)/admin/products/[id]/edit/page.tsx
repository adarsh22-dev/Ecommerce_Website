"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Save, Send, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { ProductContentForm } from "@/components/admin/product-content-form";
import { getProductById } from "@/lib/services/products";
import { getProductMediaForSlug } from "@/lib/services/product-content";
import toast from "react-hot-toast";
import type { Category, ProductWithDetails } from "@/lib/types";

export default function AdminProductEditPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<ProductWithDetails | null>(null);
  const [slug, setSlug] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<Array<{ video_url: string; thumbnail_url?: string | null; title?: string | null; description?: string | null }>>([]);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    price: "",
    sale_price: "",
    sale_start: "",
    sale_end: "",
    sku: "",
    stock_quantity: "0",
    track_inventory: true,
    allow_backorders: false,
    category_id: "",
    tags: "",
    meta_title: "",
    meta_description: "",
    status: "draft" as "draft" | "active",
  });

  useEffect(() => {
    (async () => {
      try {
        const { getCategories } = await import("@/lib/services/products");
        const cats = await getCategories();
        setCategories(cats);
      } catch {}
    })();
  }, []);

  useEffect(() => {
    async function load() {
      const id = params.id as string;
      const p = await getProductById(id) as ProductWithDetails | null;
      if (!p) {
        toast.error("Product not found");
        router.push("/admin/products");
        return;
      }
      setProduct(p);
      setSlug(p.slug);
      setImages((p.product_images || []).map((img: any) => img.image_url));
      try {
        const media = await getProductMediaForSlug(p.slug);
        setVideos(media?.videos ?? []);
      } catch {}
      setForm({
        title: p.title,
        slug: p.slug,
        description: p.description || "",
        price: String(p.price),
        sale_price: p.sale_price ? String(p.sale_price) : "",
        sale_start: p.sale_start ? p.sale_start.slice(0, 10) : "",
        sale_end: p.sale_end ? p.sale_end.slice(0, 10) : "",
        sku: p.sku,
        stock_quantity: String(p.stock_quantity),
        track_inventory: p.track_inventory,
        allow_backorders: p.allow_backorders,
        category_id: p.category_id || "",
        tags: (p.tags || []).join(", "),
        meta_title: p.meta_title || "",
        meta_description: p.meta_description || "",
        status: p.status,
      });
      setLoading(false);
    }
    load();
  }, [params.id, router]);

  const handleUpdate = async (status: "draft" | "active") => {
    if (!form.title || !form.price || !form.sku) {
      toast.error("Title, price, and SKU are required");
      return;
    }
    setSaving(true);
    try {
      const supabase = (await import("@/lib/supabase/client")).createClient();
      const { error } = await supabase
        .from("products")
        .update({
          title: form.title,
          slug: form.slug,
          description: form.description || null,
          price: parseFloat(form.price),
          sale_price: form.sale_price ? parseFloat(form.sale_price) : null,
          sale_start: form.sale_start || null,
          sale_end: form.sale_end || null,
          sku: form.sku,
          stock_quantity: parseInt(form.stock_quantity) || 0,
          track_inventory: form.track_inventory,
          allow_backorders: form.allow_backorders,
          category_id: form.category_id || null,
          tags: form.tags ? form.tags.split(",").map((t: string) => t.trim()) : [],
          meta_title: form.meta_title || null,
          meta_description: form.meta_description || null,
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", params.id);

      if (error) {
        if (error.code === "PGRST116") {
          toast.success(status === "active" ? "Product updated! (mock data)" : "Saved as draft (mock data)");
          router.push("/admin/products");
          return;
        }
        throw error;
      }
      toast.success(status === "active" ? "Product updated!" : "Saved as draft");
      router.push("/admin/products");
    } catch (e: any) {
      toast.error(e?.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-foreground-secondary">Product not found</p>
        <Link href="/admin/products"><Button variant="secondary" className="mt-4">Back to products</Button></Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/admin/products" className="flex items-center gap-1 text-sm text-foreground-secondary hover:text-foreground mb-2 transition-colors w-fit">
            <ChevronLeft className="w-4 h-4" /> Products
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Edit: {product.title}</h1>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => handleUpdate("draft")}
            loading={saving}
          >
            <Save className="w-4 h-4" /> Save as Draft
          </Button>
          <Button
            onClick={() => handleUpdate("active")}
            loading={saving}
            className="shimmer-btn"
          >
            <Send className="w-4 h-4" /> Update & Publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="admin-card p-6">
            <h2 className="font-semibold text-foreground mb-4">Basic Information</h2>
            <div className="space-y-4">
              <Input
                label="Title *"
                placeholder="Product title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <Input
                label="Slug"
                placeholder="url-slug"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
              />
              <Textarea
                label="Description"
                placeholder="Product description (HTML supported)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={5}
              />
            </div>
          </div>

          <div className="admin-card p-6">
            <h2 className="font-semibold text-foreground mb-4">Media</h2>
            <ProductContentForm slug={slug} initialImages={images} initialVideos={videos} />
          </div>

          <div className="admin-card p-6">
            <h2 className="font-semibold text-foreground mb-4">SEO</h2>
            <div className="space-y-4">
              <Input
                label="Meta Title"
                placeholder="SEO title (leave blank to use product title)"
                value={form.meta_title}
                onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
              />
              <Textarea
                label="Meta Description"
                placeholder="SEO description"
                value={form.meta_description}
                onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="admin-card p-6">
            <h2 className="font-semibold text-foreground mb-4">Pricing</h2>
            <div className="space-y-4">
              <Input
                label="Regular Price *"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
              <Input
                label="Sale Price"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={form.sale_price}
                onChange={(e) => setForm({ ...form, sale_price: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Sale Start" type="date" value={form.sale_start} onChange={(e) => setForm({ ...form, sale_start: e.target.value })} />
                <Input label="Sale End" type="date" value={form.sale_end} onChange={(e) => setForm({ ...form, sale_end: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="admin-card p-6">
            <h2 className="font-semibold text-foreground mb-4">Inventory</h2>
            <div className="space-y-4">
              <Input
                label="SKU *"
                placeholder="PRODUCT-001"
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
              />
              <Input
                label="Stock Quantity"
                type="number"
                placeholder="0"
                value={form.stock_quantity}
                onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })}
              />
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.track_inventory}
                  onChange={(e) => setForm({ ...form, track_inventory: e.target.checked })}
                  className="rounded border-border accent-primary"
                />
                <span className="text-sm text-foreground">Track inventory</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.allow_backorders}
                  onChange={(e) => setForm({ ...form, allow_backorders: e.target.checked })}
                  className="rounded border-border accent-primary"
                />
                <span className="text-sm text-foreground">Allow backorders</span>
              </label>
            </div>
          </div>

          <div className="admin-card p-6">
            <h2 className="font-semibold text-foreground mb-4">Organization</h2>
            <div className="space-y-4">
              <Select
                label="Category"
                placeholder="Select category"
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                options={categories.map((c) => ({
                  label: c.name,
                  value: c.id,
                }))}
              />
              <Input
                label="Tags"
                placeholder="Comma-separated tags"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                hint="e.g. engine, brakes, lighting"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
