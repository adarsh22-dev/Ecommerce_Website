"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, Tag, Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { ImportCsvModal } from "@/components/ui/import-csv-modal";
import toast from "react-hot-toast";
import type { Category } from "@/lib/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<(Category & { product_count?: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [showImport, setShowImport] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const { getCategories } = await import("@/lib/services/products");
      const cats = await getCategories();
      setCategories(cats as Category[]);
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const openCreate = () => {
    setEditingCategory(null);
    setForm({ name: "", slug: "", description: "" });
    setShowModal(true);
  };

  const openEdit = (cat: Category) => {
    setEditingCategory(cat);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || "" });
    setShowModal(true);
  };

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleSave = async () => {
    if (!form.name) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      const supabase = (await import("@/lib/supabase/client")).createClient();
      const slug = form.slug || generateSlug(form.name);
      const data = { name: form.name, slug, description: form.description || null };

      if (editingCategory) {
        const { error } = await supabase.from("categories").update(data).eq("id", editingCategory.id);
        if (error) throw error;
        toast.success("Category updated");
      } else {
        const { error } = await supabase.from("categories").insert(data);
        if (error) throw error;
        toast.success("Category created");
      }
      setShowModal(false);
      fetchCategories();
    } catch (e: any) {
      toast.error(e?.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;
    try {
      const shouldSkipRemoteDelete = deletingCategory.id.startsWith("local-cat-") || deletingCategory.id.startsWith("cat-");
      if (!shouldSkipRemoteDelete) {
        const supabase = (await import("@/lib/supabase/client")).createClient();
        const { error } = await supabase.from("categories").delete().eq("id", deletingCategory.id);
        if (error) throw error;
      }
      setCategories((prev) => prev.filter((category) => category.id !== deletingCategory.id));
      toast.success("Category deleted");
      setShowDeleteModal(false);
      setDeletingCategory(null);
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete category");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Categories</h1>
          <p className="text-sm text-foreground-secondary mt-1">
            {loading ? "Loading..." : `${categories.length} categories`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setShowImport(true)}>
            <Upload className="w-4 h-4" /> Import
          </Button>
          <Button
            variant="secondary"
            onClick={async () => {
              const { exportToCsv } = await import("@/lib/utils");
              exportToCsv(
                categories,
                [
                  { key: "name", label: "Name" },
                  { key: "slug", label: "Slug" },
                  { key: "description", label: "Description" },
                ],
                "categories"
              );
            }}
          >
            <Download className="w-4 h-4" /> Export
          </Button>
          <Button onClick={openCreate}><Plus className="w-4 h-4" /> Add Category</Button>
        </div>
      </div>

      <div className="admin-card overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16">
            <div className="h-12 w-12 mx-auto mb-4 rounded-xl bg-muted flex items-center justify-center">
              <Tag className="w-6 h-6 text-foreground-secondary" />
            </div>
            <p className="text-lg font-medium text-foreground mb-1">No categories yet</p>
            <p className="text-sm text-foreground-secondary mb-6">Organize your products with categories</p>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setShowImport(true)}>
            <Upload className="w-4 h-4" /> Import CSV
          </Button>
          <Button onClick={openCreate}><Plus className="w-4 h-4" /> Add Category</Button>
        </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th className="hidden sm:table-cell">Slug</th>
                  <th className="hidden lg:table-cell">Description</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0">
                          <Tag className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium">{cat.name}</span>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell">
                      <code className="text-xs bg-muted px-2 py-1 rounded text-foreground-secondary">{cat.slug}</code>
                    </td>
                    <td className="hidden lg:table-cell text-sm text-foreground-secondary max-w-xs truncate">
                      {cat.description || "—"}
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(cat)} className="p-2 hover:bg-muted rounded-lg transition-colors">
                          <Edit className="w-4 h-4 text-foreground-secondary" />
                        </button>
                        <button
                          onClick={() => { setDeletingCategory(cat); setShowDeleteModal(true); }}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingCategory ? "Edit Category" : "Add Category"}>
        <div className="space-y-4">
          <Input
            label="Name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value, slug: editingCategory ? form.slug : generateSlug(e.target.value) })}
            placeholder="Category name"
          />
          <Input
            label="Slug"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder="category-slug"
            hint={!form.slug && form.name ? `Will be: ${generateSlug(form.name)}` : ""}
          />
          <Input
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Brief description"
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving} className="shimmer-btn">
              {editingCategory ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Category" size="sm">
        <p className="text-sm text-foreground-secondary mb-2">
          Delete <strong className="text-foreground">{deletingCategory?.name}</strong>?
        </p>
        <p className="text-xs text-destructive mb-6">Products in this category will be uncategorized.</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>

      <ImportCsvModal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        tableName="categories"
        columns={[
          { label: "Name", key: "name", required: true },
          { label: "Slug", key: "slug" },
          { label: "Description", key: "description" },
          { label: "Sort Order", key: "sort_order" },
        ]}
        onSuccess={() => fetchCategories()}
        sampleFile="/categories.csv"
      />
    </div>
  );
}
