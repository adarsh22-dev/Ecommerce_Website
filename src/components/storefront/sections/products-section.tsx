"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/storefront/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ProductWithDetails } from "@/lib/types";

interface ProductsSectionProps {
  title?: string;
  subtitle?: string;
  settings: {
    sort_by?: string;
    limit?: number;
    product_ids?: string[];
    layout?: string;
  };
}

export function ProductsSection({ title, subtitle, settings }: ProductsSectionProps) {
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const productsService = await import("@/lib/services/products");

        if (settings.product_ids && settings.product_ids.length > 0) {
          const result = await productsService.getProducts({ limit: settings.product_ids.length });
          const all = (result.products || []) as ProductWithDetails[];
          const selected = all.filter((product) => settings.product_ids?.includes(product.id));
          setProducts(selected);
        } else {
          const sort = settings.sort_by || "newest";
          const limit = settings.limit || 8;
          let result;

          if (sort === "on_sale") {
            result = await productsService.getProducts({ sort: "newest", limit });
            const all = result.products as ProductWithDetails[];
            setProducts(all.filter((p) => p.sale_price && p.sale_price < p.price).slice(0, limit));
            return;
          } else {
            result = await productsService.getProducts({ sort: sort as any, limit });
          }

          setProducts((result.products || result) as ProductWithDetails[]);
        }
      } catch {} finally {
        setLoading(false);
      }
    }
    fetch();
  }, [settings.sort_by, settings.limit, settings.product_ids?.join(",")]);

  return (
    <section className="section-padding">
      <div className="container-xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            {subtitle && <p className="text-caption text-primary mb-3">{subtitle}</p>}
            <h2 className="font-serif text-section-heading text-foreground">{title || "Products"}</h2>
          </div>
          <Link href="/products" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card overflow-hidden">
                <Skeleton className="aspect-[3/4] w-full rounded-none" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {products.slice(0, settings.limit || 8).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-foreground-secondary">No products available yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
