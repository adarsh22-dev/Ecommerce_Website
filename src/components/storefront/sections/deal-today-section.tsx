"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Clock, Zap, ShoppingBag, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/storefront/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, calculateDiscount } from "@/lib/utils";
import type { ProductWithDetails } from "@/lib/types";

function CountdownTimer() {
  const [time, setTime] = useState({ hours: 11, minutes: 45, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; minutes = 59; seconds = 59; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="flex items-center gap-3">
      {[
        { label: "Hours", value: pad(time.hours) },
        { label: "Minutes", value: pad(time.minutes) },
        { label: "Seconds", value: pad(time.seconds) },
      ].map(unit => (
        <div key={unit.label} className="text-center">
          <div className="bg-foreground text-white rounded-lg w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center text-lg lg:text-xl font-bold tabular-nums">
            {unit.value}
          </div>
          <p className="text-[10px] text-foreground-secondary mt-1 uppercase tracking-wider">{unit.label}</p>
        </div>
      ))}
    </div>
  );
}

export function DealTodaySection() {
  const [product, setProduct] = useState<ProductWithDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const { getProducts } = await import("@/lib/services/products");
        const result = await getProducts({ sort: "newest", limit: 10 });
        const all = (result.products || []) as ProductWithDetails[];
        const onSale = all.filter(p => p.sale_price && p.sale_price < p.price);
        setProduct(onSale.length > 0 ? onSale[0] : all[0]);
      } catch {} finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  if (loading) {
    return (
      <section className="section-padding">
        <div className="container-xl">
          <div className="rounded-3xl border border-destructive/20 bg-gradient-to-br from-destructive/5 via-background to-destructive/5 p-8 lg:p-12">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <Skeleton className="aspect-square rounded-2xl" />
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!product) return null;

  const isOnSale = product.sale_price !== null && product.sale_price < product.price;
  const discount = isOnSale ? calculateDiscount(product.price, product.sale_price!) : 0;
  const primaryImage = product.product_images?.[0]?.image_url;

  return (
    <section className="section-padding">
      <div className="container-xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="rounded-3xl border border-destructive/20 bg-gradient-to-br from-destructive/5 via-background to-destructive/5 p-8 lg:p-12 shadow-sm"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-caption text-destructive font-semibold">Limited Time Offer</p>
                <h2 className="font-serif text-2xl lg:text-3xl text-foreground">Deal of the Day</h2>
              </div>
            </div>
            <CountdownTimer />
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <Link href={`/products/${product.slug}`} className="group relative">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
                {primaryImage ? (
                  <Image
                    src={primaryImage}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-foreground-secondary/20">
                    <ShoppingBag className="w-16 h-16" />
                  </div>
                )}
                {isOnSale && (
                  <div className="absolute top-4 left-4 bg-destructive text-white text-sm font-bold px-4 py-2 rounded-lg shadow-lg">
                    -{discount}% OFF
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
            </Link>

            <div className="space-y-6">
              <div>
                {product.category && (
                  <p className="text-caption text-primary mb-2">{product.category.name}</p>
                )}
                <Link href={`/products/${product.slug}`}>
                  <h3 className="font-serif text-2xl lg:text-3xl text-foreground hover:text-primary transition-colors">
                    {product.title}
                  </h3>
                </Link>
                <div className="flex items-center gap-3 mt-4">
                  <span className="text-3xl font-bold text-destructive">
                    {formatCurrency(isOnSale ? product.sale_price! : product.price)}
                  </span>
                  {isOnSale && (
                    <span className="text-xl text-foreground-secondary line-through">
                      {formatCurrency(product.price)}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-foreground-secondary leading-relaxed">
                {product.meta_description || product.description || "Premium quality product available at an exclusive daily deal price. Limited stock — order now before it's gone!"}
              </p>

              <div className="flex items-center gap-3">
                {product.tags?.slice(0, 3).map(tag => (
                  <span key={tag} className="rounded-full bg-muted px-3 py-1.5 text-[11px] font-medium text-foreground-secondary">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 pt-2">
                <Link href={`/products/${product.slug}`}>
                  <Button className="shimmer-btn" size="lg">
                    <ShoppingBag className="w-4 h-4" />
                    Grab This Deal
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/products?on_sale=true">
                  <Button variant="secondary" size="lg">
                    View All Deals
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-4 text-xs text-foreground-secondary border-t border-border pt-4">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-destructive" />
                  <span>Limited stock available</span>
                </div>
                <Clock className="w-3.5 h-3.5" />
                <span>Price drops daily at midnight</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}