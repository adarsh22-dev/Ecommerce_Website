import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

interface SitemapUrl {
  loc: string;
  priority: string;
  changefreq: string;
  lastmod?: string;
}

async function getDynamicUrls() {
  // In production, fetch from Supabase
  // const { createClient } = await import("@/lib/supabase/server");
  // const supabase = await createClient();
  // const [products, categories] = await Promise.all([
  //   supabase.from("products").select("slug, updated_at").eq("status", "active"),
  //   supabase.from("categories").select("slug"),
  // ]);
  // return { products: products.data || [], categories: categories.data || [] };

  return { products: [] as { slug: string; updated_at?: string }[], categories: [] as { slug: string }[] };
}

export async function GET() {
  const { products, categories } = await getDynamicUrls();

  const staticPages: SitemapUrl[] = [
    { loc: "/", priority: "1.0", changefreq: "weekly" },
    { loc: "/products", priority: "0.9", changefreq: "daily" },
    { loc: "/about", priority: "0.5", changefreq: "monthly" },
    { loc: "/contact", priority: "0.5", changefreq: "monthly" },
    { loc: "/faq", priority: "0.5", changefreq: "monthly" },
    { loc: "/cart", priority: "0.3", changefreq: "monthly" },
    { loc: "/auth", priority: "0.3", changefreq: "monthly" },
    { loc: "/policies/shipping", priority: "0.4", changefreq: "monthly" },
    { loc: "/policies/returns", priority: "0.4", changefreq: "monthly" },
    { loc: "/policies/privacy", priority: "0.4", changefreq: "monthly" },
    { loc: "/policies/terms", priority: "0.4", changefreq: "monthly" },
  ];

  const productUrls: SitemapUrl[] = products.map((p) => {
    const url: SitemapUrl = {
      loc: `/products/${p.slug}`,
      priority: "0.8",
      changefreq: "weekly",
    };
    if (p.updated_at) {
      url.lastmod = p.updated_at;
    }
    return url;
  });

  const categoryUrls: SitemapUrl[] = categories.map((c) => ({
    loc: `/products?category=${c.slug}`,
    priority: "0.6",
    changefreq: "weekly",
  }));

  const allUrls = [...staticPages, ...productUrls, ...categoryUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls
    .map(
      (url) => `
  <url>
    <loc>${BASE_URL}${url.loc}</loc>
    <priority>${url.priority}</priority>
    <changefreq>${url.changefreq}</changefreq>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ""}
  </url>`
    )
    .join("")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
