"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Package, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

// In production, order data would come from URL params/state/DB
const placeholderOrder = {
  order_number: "ORD-10001",
  email: "customer@email.com",
  total: 299.00,
  estimated_delivery: "5-7 business days",
};

export default function OrderConfirmationPage() {
  const [checkComplete, setCheckComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setCheckComplete(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <div className="container-xl max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Animated Checkmark */}
          <div className="relative mx-auto mb-8 h-24 w-24">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
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
                  <motion.path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </motion.svg>
              </motion.div>
            </motion.div>
          </div>

          <h1 className="font-serif text-section-heading text-foreground mb-3">
            Order Confirmed!
          </h1>
          <p className="text-foreground-secondary mb-4">
            Thank you for your purchase. You&apos;ll receive a confirmation email shortly.
          </p>

          {/* Order Details Card */}
          <div className="card p-6 text-left mb-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-secondary">Order Number</span>
                <span className="text-sm font-mono font-semibold text-foreground">
                  {placeholderOrder.order_number}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-secondary">Total Paid</span>
                <span className="text-base font-semibold text-foreground">
                  {formatCurrency(placeholderOrder.total)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-secondary">Confirmation</span>
                <span className="text-sm text-foreground">{placeholderOrder.email}</span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground-secondary">Estimated Delivery</span>
                </div>
                <span className="text-sm font-medium text-foreground">
                  {placeholderOrder.estimated_delivery}
                </span>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/account/orders/1">
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
