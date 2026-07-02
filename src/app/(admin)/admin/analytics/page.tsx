"use client";

import { useState } from "react";
import { BarChart3, TrendingUp, ShoppingCart, Users } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const revenueData = [
  { month: "Jan", revenue: 12400, orders: 89 },
  { month: "Feb", revenue: 15600, orders: 112 },
  { month: "Mar", revenue: 18200, orders: 134 },
  { month: "Apr", revenue: 22100, orders: 156 },
  { month: "May", revenue: 19800, orders: 142 },
  { month: "Jun", revenue: 25400, orders: 178 },
];

const topProducts = [
  { name: "Classic Leather Watch", revenue: 46644, units: 156 },
  { name: "Wireless Headphones", revenue: 34202, units: 98 },
  { name: "Minimalist Sneakers", revenue: 21158, units: 142 },
  { name: "Organic Skincare Set", revenue: 9500, units: 76 },
  { name: "Premium Cotton Tee", revenue: 5916, units: 87 },
];

const topCategories = [
  { name: "Accessories", revenue: 52000, percentage: 32 },
  { name: "Electronics", revenue: 38000, percentage: 24 },
  { name: "Footwear", revenue: 28000, percentage: 17 },
  { name: "Clothing", revenue: 24000, percentage: 15 },
  { name: "Beauty", revenue: 19000, percentage: 12 },
];

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState("30d");
  const maxRevenue = Math.max(...revenueData.map((d) => d.revenue));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-foreground-secondary mt-1">Store performance insights</p>
        </div>
        <select value={period} onChange={(e) => setPeriod(e.target.value)} className="h-10 px-4 border border-border rounded-lg text-sm bg-white focus:outline-none">
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="font-semibold mb-6">Revenue Over Time</h2>
        <div className="flex items-end gap-3 h-64">
          {revenueData.map((data, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-medium">{formatCurrency(data.revenue)}</span>
              <div className="w-full bg-primary/20 rounded-t-lg transition-all hover:bg-primary/30 relative group" style={{ height: `${(data.revenue / maxRevenue) * 100}%` }}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {formatCurrency(data.revenue)}
                </div>
              </div>
              <span className="text-xs text-foreground-secondary">{data.month}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="font-semibold mb-4">Top Products by Revenue</h2>
          <div className="space-y-4">
            {topProducts.map((product, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs font-medium text-foreground-secondary w-5">{i + 1}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{product.name}</p>
                  <div className="mt-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${(product.revenue / topProducts[0].revenue) * 100}%` }} />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatCurrency(product.revenue)}</p>
                  <p className="text-xs text-foreground-secondary">{product.units} units</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="font-semibold mb-4">Top Categories</h2>
          <div className="space-y-4">
            {topCategories.map((cat, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs font-medium text-foreground-secondary w-5">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">{cat.name}</p>
                    <p className="text-sm">{formatCurrency(cat.revenue)}</p>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary/60 rounded-full" style={{ width: `${cat.percentage}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
