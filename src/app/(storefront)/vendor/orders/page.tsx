"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Search, Eye, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate } from "@/lib/utils";

interface VendorOrder {
  id: string;
  order_number: string;
  customer: string;
  items: number;
  total: number;
  status: string;
  payment: string;
  date: string;
}

const mockOrders: VendorOrder[] = [
  { id: "1", order_number: "ORD-1042", customer: "Rahul Sharma", items: 2, total: 129.99, status: "pending", payment: "paid", date: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: "2", order_number: "ORD-1041", customer: "Priya Patel", items: 1, total: 249.50, status: "processing", payment: "paid", date: new Date(Date.now() - 5 * 3600000).toISOString() },
  { id: "3", order_number: "ORD-1040", customer: "Amit Singh", items: 3, total: 89.99, status: "shipped", payment: "paid", date: new Date(Date.now() - 24 * 3600000).toISOString() },
  { id: "4", order_number: "ORD-1039", customer: "Sneha Reddy", items: 1, total: 399.00, status: "delivered", payment: "paid", date: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "5", order_number: "ORD-1038", customer: "Vikram Joshi", items: 2, total: 59.99, status: "delivered", payment: "paid", date: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: "6", order_number: "ORD-1037", customer: "Neha Gupta", items: 4, total: 189.99, status: "cancelled", payment: "refunded", date: new Date(Date.now() - 5 * 86400000).toISOString() },
];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const paymentColors: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  refunded: "bg-orange-100 text-orange-700",
  failed: "bg-red-100 text-red-700",
};

export default function VendorOrders() {
  const [search, setSearch] = useState("");

  const filtered = mockOrders.filter(o =>
    o.order_number.toLowerCase().includes(search.toLowerCase()) ||
    o.customer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-foreground text-lg">Orders</h2>
        <p className="text-sm text-foreground-secondary">{mockOrders.length} orders containing your products</p>
      </div>

      <Input
        placeholder="Search by order # or customer..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-medium text-foreground-secondary text-xs uppercase tracking-wider">Order</th>
                <th className="text-left px-4 py-3 font-medium text-foreground-secondary text-xs uppercase tracking-wider">Customer</th>
                <th className="text-left px-4 py-3 font-medium text-foreground-secondary text-xs uppercase tracking-wider">Items</th>
                <th className="text-left px-4 py-3 font-medium text-foreground-secondary text-xs uppercase tracking-wider">Total</th>
                <th className="text-left px-4 py-3 font-medium text-foreground-secondary text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 font-medium text-foreground-secondary text-xs uppercase tracking-wider">Payment</th>
                <th className="text-left px-4 py-3 font-medium text-foreground-secondary text-xs uppercase tracking-wider">Date</th>
                <th className="w-10 px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((order) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-muted/20 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-foreground">{order.order_number}</td>
                  <td className="px-4 py-3 text-foreground-secondary">{order.customer}</td>
                  <td className="px-4 py-3 text-foreground-secondary">{order.items}</td>
                  <td className="px-4 py-3 font-semibold text-foreground">{formatCurrency(order.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium capitalize ${statusColors[order.status] || ""}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium capitalize ${paymentColors[order.payment] || ""}`}>
                      {order.payment}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-foreground-secondary">{formatDate(order.date)}</td>
                  <td className="px-4 py-3">
                    <button className="p-1.5 rounded-lg hover:bg-muted text-foreground-secondary hover:text-foreground transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}