"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus, Settings, Trash2, GripVertical, Eye, EyeOff,
  Layout, Image, ShoppingBag, Type, Star, Grid3X3, MessageSquare, Newspaper, Shield, Search, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import type { HomepageSection, HomepageSectionType } from "@/lib/types";

const sectionTypeMeta: Record<HomepageSectionType, { label: string; icon: any; description: string }> = {
  hero: { label: "Hero Slider", icon: Image, description: "Full-width image carousel with text overlay" },
  trust_badges: { label: "Trust Badges", icon: Shield, description: "Shipping, payment, returns badges" },
  categories: { label: "Categories Grid", icon: Grid3X3, description: "Featured category cards" },
  products_grid: { label: "Products Grid", icon: ShoppingBag, description: "Custom product selection grid" },
  featured_products: { label: "Featured Products", icon: Star, description: "Auto-sorting product feed" },
  banner: { label: "Promo Banner", icon: Layout, description: "Full-width promotional banner" },
  instagram: { label: "Instagram Feed", icon: MessageSquare, description: "Social proof gallery" },
  newsletter: { label: "Newsletter", icon: Newspaper, description: "Email signup form" },
  custom_text: { label: "Custom Text", icon: Type, description: "Rich text / HTML block" },
};

const sectionTypeDefaults: Record<HomepageSectionType, Record<string, any>> = {
  hero: { slides: [{ image_url: "", heading: "", subheading: "", cta_text: "Shop Now", cta_link: "/products" }] },
  trust_badges: {},
  categories: { category_ids: [] },
  products_grid: { product_ids: [], layout: "grid" },
  featured_products: { sort_by: "newest", limit: 8 },
  banner: { image_url: "", cta_text: "Shop Now", cta_link: "/products", bg_color: "#1a1a1a", text_color: "#ffffff" },
  instagram: { username: "", limit: 8 },
  newsletter: {},
  custom_text: { content_html: "" },
};

function SectionIcon({ type }: { type: HomepageSectionType }) {
  const meta = sectionTypeMeta[type];
  if (!meta) return <Layout className="w-5 h-5" />;
  const Icon = meta.icon;
  return <Icon className="w-5 h-5" />;
}

export default function AdminHomepagePage() {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSection, setEditingSection] = useState<HomepageSection | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [allProducts, setAllProducts] = useState<{ id: string; title: string; price: number; product_images?: { image_url: string }[] }[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [allCategories, setAllCategories] = useState<{ id: string; name: string }[]>([]);
  const [categorySearch, setCategorySearch] = useState("");

  const openProductPicker = async () => {
    setShowProductPicker(true);
    setProductSearch("");
    try {
      const { adminGetProducts } = await import("@/lib/services/admin");
      const result = await adminGetProducts({});
      setAllProducts(result.products || []);
    } catch {
      setAllProducts([]);
    }
  };

  const toggleProductSelection = (id: string) => {
    const current = editForm.settings.product_ids || [];
    const updated = current.includes(id)
      ? current.filter((i: string) => i !== id)
      : [...current, id];
    setEditForm({ ...editForm, settings: { ...editForm.settings, product_ids: updated } });
  };

  const openCategoryPicker = async () => {
    setShowCategoryPicker(true);
    setCategorySearch("");
    try {
      const { adminGetCategories } = await import("@/lib/services/admin");
      const data = await adminGetCategories();
      setAllCategories(data || []);
    } catch {
      setAllCategories([]);
    }
  };

  const toggleCategorySelection = (id: string) => {
    const current = editForm.settings.category_ids || [];
    const updated = current.includes(id)
      ? current.filter((i: string) => i !== id)
      : [...current, id];
    setEditForm({ ...editForm, settings: { ...editForm.settings, category_ids: updated } });
  };

  const fetchSections = useCallback(async () => {
    setLoading(true);
    try {
      const { adminGetHomepageSections } = await import("@/lib/services/homepage");
      const data = await adminGetHomepageSections();
      setSections(data);
    } catch {
      toast.error("Failed to load sections");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSections(); }, [fetchSections]);

  const openEdit = (section: HomepageSection) => {
    setEditingSection(section);
    setEditForm({
      title: section.title || "",
      subtitle: section.subtitle || "",
      settings: { ...sectionTypeDefaults[section.type], ...section.settings },
    });
    setShowEditModal(true);
  };

  const handleSave = async () => {
    if (!editingSection) return;
    try {
      const { adminUpdateHomepageSection } = await import("@/lib/services/homepage");
      await adminUpdateHomepageSection(editingSection.id, {
        title: editForm.title || null,
        subtitle: editForm.subtitle || null,
        settings: editForm.settings,
      });
      toast.success("Section updated");
      setShowEditModal(false);
      fetchSections();
    } catch {
      toast.error("Failed to update section");
    }
  };

  const handleDelete = async (section: HomepageSection) => {
    if (!confirm(`Delete "${section.title || sectionTypeMeta[section.type]?.label}" section?`)) return;
    try {
      const { adminDeleteHomepageSection } = await import("@/lib/services/homepage");
      await adminDeleteHomepageSection(section.id);
      toast.success("Section deleted");
      fetchSections();
    } catch {
      toast.error("Failed to delete section");
    }
  };

  const handleToggle = async (section: HomepageSection) => {
    try {
      const { adminUpdateHomepageSection } = await import("@/lib/services/homepage");
      await adminUpdateHomepageSection(section.id, { is_active: !section.is_active });
      fetchSections();
    } catch {
      toast.error("Failed to toggle section");
    }
  };

  const moveSection = async (from: number, to: number) => {
    if (to < 0 || to >= sections.length) return;
    const reordered = [...sections];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);

    setSections(reordered);
    setDragIndex(null);

    try {
      const { adminReorderHomepageSections } = await import("@/lib/services/homepage");
      await adminReorderHomepageSections(reordered.map((s) => s.id));
    } catch {
      toast.error("Failed to reorder");
      fetchSections();
    }
  };

  const addSection = async (type: HomepageSectionType) => {
    try {
      const { adminCreateHomepageSection } = await import("@/lib/services/homepage");
      await adminCreateHomepageSection({
        type,
        title: sectionTypeMeta[type]?.label || type,
        subtitle: undefined,
        settings: sectionTypeDefaults[type],
        sort_order: sections.length,
        is_active: true,
      });
      toast.success("Section added");
      setShowAddModal(false);
      fetchSections();
    } catch {
      toast.error("Failed to add section");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Homepage Builder</h1>
          <p className="text-sm text-foreground-secondary mt-1">Arrange and customize your homepage sections</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}><Plus className="w-4 h-4" /> Add Section</Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : sections.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-border">
          <Layout className="w-12 h-12 mx-auto mb-4 text-foreground-secondary/40" />
          <p className="text-lg font-medium text-foreground mb-1">No sections yet</p>
          <p className="text-sm text-foreground-secondary mb-6">Start building your homepage by adding sections</p>
          <Button onClick={() => setShowAddModal(true)}><Plus className="w-4 h-4" /> Add Section</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {sections.map((section, index) => (
            <div
              key={section.id}
              onDragOver={(e) => { e.preventDefault(); setDragIndex(index); }}
              onDragLeave={() => setDragIndex(null)}
              onDrop={(e) => { e.preventDefault(); moveSection(dragIndex ?? index, index); }}
              className={`bg-white rounded-xl border border-border p-4 flex items-center gap-4 transition-all ${
                !section.is_active ? "opacity-50" : ""
              } ${dragIndex === index ? "border-primary ring-2 ring-primary/20" : ""}`}
              draggable
              onDragStart={() => setDragIndex(index)}
            >
              <div className="cursor-grab active:cursor-grabbing text-foreground-secondary/40 hover:text-foreground-secondary">
                <GripVertical className="w-5 h-5" />
              </div>

              <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0">
                <SectionIcon type={section.type} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {section.title || sectionTypeMeta[section.type]?.label || section.type}
                </p>
                <p className="text-xs text-foreground-secondary truncate">
                  {sectionTypeMeta[section.type]?.description || section.type}
                  {section.subtitle ? ` • ${section.subtitle}` : ""}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleToggle(section)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                  title={section.is_active ? "Disable" : "Enable"}
                >
                  {section.is_active ? <Eye className="w-4 h-4 text-foreground-secondary" /> : <EyeOff className="w-4 h-4 text-foreground-secondary/40" />}
                </button>
                <button
                  onClick={() => openEdit(section)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                  title="Edit"
                >
                  <Settings className="w-4 h-4 text-foreground-secondary" />
                </button>
                <button
                  onClick={() => handleDelete(section)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Section Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Section" size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(sectionTypeMeta).map(([type, meta]) => {
            const Icon = meta.icon;
            return (
              <button
                key={type}
                onClick={() => addSection(type as HomepageSectionType)}
                className="flex items-start gap-3 p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all text-left"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{meta.label}</p>
                  <p className="text-xs text-foreground-secondary mt-0.5">{meta.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </Modal>

      {/* Edit Section Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title={`Edit ${editingSection ? (editingSection.title || sectionTypeMeta[editingSection.type]?.label) : ""}`} size="lg">
        {editingSection && (
          <div className="space-y-4">
            <Input
              label="Section Title"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              placeholder="Section heading"
            />
            <Input
              label="Subtitle"
              value={editForm.subtitle}
              onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
              placeholder="Section subtitle / caption"
            />

            {/* Section-specific settings */}
            {editingSection.type === "hero" && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Slides</p>
                {editForm.settings.slides?.map((slide: any, i: number) => (
                  <div key={i} className="p-3 border border-border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-foreground-secondary">Slide {i + 1}</span>
                      <button
                        onClick={() => {
                          const slides = editForm.settings.slides.filter((_: any, j: number) => j !== i);
                          setEditForm({ ...editForm, settings: { ...editForm.settings, slides } });
                        }}
                        className="text-xs text-destructive hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                    <input
                      value={slide.image_url}
                      onChange={(e) => {
                        const slides = [...editForm.settings.slides];
                        slides[i] = { ...slides[i], image_url: e.target.value };
                        setEditForm({ ...editForm, settings: { ...editForm.settings, slides } });
                      }}
                      placeholder="Image URL"
                      className="w-full h-9 px-3 text-sm border border-border rounded-lg"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        value={slide.heading}
                        onChange={(e) => {
                          const slides = [...editForm.settings.slides];
                          slides[i] = { ...slides[i], heading: e.target.value };
                          setEditForm({ ...editForm, settings: { ...editForm.settings, slides } });
                        }}
                        placeholder="Heading"
                        className="h-9 px-3 text-sm border border-border rounded-lg"
                      />
                      <input
                        value={slide.subheading}
                        onChange={(e) => {
                          const slides = [...editForm.settings.slides];
                          slides[i] = { ...slides[i], subheading: e.target.value };
                          setEditForm({ ...editForm, settings: { ...editForm.settings, slides } });
                        }}
                        placeholder="Subheading"
                        className="h-9 px-3 text-sm border border-border rounded-lg"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        value={slide.cta_text}
                        onChange={(e) => {
                          const slides = [...editForm.settings.slides];
                          slides[i] = { ...slides[i], cta_text: e.target.value };
                          setEditForm({ ...editForm, settings: { ...editForm.settings, slides } });
                        }}
                        placeholder="Button text"
                        className="h-9 px-3 text-sm border border-border rounded-lg"
                      />
                      <input
                        value={slide.cta_link}
                        onChange={(e) => {
                          const slides = [...editForm.settings.slides];
                          slides[i] = { ...slides[i], cta_link: e.target.value };
                          setEditForm({ ...editForm, settings: { ...editForm.settings, slides } });
                        }}
                        placeholder="Button link"
                        className="h-9 px-3 text-sm border border-border rounded-lg"
                      />
                    </div>
                  </div>
                ))}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setEditForm({
                    ...editForm,
                    settings: {
                      ...editForm.settings,
                      slides: [...(editForm.settings.slides || []), { image_url: "", heading: "", subheading: "", cta_text: "Shop Now", cta_link: "/products" }]
                    }
                  })}
                >
                  <Plus className="w-3 h-3" /> Add Slide
                </Button>
              </div>
            )}

            {editingSection.type === "banner" && (
              <div className="space-y-3">
                <Input
                  label="Background Image URL"
                  value={editForm.settings.image_url}
                  onChange={(e) => setEditForm({ ...editForm, settings: { ...editForm.settings, image_url: e.target.value } })}
                  placeholder="https://..."
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={editForm.settings.bg_color}
                    onChange={(e) => setEditForm({ ...editForm, settings: { ...editForm.settings, bg_color: e.target.value } })}
                    placeholder="Background color (#1a1a1a)"
                    className="h-9 px-3 text-sm border border-border rounded-lg"
                  />
                  <input
                    value={editForm.settings.text_color}
                    onChange={(e) => setEditForm({ ...editForm, settings: { ...editForm.settings, text_color: e.target.value } })}
                    placeholder="Text color (#ffffff)"
                    className="h-9 px-3 text-sm border border-border rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="CTA Text"
                    value={editForm.settings.cta_text}
                    onChange={(e) => setEditForm({ ...editForm, settings: { ...editForm.settings, cta_text: e.target.value } })}
                    placeholder="Shop Now"
                  />
                  <Input
                    label="CTA Link"
                    value={editForm.settings.cta_link}
                    onChange={(e) => setEditForm({ ...editForm, settings: { ...editForm.settings, cta_link: e.target.value } })}
                    placeholder="/products"
                  />
                </div>
              </div>
            )}

            {editingSection.type === "featured_products" && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Sort By</label>
                <select
                  value={editForm.settings.sort_by}
                  onChange={(e) => setEditForm({ ...editForm, settings: { ...editForm.settings, sort_by: e.target.value } })}
                  className="w-full h-10 px-3 border border-border rounded-lg text-sm bg-white"
                >
                  <option value="newest">Newest</option>
                  <option value="best-selling">Best Selling</option>
                  <option value="on_sale">On Sale</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
                <Input
                  label="Products to show"
                  type="number"
                  value={editForm.settings.limit?.toString() || "8"}
                  onChange={(e) => setEditForm({ ...editForm, settings: { ...editForm.settings, limit: parseInt(e.target.value) || 8 } })}
                />
              </div>
            )}

            {editingSection.type === "instagram" && (
              <div className="space-y-3">
                <Input
                  label="Instagram Username"
                  value={editForm.settings.username}
                  onChange={(e) => setEditForm({ ...editForm, settings: { ...editForm.settings, username: e.target.value } })}
                  placeholder="@yourstore"
                />
                <Input
                  label="Number of posts"
                  type="number"
                  value={editForm.settings.limit?.toString() || "8"}
                  onChange={(e) => setEditForm({ ...editForm, settings: { ...editForm.settings, limit: parseInt(e.target.value) || 8 } })}
                />
              </div>
            )}

            {editingSection.type === "custom_text" && (
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">HTML Content</label>
                <textarea
                  value={editForm.settings.content_html || ""}
                  onChange={(e) => setEditForm({ ...editForm, settings: { ...editForm.settings, content_html: e.target.value } })}
                  rows={8}
                  className="w-full px-4 py-3 text-sm border border-border rounded-lg focus:outline-none focus:border-primary font-mono"
                  placeholder="<p>Your custom HTML here...</p>"
                />
              </div>
            )}

            {editingSection.type === "categories" && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground mb-2 block">Featured Categories</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {(editForm.settings?.category_ids || []).map((id: string) => {
                    const cat = allCategories.find((c) => c.id === id);
                    return (
                      <Badge key={id} variant="neutral" className="gap-1">
                        {cat?.name || id.slice(0, 8)}
                        <button onClick={() => toggleCategorySelection(id)} className="hover:text-destructive">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
                <Button variant="secondary" size="sm" onClick={openCategoryPicker}>
                  <Search className="w-3 h-3" /> Browse Categories
                </Button>
              </div>
            )}

            {editingSection.type === "products_grid" && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground mb-2 block">Selected Products</label>
                <div className="flex flex-wrap gap-2 mb-3 max-h-32 overflow-y-auto">
                  {(editForm.settings?.product_ids || []).map((id: string) => {
                    const prod = allProducts.find((p) => p.id === id);
                    return (
                      <Badge key={id} variant="neutral" className="gap-1">
                        {prod?.title || id.slice(0, 12)}
                        <button onClick={() => toggleProductSelection(id)} className="hover:text-destructive">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
                <Button variant="secondary" size="sm" onClick={openProductPicker}>
                  <Search className="w-3 h-3" /> Select Products
                </Button>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
              <Button onClick={handleSave} className="shimmer-btn">Save Changes</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Product Picker Modal */}
      <Modal isOpen={showProductPicker} onClose={() => setShowProductPicker(false)} title="Select Products" size="lg">
        <div className="space-y-3">
          <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-foreground-secondary" />
            <input
              type="text"
              placeholder="Search products..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="bg-transparent text-sm outline-none w-full"
            />
          </div>
          <div className="max-h-80 overflow-y-auto space-y-1">
            {allProducts
              .filter(
                (p) =>
                  !productSearch ||
                  p.title.toLowerCase().includes(productSearch.toLowerCase())
              )
              .map((product) => {
                const selected = (editForm.settings?.product_ids || []).includes(product.id);
                return (
                  <button
                    key={product.id}
                    onClick={() => toggleProductSelection(product.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                      selected ? "bg-primary/5 ring-1 ring-primary/20" : "hover:bg-muted"
                    }`}
                  >
                    <div className="h-10 w-10 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                      {product.product_images?.[0]?.image_url && (
                        <img src={product.product_images[0].image_url} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.title}</p>
                    </div>
                    <div className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-colors ${
                      selected ? "bg-primary border-primary" : "border-border"
                    }`}>
                      {selected && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            {allProducts.length === 0 && (
              <p className="text-sm text-foreground-secondary text-center py-8">No products found</p>
            )}
          </div>
          <div className="flex justify-end pt-2">
            <Button onClick={() => setShowProductPicker(false)}>Done ({editForm.settings?.product_ids?.length || 0} selected)</Button>
          </div>
        </div>
      </Modal>

      {/* Category Picker Modal */}
      <Modal isOpen={showCategoryPicker} onClose={() => setShowCategoryPicker(false)} title="Select Categories" size="lg">
        <div className="space-y-3">
          <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-foreground-secondary" />
            <input
              type="text"
              placeholder="Search categories..."
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              className="bg-transparent text-sm outline-none w-full"
            />
          </div>
          <div className="max-h-80 overflow-y-auto space-y-1">
            {allCategories
              .filter(
                (c) =>
                  !categorySearch ||
                  c.name.toLowerCase().includes(categorySearch.toLowerCase())
              )
              .map((cat) => {
                const selected = (editForm.settings?.category_ids || []).includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategorySelection(cat.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                      selected ? "bg-primary/5 ring-1 ring-primary/20" : "hover:bg-muted"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{cat.name}</p>
                    </div>
                    <div className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-colors ${
                      selected ? "bg-primary border-primary" : "border-border"
                    }`}>
                      {selected && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            {allCategories.length === 0 && (
              <p className="text-sm text-foreground-secondary text-center py-8">No categories found</p>
            )}
          </div>
          <div className="flex justify-end pt-2">
            <Button onClick={() => setShowCategoryPicker(false)}>Done ({editForm.settings?.category_ids?.length || 0} selected)</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
