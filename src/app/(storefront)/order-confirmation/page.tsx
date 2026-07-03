"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Package, ChevronRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkComplete, setCheckComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setCheckComplete(true), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        setLoading(false);
        return;
      }
      try {
        const supabase = (await import("@/lib/supabase/client")).createClient();
        const { data } = await supabase
          .from("orders")
          .select("*, order_items(*)")
          .eq("id", orderId)
          .single();
        setOrder(data);
      } catch {} finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <div className="container-xl max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="relative mx-auto mb-8 h-24 w-24">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="h-full w-full rounded-full bg-success/10 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                className="h-16 w-16 rounded-full bg-success flex items-center justify-center"
              >
                <motion.svg
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: checkComplete ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="w-8 h-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <motion.path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </motion.svg>
              </motion.div>
            </motion.div>
          </div>

          <h1 className="font-serif text-section-heading text-foreground mb-3">Order Confirmed!</h1>
          <p className="text-foreground-secondary mb-4">
            Thank you for your purchase. You&apos;ll receive a confirmation email shortly.
          </p>

          {loading ? (
            <div className="card p-6 text-left mb-8 space-y-4">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
            </div>
          ) : order ? (
            <div className="card p-6 text-left mb-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground-secondary">Order Number</span>
                  <span className="text-sm font-mono font-semibold text-foreground">
                    {order.order_number || order.id.slice(0, 8).toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground-secondary">Total Paid</span>
                  <span className="text-base font-semibold text-foreground">
                    {formatCurrency(order.total)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground-secondary">Email</span>
                  <span className="text-sm text-foreground">{order.email}</span>
                </div>
                {order.order_items && order.order_items.length > 0 && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-foreground-secondary mb-2">{order.order_items.length} item(s)</p>
                    {order.order_items.slice(0, 3).map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between py-1 text-sm">
                        <span className="text-foreground truncate mr-2">{item.title} &times; {item.quantity}</span>
                        <span className="text-foreground-secondary flex-shrink-0">{formatCurrency(item.line_total)}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary" />
                    <span className="text-sm text-foreground-secondary">Estimated Delivery</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">5-7 business days</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-6 text-left mb-8">
              <div className="flex items-center justify-center gap-3 text-foreground-secondary">
                <ShoppingBag className="w-5 h-5" />
                <span className="text-sm">Order placed. Check your account for details.</span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={order ? `/account/orders/${order.id}` : "/account/orders"}>
              <Button variant="secondary" size="lg">
                Track Order
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/products">
              <Button className="shimmer-btn" size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}