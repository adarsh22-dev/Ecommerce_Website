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
    system: `You are an AI business copilot for ECOM, a premium e-commerce store.
Your job is to help the store admin understand performance, manage products, and grow sales.
You have access to analytics, product data, and order information.
Be concise, data-driven, and proactive with insights.

When showing data, use simple formatting:
- **Bold** for key numbers
- Bullet points for lists
- Short paragraphs for analysis

Always ask if they want to take action on insights (e.g., create a coupon, update stock, etc.).`,
    messages,
    tools: {
      getDashboardStats: {
        description: "Get a summary of store performance including revenue, orders, customers, and low stock alerts.",
        inputSchema: z.object({}),
        execute: async () => {
          try {
            const { adminGetDashboardStats } = await import("@/lib/services/admin");
            return await adminGetDashboardStats();
          } catch {
            return { error: "Failed to fetch stats" };
          }
        },
      },
      getRevenueData: {
        description: "Get revenue data over a specific time period.",
        inputSchema: z.object({
          period: z.enum(["7d", "30d", "90d", "1y"]).describe("Time period for revenue data"),
        }),
        execute: async ({ period }: { period: "7d" | "30d" | "90d" | "1y" }) => {
          try {
            const { adminGetRevenueChart } = await import("@/lib/services/admin");
            return await adminGetRevenueChart(period);
          } catch {
            return [];
          }
        },
      },
      getProducts: {
        description: "Get product list with filters for status, search, or low stock.",
        inputSchema: z.object({
          status: z.string().optional().describe("Filter by status: active, draft"),
          search: z.string().optional(),
          lowStock: z.boolean().optional().describe("Only show products with low stock (< 10)"),
          limit: z.number().optional().default(10),
        }),
        execute: async ({ status, search, lowStock, limit }: { status?: string; search?: string; lowStock?: boolean; limit?: number }) => {
          try {
            const supabase = await createClient();
            let q = supabase
              .from("products")
              .select("id, title, sku, price, stock_quantity, status, category:categories(name)")
              .limit(limit || 10);

            if (status) q = q.eq("status", status);
            if (search) q = q.or(`title.ilike.%${search}%,sku.ilike.%${search}%`);
            if (lowStock) q = q.lt("stock_quantity", 10);

            const { data } = await q;
            return data || [];
          } catch {
            return [];
          }
        },
      },
      getOrders: {
        description: "Get order list with optional status filter.",
        inputSchema: z.object({
          status: z.string().optional().describe("Filter by fulfillment status: pending, processing, shipped, delivered, cancelled"),
          limit: z.number().optional().default(10),
        }),
        execute: async ({ status, limit }: { status?: string; limit?: number }) => {
          try {
            const supabase = await createClient();
            let q = supabase
              .from("orders")
              .select("id, order_number, total, payment_status, fulfillment_status, created_at, profiles(full_name, email)")
              .order("created_at", { ascending: false })
              .limit(limit || 10);

            if (status) q = q.eq("fulfillment_status", status);
            const { data } = await q;
            return data || [];
          } catch {
            return [];
          }
        },
      },
      createCoupon: {
        description: "Create a new discount coupon.",
        inputSchema: z.object({
          code: z.string().describe("Coupon code (will be uppercased)"),
          type: z.enum(["percentage", "fixed"]).describe("Discount type"),
          value: z.number().describe("Discount value (percentage or fixed amount)"),
          minOrderAmount: z.number().optional().describe("Minimum order amount required"),
          usageLimit: z.number().optional().describe("Maximum number of uses"),
        }),
        execute: async ({ code, type, value, minOrderAmount, usageLimit }: { code: string; type: "percentage" | "fixed"; value: number; minOrderAmount?: number; usageLimit?: number }) => {
          try {
            const supabase = await createClient();
            const { data, error } = await supabase
              .from("coupons")
              .insert({
                code: code.toUpperCase(),
                type,
                value,
                min_order_amount: minOrderAmount || null,
                usage_limit: usageLimit || null,
                times_used: 0,
                is_active: true,
                valid_from: new Date().toISOString(),
              })
              .select()
              .single();
            if (error) throw error;
            return { success: true, coupon: data };
          } catch {
            return { success: false, error: "Failed to create coupon" };
          }
        },
      },
      getTopProducts: {
        description: "Get top selling products by revenue or units sold.",
        inputSchema: z.object({}),
        execute: async () => {
          try {
            const supabase = await createClient();
            const { data: orders } = await supabase
              .from("order_items")
              .select("title, unit_price, quantity, line_total")
              .limit(20);

            if (!orders) return [];

            const grouped: Record<string, { title: string; revenue: number; units: number }> = {};
            for (const item of orders) {
              if (!grouped[item.title]) grouped[item.title] = { title: item.title, revenue: 0, units: 0 };
              grouped[item.title].revenue += Number(item.line_total) || 0;
              grouped[item.title].units += item.quantity || 0;
            }

            return Object.values(grouped)
              .sort((a, b) => b.revenue - a.revenue)
              .slice(0, 5);
          } catch {
            return [];
          }
        },
      },
    },
  });

  return result.toTextStreamResponse();
}
