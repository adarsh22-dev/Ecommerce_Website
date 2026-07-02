"use client";

import Link from "next/link";
import { Package, ChevronRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatCurrency } from "@/lib/utils";

const placeholderOrders = [
  {
    id: "1",
    order_number: "ORD-10001",
    created_at: "2024-01-15T10:00:00Z",
    total: 598,
    payment_status: "paid",
    fulfillment_status: "delivered",
    order_items: [
      { id: "1", title: "Classic Leather Watch", quantity: 2, unit_price: 299, line_total: 598 },
    ],
  },
  {
    id: "2",
    order_number: "ORD-10002",
    created_at: "2024-01-20T14:30:00Z",
    total: 257,
    payment_status: "paid",
    fulfillment_status: "shipped",
    order_items: [
      { id: "2", title: "Minimalist Sneakers", quantity: 1, unit_price: 149, line_total: 149 },
      { id: "3", title: "Premium Cotton Tee", quantity: 1, unit_price: 68, line_total: 68 },
      { id: "4", title: "Canvas Tote Bag", quantity: 1, unit_price: 55, line_total: 55 },
    ],
  },
  {
    id: "3",
    order_number: "ORD-10003",
    created_at: "2024-01-25T09:15:00Z",
    total: 349,
    payment_status: "paid",
    fulfillment_status: "processing",
    order_items: [
      { id: "5", title: "Wireless Headphones", quantity: 1, unit_price: 349, line_total: 349 },
    ],
  },
];

const statusColors: Record<string, "success" | "warning" | "primary" | "neutral" | "destructive"> = {
  pending: "warning",
  processing: "primary",
  shipped: "primary",
  delivered: "success",
  cancelled: "destructive",
  paid: "success",
};

export default function OrdersPage() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-6">Order History</h2>

      {placeholderOrders.length === 0 ? (
        <div className="card p-12 text-center">
          <Package className="w-16 h-16 text-foreground-secondary/20 mx-auto mb-4" />
          <p className="text-lg font-medium mb-2">No orders yet</p>
          <p className="text-sm text-foreground-secondary mb-6">Start shopping to see your orders here.</p>
          <Link href="/products">
            <Button className="shimmer-btn">Shop Now</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {placeholderOrders.map((order) => (
            <div key={order.id} className="card p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <p className="font-medium text-foreground">{order.order_number}</p>
                  <p className="text-sm text-foreground-secondary">{formatDate(order.created_at)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={statusColors[order.fulfillment_status] || "neutral"}>
                    {order.fulfillment_status}
                  </Badge>
                  <Badge variant={statusColors[order.payment_status] || "neutral"}>
                    {order.payment_status}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-foreground-secondary">
                      {item.title} × {item.quantity}
                    </span>
                    <span className="font-medium">{formatCurrency(item.line_total)}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <p className="text-base font-semibold">Total: {formatCurrency(order.total)}</p>
                <Link href={`/account/orders/${order.id}`} className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
                  View Details <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
