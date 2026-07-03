"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Plus, Search, Edit, Eye, Package, MoreVertical, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import type { ProductWithDetails } from "@/lib/types";

export default function VendorProducts() {
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetch() {
      try {
        const { getProducts } = await import("@/lib/services/products");
        const result = await getProducts({ limit: 100 });
        setProducts((result.products || []) as ProductWithDetails[]);
      } catch {} finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold text-foreground text-lg">My Products</h2>
          <p className="text-sm text-foreground-secondary">{products.length} products listed</p>
        </div>
        <Button className="shimmer-btn">
          <Plus className="w-4 h-4" /> Add Product
        </Button>
      </div>

      <Input
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-4 flex gap-4">
              <Skeleton className="w-20 h-20 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-foreground-secondary/20 mx-auto mb-4" />
          <p className="text-foreground-secondary">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="card p-4 flex gap-4 group hover:shadow-md transition-shadow"
            >
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                {product.product_images?.[0]?.image_url ? (
                  <Image src={product.product_images[0].image_url} alt={product.title} fill className="object-cover" sizes="80px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-foreground-secondary/20">
                    <Package className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-foreground truncate">{product.title}</p>
                    <p className="text-xs text-foreground-secondary">SKU: {product.sku}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 rounded-lg hover:bg-muted text-foreground-secondary hover:text-foreground transition-colors">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <Link href={`/products/${product.slug}`}>
                      <button className="p-1.5 rounded-lg hover:bg-muted text-foreground-secondary hover:text-foreground transition-colors">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-sm font-semibold text-foreground">{formatCurrency(product.sale_price || product.price)}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    product.stock_quantity > 10 ? "bg-success/10 text-success" :
                    product.stock_quantity > 0 ? "bg-yellow-50 text-yellow-600" : "bg-destructive/10 text-destructive"
                  }`}>
                    {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : "Out of stock"}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  {product.category && (
                    <span className="text-[10px] text-foreground-secondary bg-muted px-2 py-0.5 rounded">{product.category.name}</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}