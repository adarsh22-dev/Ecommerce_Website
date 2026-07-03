"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ShoppingBag, TrendingUp, DollarSign, CreditCard, ArrowUp,
  Package, FileText, Clock, CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
};

export default function WholesalerDashboard() {
  const stats = [
    { icon: ShoppingBag, label: "Total Orders", value: 189, change: "+12% this month", up: true },
    { icon: DollarSign, label: "Total Spent", value: formatCurrency(45230), change: "+8.5% this month", up: true },
    { icon: TrendingUp, label: "Avg Savings", value: "18%", change: "vs retail pricing", up: true },
    { icon: CreditCard, label: "Credit Limit", value: formatCurrency(50000), change: `${formatCurrency(32500)} remaining`, up: true },
  ];

  const recentQuotes = [
    { id: "RFQ-0042", items: 5, status: "pending", date: "2 hours ago" },
    { id: "RFQ-0041", items: 12, status: "quoting", date: "1 day ago" },
    { id: "RFQ-0040", items: 3, status: "completed", date: "3 days ago" },
    { id: "RFQ-0039", items: 8, status: "completed", date: "1 week ago" },
  ];

  return (
    <div className="space-y-6">
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((card) => (
          <motion.div key={card.label} variants={item} className="card p-4 lg:p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-foreground-secondary font-medium">{card.label}</span>
              <card.icon className="w-4 h-4 text-foreground-secondary" />
            </div>
            <p className="text-xl lg:text-2xl font-bold text-foreground">{card.value}</p>
            <div className={`flex items-center gap-1 mt-1.5 text-xs ${card.up ? "text-success" : "text-destructive"}`}>
              {card.up ? <ArrowUp className="w-3 h-3" /> : null}
              <span>{card.change}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent RFQs */}
        <motion.div variants={item} className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Recent RFQs</h2>
            <Link href="/wholesaler/rfq" className="text-xs text-primary hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {recentQuotes.map((q) => (
              <div key={q.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{q.id}</p>
                  <p className="text-xs text-foreground-secondary">{q.items} items &middot; {q.date}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium capitalize ${
                  q.status === "completed" ? "bg-success/10 text-success" :
                  q.status === "quoting" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"
                }`}>
                  {q.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={item} className="space-y-4">
          <div className="card p-5">
            <h2 className="font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/wholesaler/products">
                <Button variant="secondary" className="w-full">
                  <Package className="w-4 h-4" /> Bulk Order
                </Button>
              </Link>
              <Link href="/wholesaler/rfq">
                <Button variant="secondary" className="w-full">
                  <FileText className="w-4 h-4" /> New RFQ
                </Button>
              </Link>
              <Link href="/wholesaler/credit">
                <Button variant="secondary" className="w-full">
                  <CreditCard className="w-4 h-4" /> Credit Info
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="secondary" className="w-full">
                  <ShoppingBag className="w-4 h-4" /> Browse
                </Button>
              </Link>
            </div>
          </div>

          <div className="card p-5">
            <h2 className="font-semibold text-foreground mb-3">Wholesale Benefits</h2>
            <div className="space-y-2">
              {[
                { icon: TrendingUp, text: "Volume discounts up to 35% off retail" },
                { icon: Clock, text: "Net 30 payment terms available" },
                { icon: CheckCircle, text: "Dedicated account manager" },
              ].map((b) => (
                <div key={b.text} className="flex items-center gap-3 text-sm text-foreground-secondary">
                  <b.icon className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}