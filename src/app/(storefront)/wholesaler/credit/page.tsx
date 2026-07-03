"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, TrendingUp, ArrowUpRight, ArrowDownRight, CheckCircle, Clock } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function WholesalerCredit() {
  const [credit] = useState({
    creditLimit: 50000,
    used: 17500,
    available: 32500,
    paymentTerms: "Net 30",
    nextPayment: new Date(Date.now() + 14 * 86400000).toISOString(),
  });

  const transactions = [
    { id: "1", type: "debit", amount: 3200, description: "Order ORD-1042", date: new Date().toISOString(), status: "pending" },
    { id: "2", type: "debit", amount: 5800, description: "Bulk Order BO-089", date: new Date(Date.now() - 5 * 86400000).toISOString(), status: "posted" },
    { id: "3", type: "credit", amount: 3200, description: "Payment received", date: new Date(Date.now() - 10 * 86400000).toISOString(), status: "posted" },
    { id: "4", type: "debit", amount: 8500, description: "Bulk Order BO-088", date: new Date(Date.now() - 15 * 86400000).toISOString(), status: "posted" },
    { id: "5", type: "credit", amount: 5000, description: "Payment received", date: new Date(Date.now() - 20 * 86400000).toISOString(), status: "posted" },
  ];

  const usedPercent = (credit.used / credit.creditLimit) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-foreground text-lg">Credit & Billing</h2>
        <p className="text-sm text-foreground-secondary">{credit.paymentTerms} payment terms</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-5 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/10"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-foreground-secondary font-medium">Credit Limit</p>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(credit.creditLimit)}</p>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-foreground-secondary">Used: {formatCurrency(credit.used)}</span>
            <span className="text-foreground-secondary">Available: {formatCurrency(credit.available)}</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{ width: `${usedPercent}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm pt-3 border-t border-primary/10">
          <div className="flex items-center gap-1.5 text-foreground-secondary">
            <Clock className="w-3.5 h-3.5" />
            <span>Next payment due: {formatDate(credit.nextPayment)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-success">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Account in good standing</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-5"
      >
        <h3 className="font-semibold text-foreground mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  tx.type === "credit" ? "bg-success/10" : "bg-destructive/10"
                }`}>
                  {tx.type === "credit" ? (
                    <ArrowDownRight className="w-4 h-4 text-success" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4 text-destructive" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{tx.description}</p>
                  <p className="text-xs text-foreground-secondary">{formatDate(tx.date)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${tx.type === "credit" ? "text-success" : "text-destructive"}`}>
                  {tx.type === "credit" ? "+" : "-"}{formatCurrency(tx.amount)}
                </p>
                <span className={`text-[10px] font-medium capitalize ${
                  tx.status === "posted" ? "text-success" : "text-yellow-600"
                }`}>
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}