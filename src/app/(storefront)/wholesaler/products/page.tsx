"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Package, Search, Minus, Plus, ShoppingCart, Truck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import type { ProductWithDetails } from "@/lib/types";

export default function WholesalerProducts() {
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});

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
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const updateQty = (id: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const totalItems = Object.values(quantities).reduce((a, b) => a + b, 0);
  const totalPrice = Object.entries(quantities).reduce((sum, [id, qty]) => {
    const product = products.find(p => p.id === id);
    return sum + (product ? (product.sale_price || product.price) * qty : 0);
  }, 0);

  const wholesaleMultiplier = (qty: number) => {
    if (qty >= 50) return 0.65;
    if (qty >= 20) return 0.75;
    if (qty >= 10) return 0.85;
    return 1;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold text-foreground text-lg">Bulk Ordering</h2>
          <p className="text-sm text-foreground-secondary">Wholesale pricing based on quantity tiers</p>
        </div>
        {totalItems > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-foreground-secondary">{totalItems} items</span>
            <span className="text-sm font-semibold text-foreground">{formatCurrency(totalPrice)}</span>
            <Button size="sm" className="shimmer-btn">
              <ShoppingCart className="w-4 h-4" /> Add to Cart
            </Button>
          </div>
        )}
      </div>

      <Input
        placeholder="Search products for bulk order..."
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
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-10 w-full" />
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
          {filtered.map((product) => {
            const qty = quantities[product.id] || 0;
            const multiplier = wholesaleMultiplier(qty);
            const basePrice = product.sale_price || product.price;
            const wholesalePrice = basePrice * multiplier;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-4 flex gap-4"
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
                  <p className="text-sm font-medium text-foreground truncate">{product.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground line-through">{formatCurrency(basePrice)}</span>
                    <span className="text-sm font-bold text-primary">{formatCurrency(wholesalePrice)}</span>
                    {multiplier < 1 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                        -{Math.round((1 - multiplier) * 100)}%
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-foreground-secondary">
                      Tier: {qty >= 50 ? "50+ (35% off)" : qty >= 20 ? "20+ (25% off)" : qty >= 10 ? "10+ (15% off)" : "1-9 (retail)"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQty(product.id, -1)}
                      className="p-1.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground-secondary transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold text-foreground">{qty}</span>
                    <button
                      onClick={() => updateQty(product.id, 1)}
                      className="p-1.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground-secondary transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}