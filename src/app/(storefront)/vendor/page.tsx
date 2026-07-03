"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  TrendingUp, DollarSign, ShoppingBag, Package, Eye, ArrowUp, ArrowDown,
  Star, Clock, AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
};

export default function VendorDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 45230,
    totalOrders: 342,
    totalProducts: 28,
    averageOrderValue: 132,
    revenueGrowth: 12.5,
    ordersGrowth: 8.2,
    pendingOrders: 7,
    lowStockItems: 3,
    rating: 4.5,
  });

  const recentOrders = [
    { id: "ORD-1042", customer: "Rahul Sharma", amount: 129.99, status: "pending", date: "2 hours ago" },
    { id: "ORD-1041", customer: "Priya Patel", amount: 249.50, status: "processing", date: "5 hours ago" },
    { id: "ORD-1040", customer: "Amit Singh", amount: 89.99, status: "shipped", date: "1 day ago" },
    { id: "ORD-1039", customer: "Sneha Reddy", amount: 399.00, status: "delivered", date: "2 days ago" },
    { id: "ORD-1038", customer: "Vikram Joshi", amount: 59.99, status: "delivered", date: "3 days ago" },
  ];

  return (
    <div className="space-y-6">
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: DollarSign, label: "Revenue", value: formatCurrency(stats.totalRevenue), change: `+${stats.revenueGrowth}%`, up: true },
          { icon: ShoppingBag, label: "Orders", value: stats.totalOrders, change: `+${stats.ordersGrowth}%`, up: true },
          { icon: Package, label: "Products", value: stats.totalProducts, change: "3 new this month", up: true },
          { icon: TrendingUp, label: "Avg Order Value", value: formatCurrency(stats.averageOrderValue), change: "+5.2%", up: true },
        ].map((card, i) => (
          <motion.div key={card.label} variants={item} className="card p-4 lg:p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-foreground-secondary font-medium">{card.label}</span>
              <card.icon className="w-4 h-4 text-foreground-secondary" />
            </div>
            <p className="text-xl lg:text-2xl font-bold text-foreground">{card.value}</p>
            <div className={`flex items-center gap-1 mt-1.5 text-xs ${card.up ? "text-success" : "text-destructive"}`}>
              {card.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              <span>{card.change}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div variants={item} className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Recent Orders</h2>
            <Link href="/vendor/orders" className="text-xs text-primary hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{order.customer}</p>
                  <p className="text-xs text-foreground-secondary">{order.id} &middot; {order.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{formatCurrency(order.amount)}</p>
                  <span className={`text-[10px] font-medium uppercase tracking-wider ${
                    order.status === "delivered" ? "text-success" :
                    order.status === "shipped" ? "text-blue-500" :
                    order.status === "processing" ? "text-yellow-500" : "text-foreground-secondary"
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Alerts & Performance */}
        <motion.div variants={item} className="space-y-4">
          <div className="card p-5">
            <h2 className="font-semibold text-foreground mb-4">Alerts</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-yellow-50 border border-yellow-200">
                <Clock className="w-4 h-4 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">{stats.pendingOrders} pending orders</p>
                  <p className="text-xs text-yellow-600">Requires your attention</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 border border-red-200">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-red-800">{stats.lowStockItems} products low in stock</p>
                  <p className="text-xs text-red-600">Restock before they run out</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-200">
                <Star className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">{stats.rating} average rating</p>
                  <p className="text-xs text-green-600">Great customer satisfaction</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h2 className="font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/vendor/products">
                <Button variant="secondary" className="w-full">
                  <Package className="w-4 h-4" /> Manage Products
                </Button>
              </Link>
              <Link href="/vendor/wallet">
                <Button variant="secondary" className="w-full">
                  <DollarSign className="w-4 h-4" /> View Wallet
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}