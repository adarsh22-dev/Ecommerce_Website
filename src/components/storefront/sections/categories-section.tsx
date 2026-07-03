"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Category } from "@/lib/types";

interface CategoriesSectionProps {
  title?: string;
  subtitle?: string;
  settings?: {
    category_ids?: string[];
  };
}

export function CategoriesSection({ title, subtitle, settings }: CategoriesSectionProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const { getCategories } = await import("@/lib/services/products");
        const data = await getCategories();
        const categoryIds = settings?.category_ids;
        if (categoryIds && categoryIds.length > 0) {
          const filtered = data.filter((c: Category) => categoryIds.includes(c.id));
          setCategories(filtered.slice(0, 4));
        } else {
          setCategories(data.slice(0, 4));
        }
      } catch {} finally {
        setLoading(false);
      }
    }
    fetch();
  }, [settings?.category_ids?.join(",")]);

  return (
    <section className="section-padding">
      <div className="container-xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {subtitle && <p className="text-caption text-primary mb-3">{subtitle}</p>}
          <h2 className="font-serif text-section-heading text-foreground">{title || "Browse Parts & Components"}</h2>
        </motion.div>
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl"><Skeleton className="w-full h-full" /></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/products?category=${category.slug}`} className="group block relative aspect-[3/4] rounded-2xl overflow-hidden">
                  {category.image_url ? (
                    <Image src={category.image_url} alt={category.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                      <span className="text-2xl font-serif text-primary/40">{category.name[0]}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                    <p className="text-sm text-white/70 mt-1 flex items-center gap-1 group-hover:text-white transition-colors">
                      Shop Now <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
