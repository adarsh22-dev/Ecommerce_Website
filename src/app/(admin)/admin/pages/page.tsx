"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, FileText, Eye, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import toast from "react-hot-toast";
import type { CustomPage } from "@/lib/types";

export default function AdminPagesPage() {
  const [pages, setPages] = useState<CustomPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<CustomPage | null>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    meta_title: "",
    meta_description: "",
    status: "draft" as "draft" | "published",
    show_in_footer: false,
    sort_order: 0,
  });
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState<CustomPage | null>(null);
  const [deleteTab, setDeleteTab] = useState<"content" | "seo" | "preview">("content");

  const fetchPages = useCallback(async () => {
    setLoading(true);
    try {
      const { getCustomPages } = await import("@/lib/services/pages");
      const data = await getCustomPages();
      setPages(data as CustomPage[]);
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPages(); }, [fetchPages]);

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const openCreate = () => {
    setEditing(null);
    setForm({ title: "", slug: "", content: "", meta_title: "", meta_description: "", status: "draft", show_in_footer: false, sort_order: 0 });
    setDeleteTab("content");
    setShowModal(true);
  };

  const openEdit = (page: CustomPage) => {
    setEditing(page);
    setForm({
      title: page.title,
      slug: page.slug,
      content: page.content,
      meta_title: page.meta_title || "",
      meta_description: page.meta_description || "",
      status: page.status,
      show_in_footer: page.show_in_footer,
      sort_order: page.sort_order,
    });
    setDeleteTab("content");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title) { toast.error("Title is required"); return; }
    const slug = form.slug || generateSlug(form.title);
    setSaving(true);
    try {
      const { saveCustomPage } = await import("@/lib/services/pages");
      await saveCustomPage({
        ...(editing ? { id: editing.id } : {}),
        title: form.title,
        slug,
        content: form.content,
        meta_title: form.meta_title || null,
        meta_description: form.meta_description || null,
        status: form.status,
        show_in_footer: form.show_in_footer,
        sort_order: form.sort_order,
      });
      toast.success(editing ? "Page updated" : "Page created");
      setShowModal(false);
      fetchPages();
    } catch (e: any) {
      toast.error(e?.message || "Failed to save page");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!showDelete) return;
    try {
      const { deleteCustomPage } = await import("@/lib/services/pages");
      await deleteCustomPage(showDelete.id);
      toast.success("Page deleted");
      setShowDelete(null);
      fetchPages();
    } catch { toast.error("Failed to delete page"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pages</h1>
          <p className="text-sm text-foreground-secondary mt-1">
            {loading ? "Loading..." : `${pages.length} pages`}
          </p>
        </div>
        <Button onClick={openCreate}><Plus className="w-4 h-4" /> Create Page</Button>
      </div>

      <div className="admin-card overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : pages.length === 0 ? (
          <div className="text-center py-16">
            <div className="h-12 w-12 mx-auto mb-4 rounded-xl bg-muted flex items-center justify-center">
              <FileText className="w-6 h-6 text-foreground-secondary" />
            </div>
            <p className="text-lg font-medium text-foreground mb-1">No pages yet</p>
            <p className="text-sm text-foreground-secondary mb-6">Create custom pages like About, FAQ, or Policies</p>
            <Button onClick={openCreate}><Plus className="w-4 h-4" /> Create Page</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th className="hidden sm:table-cell">Slug</th>
                  <th className="hidden md:table-cell">Status</th>
                  <th className="hidden lg:table-cell">Footer</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page) => (
                  <tr key={page.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium">{page.title}</span>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell">
                      <code className="text-xs bg-muted px-2 py-1 rounded text-foreground-secondary">{page.slug}</code>
                    </td>
                    <td className="hidden md:table-cell">
                      <Badge variant={page.status === "published" ? "success" : "neutral"}>
                        {page.status}
                      </Badge>
                    </td>
                    <td className="hidden lg:table-cell text-sm text-foreground-secondary">
                      {page.show_in_footer ? "Yes" : "No"}
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {page.status === "published" && (
                          <Link href={`/page/${page.slug}`} target="_blank" className="p-2 hover:bg-muted rounded-lg transition-colors">
                            <Eye className="w-4 h-4 text-foreground-secondary" />
                          </Link>
                        )}
                        <button onClick={() => {
                          navigator.clipboard.writeText(`/page/${page.slug}`);
                          toast.success("Link copied");
                        }} className="p-2 hover:bg-muted rounded-lg transition-colors">
                          <Copy className="w-4 h-4 text-foreground-secondary" />
                        </button>
                        <button onClick={() => openEdit(page)} className="p-2 hover:bg-muted rounded-lg transition-colors">
                          <Edit className="w-4 h-4 text-foreground-secondary" />
                        </button>
                        <button onClick={() => setShowDelete(page)} className="p-2 hover:bg-muted rounded-lg transition-colors">
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

      {/* Create/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? "Edit Page" : "Create Page"} size="lg">
        <div className="space-y-5">
          <div className="flex gap-3 border-b border-border pb-3 mb-1">
            {[
              { key: "content", label: "Content" },
              { key: "seo", label: "SEO" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setDeleteTab(tab.key as any)}
                className={`text-sm font-medium pb-3 border-b-2 transition-colors -mb-[13px] ${
                  deleteTab === tab.key
                    ? "border-primary text-primary"
                    : "border-transparent text-foreground-secondary hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {deleteTab === "content" && (
            <div className="space-y-4">
              <Input
                label="Title *"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value, slug: editing ? form.slug : generateSlug(e.target.value) })}
                placeholder="Page title"
              />
              <Input
                label="Slug"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="page-slug"
                hint={!form.slug && form.title ? `Will be: ${generateSlug(form.title)}` : ""}
              />
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Content</label>
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="flex items-center gap-1 px-3 py-2 bg-muted/50 border-b border-border">
                    {["H1", "H2", "H3", "B", "I", "Link", "Img"].map((tag) => (
                      <button
                        key={tag}
                        className="px-2 py-1 text-xs font-medium text-foreground-secondary hover:text-foreground hover:bg-muted rounded transition-colors"
                        title={`Insert ${tag}`}
                        onClick={() => {
                          const templates: Record<string, string> = {
                            H1: "<h1>Heading 1</h1>\n",
                            H2: "<h2>Heading 2</h2>\n",
                            H3: "<h3>Heading 3</h3>\n",
                            B: "<strong>bold text</strong>",
                            I: "<em>italic text</em>",
                            Link: '<a href="https://">link text</a>',
                            Img: '<img src="https://" alt="image" />',
                          };
                          setForm((prev) => ({ ...prev, content: prev.content + templates[tag] }));
                        }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    className="w-full min-h-[300px] p-4 text-sm font-mono text-foreground bg-white outline-none resize-y"
                    placeholder="<h1>Welcome</h1><p>Your content here...</p>"
                  />
                </div>
                <p className="text-xs text-foreground-secondary mt-1.5">
                  Use HTML. Headings, paragraphs, images, and links are supported.
                </p>
              </div>
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as "draft" | "published" })}
                    className="rounded-lg border border-border px-3 py-2 text-sm bg-white"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.show_in_footer}
                    onChange={(e) => setForm({ ...form, show_in_footer: e.target.checked })}
                    className="rounded border-border accent-primary"
                  />
                  <span className="text-sm text-foreground">Show in footer</span>
                </label>
              </div>
            </div>
          )}

          {deleteTab === "seo" && (
            <div className="space-y-4">
              <Input
                label="Meta Title"
                value={form.meta_title}
                onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
                placeholder="Page title | Site Name"
              />
              <Textarea
                label="Meta Description"
                value={form.meta_description}
                onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                placeholder="Brief description for search engines..."
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2 border-t border-border">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving} className="shimmer-btn">
              {editing ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={!!showDelete} onClose={() => setShowDelete(null)} title="Delete Page" size="sm">
        <p className="text-sm text-foreground-secondary mb-6">
          Delete <strong className="text-foreground">{showDelete?.title}</strong>? This cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setShowDelete(null)}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
