"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HeroSection } from "@/components/storefront/sections/hero-section";
import { TrustBadgesSection } from "@/components/storefront/sections/trust-badges-section";
import { CategoriesSection } from "@/components/storefront/sections/categories-section";
import { ProductsSection } from "@/components/storefront/sections/products-section";
import { BannerSection } from "@/components/storefront/sections/banner-section";
import { InstagramSection } from "@/components/storefront/sections/instagram-section";
import { NewsletterSection } from "@/components/storefront/sections/newsletter-section";
import { CustomTextSection } from "@/components/storefront/sections/custom-text-section";
import { TestimonialsSection } from "@/components/storefront/sections/testimonials-section";
import { BlogsSection } from "@/components/storefront/sections/blogs-section";
import { DealTodaySection } from "@/components/storefront/sections/deal-today-section";
import { SaleBannerIndustrial } from "@/components/storefront/sections/sale-banner-industrial";
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
  testimonials: TestimonialsSection,
  blogs: BlogsSection,
  deal_today: DealTodaySection,
  sale_banner_industrial: SaleBannerIndustrial,
};

const fallbackSections: HomepageSection[] = [
  {
    id: "fallback-hero",
    type: "hero",
    settings: {
      slides: [
        { image_url: "/images/hero/hero-1.jpg", heading: "Industrial-Grade Parts", subheading: "Heavy-duty components built for performance", cta_text: "Shop Now", cta_link: "/products" },
        { image_url: "/images/hero/hero-2.jpg", heading: "Certified Quality", subheading: "OEM & aftermarket solutions for every vehicle", cta_text: "Explore", cta_link: "/products?sort=newest" },
        { image_url: "/images/hero/hero-3.jpg", heading: "Bulk Pricing", subheading: "Bulk rates for workshops and fleets", cta_text: "View Collection", cta_link: "/products" },
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
    title: "Shop by Category — Engine, Brakes, Electrical & More",
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
    id: "fallback-testimonials",
    type: "testimonials",
    title: "Testimonials",
    subtitle: "Trusted by operators",
    settings: {},
    sort_order: 6,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-deal-today",
    type: "deal_today",
    title: "Deal of the Day",
    subtitle: "Limited Time",
    settings: {},
    sort_order: 7,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-industrial-sale",
    type: "sale_banner_industrial",
    title: "Industrial Parts Sale",
    subtitle: "Commercial",
    settings: {},
    sort_order: 8,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-blogs",
    type: "blogs",
    title: "Blogs & Articles",
    subtitle: "Industry Insights",
    settings: {},
    sort_order: 9,
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
    sort_order: 10,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
];

function SectionWrapper({
  section,
  index,
  children,
}: {
  section: HomepageSection;
  index: number;
  children: React.ReactNode;
}) {
  if (section.type === "hero") return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.05,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

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
        <div className="container-xl py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const activeSections = sections
    .filter((s) => s.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div>
      {activeSections.map((section, index) => {
        const Component = sectionComponents[section.type];
        if (!Component) return null;

        return (
          <SectionWrapper key={section.id} section={section} index={index}>
            <Component
              title={section.title || undefined}
              subtitle={section.subtitle || undefined}
              settings={section.settings}
            />
          </SectionWrapper>
        );
      })}
    </div>
  );
}
