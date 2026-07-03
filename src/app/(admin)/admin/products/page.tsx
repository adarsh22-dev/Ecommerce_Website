"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Search, Edit, Trash2, Eye, Package, Upload, Download, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { ImportCsvModal } from "@/components/ui/import-csv-modal";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";
import type { ProductWithDetails } from "@/lib/types";

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductWithDetails | null>(null);
  const [showImport, setShowImport] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { getProducts } = await import("@/lib/services/products");
      const result = await getProducts({ sort: "newest", limit: 100 });
      setProducts(result.products as ProductWithDetails[]);
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async () => {
    if (!selectedProduct) return;
    const id = selectedProduct.id;
    try {
      const isMockId = id.startsWith("prod-");
      const isLocalId = id.startsWith("local-prod-");
      if (!isMockId && !isLocalId) {
        try {
          const supabase = (await import("@/lib/supabase/client")).createClient();
          await supabase.from("products").delete().eq("id", id);
        } catch {
          // Supabase delete may fail (RLS/mock data) — proceed with local deletion
        }
      }
      const { deleteLocalRecord } = await import("@/lib/services/products");
      deleteLocalRecord("products", id);
      setProducts((prev) => prev.filter((product) => product.id !== id));
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    }
    setShowDeleteModal(false);
    setSelectedProduct(null);
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-sm text-foreground-secondary mt-1">
            {loading ? "Loading..." : `${products.length} total products`}
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
                products,
                [
                  { key: "title", label: "Title" },
                  { key: "slug", label: "Slug" },
                  { key: "price", label: "Price" },
                  { key: "sale_price", label: "Sale Price" },
                  { key: "sku", label: "SKU" },
                  { key: "stock_quantity", label: "Stock Qty" },
                  { key: "status", label: "Status" },
                ],
                "products"
              );
            }}
          >
            <Download className="w-4 h-4" /> Export
          </Button>
          <Link href="/admin/products/new">
            <Button className="shimmer-btn">
              <Plus className="w-4 h-4" /> Add Product
            </Button>
          </Link>
        </div>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1 w-full sm:w-auto flex items-center gap-2 bg-muted/70 rounded-lg px-3 py-2 focus-within:bg-muted focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <Search className="w-4 h-4 text-foreground-secondary flex-shrink-0" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm outline-none w-full"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-4 border border-border rounded-lg text-sm bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {loading ? (
          <div className="p-4 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="h-12 w-12 mx-auto mb-4 rounded-xl bg-muted flex items-center justify-center">
              <Package className="w-6 h-6 text-foreground-secondary" />
            </div>
            <p className="text-lg font-medium text-foreground mb-1">
              {search ? "No products found" : "No products yet"}
            </p>
            <p className="text-sm text-foreground-secondary mb-6">
              {search ? "Try a different search term" : "Add your first product to get started"}
            </p>
            {!search && (
              <Link href="/admin/products/new">
                <Button><Plus className="w-4 h-4" /> Add Product</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th className="hidden md:table-cell">SKU</th>
                  <th className="hidden lg:table-cell">Category</th>
                  <th>Price</th>
                  <th className="hidden sm:table-cell">Stock</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const images = product.product_images || [];
                  const primaryImage = images[0]?.image_url;
                  const categoryName = (product as any).category?.name || "Uncategorized";
                  return (
                    <tr key={product.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            {primaryImage ? (
                              <Image src={primaryImage} alt={product.title} width={40} height={40} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-4 h-4 text-foreground-secondary/40" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{product.title}</p>
                            <p className="text-xs text-foreground-secondary">{product.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden md:table-cell text-foreground-secondary">{product.sku}</td>
                      <td className="hidden lg:table-cell">
                        <span className="text-sm bg-muted px-2 py-1 rounded-md text-foreground-secondary">
                          {categoryName}
                        </span>
                      </td>
                      <td>
                        <div>
                          <span className="text-sm font-medium">{formatCurrency(product.price)}</span>
                          {product.sale_price && (
                            <span className="text-xs text-foreground-secondary line-through ml-1">
                              {formatCurrency(product.sale_price)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="hidden sm:table-cell">
                        <span className={`text-sm font-medium ${product.stock_quantity <= 10 && product.stock_quantity > 0 ? "text-yellow-600" : product.stock_quantity === 0 ? "text-destructive" : ""}`}>
                          {product.stock_quantity}
                        </span>
                      </td>
                      <td>
                        <Badge variant={product.status === "active" ? "success" : "neutral"}>
                          {product.status}
                        </Badge>
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => window.open(`/products/${product.slug}`, "_blank")}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                            title="View on storefront"
                          >
                            <Eye className="w-4 h-4 text-foreground-secondary" />
                          </button>
                          <button
                            onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                            title="Edit product media"
                          >
                            <ImagePlus className="w-4 h-4 text-foreground-secondary" />
                          </button>
                          <button
                            onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4 text-foreground-secondary" />
                          </button>
                          <button
                            onClick={() => { setSelectedProduct(product); setShowDeleteModal(true); }}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-foreground-secondary">
            Showing {filteredProducts.length} of {products.length} products
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" disabled>Previous</Button>
            <Button variant="secondary" size="sm" disabled>Next</Button>
          </div>
        </div>
      </div>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Product" size="sm">
        <p className="text-sm text-foreground-secondary mb-2">
          Are you sure you want to delete <strong className="text-foreground">{selectedProduct?.title}</strong>?
        </p>
        <p className="text-xs text-destructive mb-6">This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>

      <ImportCsvModal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        tableName="products"
        columns={[
          { label: "Title", key: "title", required: true },
          { label: "Slug", key: "slug" },
          { label: "Description", key: "description" },
          { label: "Category ID", key: "category_id" },
          { label: "Price", key: "price", required: true },
          { label: "Sale Price", key: "sale_price" },
          { label: "SKU", key: "sku" },
          { label: "Stock Qty", key: "stock_quantity" },
          { label: "Status", key: "status" },
        ]}
        onSuccess={() => fetchProducts()}
        sampleFile="/products.csv"
      />
    </div>
  );
}
