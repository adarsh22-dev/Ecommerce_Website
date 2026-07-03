import { streamText } from "ai";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getOpenRouter, getModel, aiNotConfiguredResponse } from "@/lib/ai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const openrouter = await getOpenRouter();
  if (!openrouter) {
    return aiNotConfiguredResponse();
  }

  const model = await getModel();
  const result = await streamText({
    model: openrouter.chat(model),
    system: `You are an AI shopping assistant for ECOM, a premium e-commerce store.
Your job is to help customers find products, answer questions about the store, and provide recommendations.
Be friendly, concise, and helpful. Use the tools available to search products and provide accurate information.

Store details:
- Free shipping on orders over $100
- 30-day return policy
- We ship to 50+ countries
- Products are curated for quality and style

When recommending products, mention prices and key details.
If you can't find a specific product, suggest alternatives or ask clarifying questions.`,
    messages,
    tools: {
      searchProducts: {
        description: "Search for products by name, category, or keywords.",
        inputSchema: z.object({
          query: z.string().describe("Search query for product title or description"),
          maxPrice: z.number().optional().describe("Maximum price filter"),
          category: z.string().optional().describe("Category ID or name to filter by"),
          limit: z.number().optional().default(5),
        }),
        execute: async ({ query, maxPrice, category, limit }: { query: string; maxPrice?: number; category?: string; limit?: number }) => {
          try {
            const supabase = await createClient();
            let q = supabase
              .from("products")
              .select("id, title, slug, price, sale_price, description, category:categories(name), product_images(image_url)")
              .eq("status", "active")
              .limit(limit || 5);

            if (query) q = q.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
            if (maxPrice) q = q.lte("price", maxPrice);
            if (category) q = q.eq("category_id", category);

            const { data } = await q;
            return data || [];
          } catch {
            return [];
          }
        },
      },
      getProductDetails: {
        description: "Get detailed information about a specific product by its slug.",
        inputSchema: z.object({
          slug: z.string().describe("The product slug/URL identifier"),
        }),
        execute: async ({ slug }: { slug: string }) => {
          try {
            const supabase = await createClient();
            const { data } = await supabase
              .from("products")
              .select("*, category:categories(name), product_images(*), product_variants(*)")
              .eq("slug", slug)
              .single();
            return data;
          } catch {
            return null;
          }
        },
      },
      getStoreInfo: {
        description: "Get store information like shipping policy, return policy, FAQ.",
        inputSchema: z.object({
          topic: z.string().describe("The topic: shipping, returns, faq, or general"),
        }),
        execute: async ({ topic }: { topic: string }) => {
          const info: Record<string, string> = {
            shipping: "Free standard shipping on orders over $100 (5-7 business days). Express shipping available for $15 (2-3 business days). International shipping to 50+ countries.",
            returns: "30-day return policy on all unworn items. Items must be in original packaging with tags attached.",
            faq: "We accept all major credit cards via Razorpay. Orders can be modified within 2 hours of placement. Digital gift cards available from $25-$200.",
            general: "ECOM offers premium curated products across fashion, electronics, accessories, and lifestyle categories.",
          };
          return info[topic] || info.general;
        },
      },
    },
  });

  return result.toTextStreamResponse();
}
