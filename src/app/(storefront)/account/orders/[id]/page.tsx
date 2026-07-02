"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatCurrency } from "@/lib/utils";

const placeholderOrder = {
  id: "1",
  order_number: "ORD-10001",
  created_at: "2024-01-15T10:00:00Z",
  total: 598,
  subtotal: 598,
  discount_amount: 0,
  shipping_cost: 0,
  tax_amount: 0,
  payment_status: "paid",
  fulfillment_status: "delivered",
  tracking_number: "TRK123456789",
  tracking_carrier: "FedEx",
  email: "john@example.com",
  shipping_address: { full_name: "John Doe", address_line1: "123 Main St", city: "New York", state: "NY", zip: "10001" },
  order_items: [
    { id: "1", title: "Classic Leather Watch", quantity: 2, unit_price: 299, line_total: 598, variant_info: { Color: "Brown", Size: "40mm" } },
  ],
  order_timeline: [
    { status: "delivered", note: "Package delivered", created_at: "2024-01-20T14:00:00Z" },
    { status: "shipped", note: "Package shipped via FedEx", created_at: "2024-01-18T09:00:00Z" },
    { status: "processing", note: "Order confirmed", created_at: "2024-01-16T10:00:00Z" },
    { status: "pending", note: "Order placed", created_at: "2024-01-15T10:00:00Z" },
  ],
};

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = placeholderOrder;
  return (
    <div>
      <nav className="flex items-center gap-2 text-sm text-foreground-secondary mb-6">
        <Link href="/account/orders" className="hover:text-foreground">Orders</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground font-medium">{order.order_number}</span>
      </nav>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">{order.order_number}</h2>
          <p className="text-sm text-foreground-secondary">{formatDate(order.created_at)}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant={order.fulfillment_status === "delivered" ? "success" : "primary"}>{order.fulfillment_status}</Badge>
          <Badge variant={order.payment_status === "paid" ? "success" : "warning"}>{order.payment_status}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold mb-4">Items</h3>
            {order.order_items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-foreground-secondary">
                    {Object.entries(item.variant_info || {}).map(([k, v]) => `${k}: ${v}`).join(" · ")} · Qty: {item.quantity}
                  </p>
                </div>
                <p className="font-medium">{formatCurrency(item.line_total)}</p>
              </div>
            ))}
            <div className="mt-4 pt-4 border-t border-border space-y-2">
              <div className="flex justify-between text-sm"><span className="text-foreground-secondary">Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-foreground-secondary">Shipping</span><span>{order.shipping_cost === 0 ? "Free" : formatCurrency(order.shipping_cost)}</span></div>
              <div className="flex justify-between text-base font-semibold"><span>Total</span><span>{formatCurrency(order.total)}</span></div>
            </div>
          </div>

          {order.tracking_number && (
            <div className="card p-6">
              <h3 className="font-semibold mb-2">Tracking</h3>
              <p className="text-sm text-foreground-secondary">{order.tracking_carrier}: {order.tracking_number}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold mb-4">Shipping Address</h3>
            <p className="text-sm">{(order.shipping_address as any).full_name}</p>
            <p className="text-sm text-foreground-secondary">{(order.shipping_address as any).address_line1}</p>
            <p className="text-sm text-foreground-secondary">{(order.shipping_address as any).city}, {(order.shipping_address as any).state} {(order.shipping_address as any).zip}</p>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold mb-4">Timeline</h3>
            <div className="space-y-4">
              {order.order_timeline.map((event, i) => (
                <div key={i} className="flex gap-3">
                  <div className="relative flex flex-col items-center">
                    <div className={`h-3 w-3 rounded-full flex-shrink-0 ${i === 0 ? "bg-success" : "bg-muted"}`} />
                    {i < order.order_timeline.length - 1 && <div className="w-px h-full bg-border absolute top-3" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium capitalize">{event.status}</p>
                    <p className="text-xs text-foreground-secondary">{event.note}</p>
                    <p className="text-xs text-foreground-secondary">{formatDate(event.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
