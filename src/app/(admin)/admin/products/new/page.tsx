"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Save, Send, ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import toast from "react-hot-toast";
import type { Category } from "@/lib/types";

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
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

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleSave = async (status: "draft" | "active") => {
    if (!form.title || !form.price || !form.sku) {
      toast.error("Title, price, and SKU are required");
      return;
    }
    setSaving(true);
    try {
      const supabase = (await import("@/lib/supabase/client")).createClient();
      const slug = form.slug || generateSlug(form.title);

      const { error } = await supabase.from("products").insert({
        title: form.title,
        slug,
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
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
        meta_title: form.meta_title || null,
        meta_description: form.meta_description || null,
        status,
      });

      if (error) throw error;
      toast.success(status === "active" ? "Product published!" : "Saved as draft");
      router.push("/admin/products");
    } catch (e: any) {
      toast.error(e?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/admin/products" className="flex items-center gap-1 text-sm text-foreground-secondary hover:text-foreground mb-2 transition-colors w-fit">
            <ChevronLeft className="w-4 h-4" /> Products
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Add Product</h1>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => handleSave("draft")}
            loading={saving}
          >
            <Save className="w-4 h-4" /> Save as Draft
          </Button>
          <Button
            onClick={() => handleSave("active")}
            loading={saving}
            className="shimmer-btn"
          >
            <Send className="w-4 h-4" /> Publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
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
                placeholder="auto-generated from title"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                hint={!form.slug && form.title ? `Will be: ${generateSlug(form.title)}` : ""}
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

          {/* Media */}
          <div className="admin-card p-6">
            <h2 className="font-semibold text-foreground mb-4">Media</h2>
            <div className="border-2 border-dashed border-border rounded-xl p-10 text-center hover:border-primary/40 transition-colors cursor-pointer group">
              <div className="h-12 w-12 mx-auto mb-4 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                <ImagePlus className="w-6 h-6 text-foreground-secondary" />
              </div>
              <p className="text-sm font-medium text-foreground">Drop images here or click to upload</p>
              <p className="text-xs text-foreground-secondary mt-1">Up to 10 images, JPG/PNG/WebP</p>
            </div>
          </div>

          {/* SEO */}
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

        {/* Sidebar */}
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
                hint="e.g. new, trending, sale"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
