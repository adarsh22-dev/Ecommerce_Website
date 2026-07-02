"use client";

import { useState, useEffect } from "react";
import { HeroSection } from "@/components/storefront/sections/hero-section";
import { TrustBadgesSection } from "@/components/storefront/sections/trust-badges-section";
import { CategoriesSection } from "@/components/storefront/sections/categories-section";
import { ProductsSection } from "@/components/storefront/sections/products-section";
import { BannerSection } from "@/components/storefront/sections/banner-section";
import { InstagramSection } from "@/components/storefront/sections/instagram-section";
import { NewsletterSection } from "@/components/storefront/sections/newsletter-section";
import { CustomTextSection } from "@/components/storefront/sections/custom-text-section";
import { Skeleton } from "@/components/ui/skeleton";
import type { HomepageSection } from "@/lib/types";

const sectionComponents: Record<string, React.FC<any>> = {
  hero: HeroSection,
  trust_badges: TrustBadgesSection,
  categories: CategoriesSection,
  products_grid: ProductsSection,
  featured_products: ProductsSection,
  banner: BannerSection,
  instagram: InstagramSection,
  newsletter: NewsletterSection,
  custom_text: CustomTextSection,
};

const fallbackSections: HomepageSection[] = [
  {
    id: "fallback-hero",
    type: "hero",
    settings: {
      slides: [
        { image_url: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&h=900&fit=crop", heading: "Curated Collections", subheading: "Discover pieces that define your style", cta_text: "Shop Now", cta_link: "/products" },
        { image_url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=900&fit=crop", heading: "New Season Edit", subheading: "Fresh arrivals for the modern lifestyle", cta_text: "Explore", cta_link: "/products?sort=newest" },
        { image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&h=900&fit=crop", heading: "Premium Quality", subheading: "Crafted with care, built to last", cta_text: "View Collection", cta_link: "/products" },
      ],
    },
    sort_order: 0,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-trust",
    type: "trust_badges",
    settings: {},
    sort_order: 1,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-categories",
    type: "categories",
    title: "Shop by Category",
    subtitle: "Browse",
    settings: {},
    sort_order: 2,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-new-arrivals",
    type: "featured_products",
    title: "New Arrivals",
    subtitle: "Just In",
    settings: { sort_by: "newest", limit: 8 },
    sort_order: 3,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-banner",
    type: "banner",
    title: "Spring Sale",
    subtitle: "Limited Time",
    settings: { image_url: "", cta_text: "Shop the Sale", cta_link: "/products?on_sale=true", bg_color: "#1a1a1a", text_color: "#ffffff" },
    sort_order: 4,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-best-sellers",
    type: "featured_products",
    title: "Best Sellers",
    subtitle: "Customer Favorites",
    settings: { sort_by: "best-selling", limit: 8 },
    sort_order: 5,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-newsletter",
    type: "newsletter",
    title: "Join Our Newsletter",
    subtitle: "Stay Updated",
    settings: {},
    sort_order: 6,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
];

export function HomePage() {
  const [sections, setSections] = useState<HomepageSection[]>(fallbackSections);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSections() {
      try {
        const { getHomepageSections } = await import("@/lib/services/homepage");
        const data = await getHomepageSections();
        if (data && data.length > 0) {
          setSections(data);
        }
      } catch {
        // Use fallback sections
      } finally {
        setLoading(false);
      }
    }
    fetchSections();
  }, []);

  if (loading) {
    return (
      <div>
        <div className="relative h-[80vh] min-h-[600px] bg-muted animate-pulse">
          <div className="container-xl h-full flex items-center">
            <div className="max-w-2xl space-y-6">
              <Skeleton className="h-16 w-96" />
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-12 w-40 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {sections
        .filter((s) => s.is_active)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((section) => {
          const Component = sectionComponents[section.type];
          if (!Component) return null;

          return (
            <Component
              key={section.id}
              title={section.title || undefined}
              subtitle={section.subtitle || undefined}
              settings={section.settings}
            />
          );
        })}
    </div>
  );
}
