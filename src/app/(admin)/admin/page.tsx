"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { DollarSign, ShoppingCart, Users, TrendingUp, AlertTriangle, ArrowUp, ArrowDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { formatCurrency, formatCompactCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  avgOrderValue: number;
  revenueChange: number;
  lowStockProducts: { id: string; title: string; stock_quantity: number }[];
  recentOrders: { id: string; order_number: string; total: number; fulfillment_status: string; created_at: string; profiles?: { full_name: string; email: string } }[];
}

interface RevenueData {
  date: string;
  revenue: number;
}

function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-border p-5">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <Skeleton className="h-4 w-12" />
      </div>
      <Skeleton className="h-8 w-24 mb-1" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

const statusColors: Record<string, "success" | "warning" | "primary" | "neutral" | "destructive"> = {
  pending: "warning",
  processing: "primary",
  shipped: "primary",
  delivered: "success",
  cancelled: "destructive",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartPeriod, setChartPeriod] = useState<"7d" | "30d" | "90d" | "1y">("30d");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { adminGetDashboardStats, adminGetRevenueChart } = await import("@/lib/services/admin");
      const [statsData, revenueResult] = await Promise.allSettled([
        adminGetDashboardStats(),
        adminGetRevenueChart(chartPeriod),
      ]);

      if (statsData.status === "fulfilled") {
        setStats(statsData.value as unknown as DashboardStats);
      }
      if (revenueResult.status === "fulfilled") {
        setRevenueData(revenueResult.value);
      }
    } catch {
      // Failed to fetch
    } finally {
      setLoading(false);
    }
  }, [chartPeriod]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const kpiCards = [
    { label: "Total Revenue", value: formatCompactCurrency(stats?.totalRevenue || 0), change: stats?.revenueChange || 0, icon: DollarSign, color: "bg-success/10 text-success" },
    { label: "Total Orders", value: (stats?.totalOrders || 0).toLocaleString(), change: 8.2, icon: ShoppingCart, color: "bg-primary/10 text-primary" },
    { label: "Total Customers", value: (stats?.totalCustomers || 0).toLocaleString(), change: 15.3, icon: Users, color: "bg-purple-100 text-purple-600" },
    { label: "Avg Order Value", value: formatCurrency(stats?.avgOrderValue || 0), change: -2.1, icon: TrendingUp, color: "bg-yellow-100 text-yellow-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-foreground-secondary mt-1">Welcome back! Here&apos;s what&apos;s happening with your store.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          : kpiCards.map((card, index) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl border border-border p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${card.color}`}>
                    <card.icon className="w-5 h-5" />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium ${card.change >= 0 ? "text-success" : "text-destructive"}`}>
                    {card.change >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {Math.abs(card.change)}%
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">{card.value}</p>
                <p className="text-xs text-foreground-secondary mt-1">{card.label}</p>
              </motion.div>
            ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-foreground">Revenue Overview</h2>
            <div className="flex gap-1">
              {(["7d", "30d", "90d", "1y"] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setChartPeriod(period)}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    chartPeriod === period
                      ? "bg-primary text-white"
                      : "text-foreground-secondary hover:bg-muted"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          {loading ? (
            <Skeleton className="h-48 w-full" />
          ) : revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6B6B6B" />
                <YAxis tick={{ fontSize: 12 }} stroke="#6B6B6B" tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid rgba(0,0,0,0.06)",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  }}
                  formatter={(value: number) => [formatCurrency(value), "Revenue"]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563EB"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#2563EB" }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-sm text-foreground-secondary">
              No revenue data yet. Start selling to see your revenue chart!
            </div>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <h2 className="font-semibold text-foreground">Low Stock</h2>
          </div>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-5 w-12 rounded-full" />
                </div>
              ))}
            </div>
          ) : stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
            <div className="space-y-3">
              {stats.lowStockProducts.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm truncate">{item.title}</span>
                  <Badge variant="warning">{item.stock_quantity} left</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-foreground-secondary py-4">All products are well stocked!</p>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground">Recent Orders</h2>
          <a href="/admin/orders" className="text-sm text-primary hover:text-primary/80 transition-colors">View All</a>
        </div>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            ))}
          </div>
        ) : stats?.recentOrders && stats.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-foreground-secondary pb-3">Order</th>
                  <th className="text-left text-xs font-medium text-foreground-secondary pb-3">Customer</th>
                  <th className="text-left text-xs font-medium text-foreground-secondary pb-3">Total</th>
                  <th className="text-left text-xs font-medium text-foreground-secondary pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0">
                    <td className="py-3 text-sm font-medium">{order.order_number}</td>
                    <td className="py-3">
                      <p className="text-sm">{order.profiles?.full_name || "Customer"}</p>
                      <p className="text-xs text-foreground-secondary">{order.profiles?.email}</p>
                    </td>
                    <td className="py-3 text-sm">{formatCurrency(order.total)}</td>
                    <td className="py-3"><Badge variant={statusColors[order.fulfillment_status]}>{order.fulfillment_status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-sm text-foreground-secondary">
            No orders yet. Your orders will appear here.
          </div>
        )}
      </div>
    </div>
  );
}
