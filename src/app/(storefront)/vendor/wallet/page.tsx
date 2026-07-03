"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownRight, CreditCard, Download, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function VendorWallet() {
  const [wallet] = useState({
    pendingBalance: 12450.00,
    availableBalance: 8920.50,
    totalEarned: 156700.00,
    totalWithdrawn: 147780.00,
  });

  const transactions = [
    { id: "1", type: "credit", amount: 129.99, description: "Order ORD-1042 commission", date: new Date().toISOString(), status: "pending" },
    { id: "2", type: "credit", amount: 249.50, description: "Order ORD-1041 commission", date: new Date(Date.now() - 86400000).toISOString(), status: "completed" },
    { id: "3", type: "debit", amount: 5000.00, description: "Withdrawal to bank account", date: new Date(Date.now() - 2 * 86400000).toISOString(), status: "completed" },
    { id: "4", type: "credit", amount: 89.99, description: "Order ORD-1040 commission", date: new Date(Date.now() - 3 * 86400000).toISOString(), status: "completed" },
    { id: "5", type: "credit", amount: 399.00, description: "Order ORD-1039 commission", date: new Date(Date.now() - 4 * 86400000).toISOString(), status: "completed" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-foreground text-lg">Wallet & Earnings</h2>
        <p className="text-sm text-foreground-secondary">Track your commissions and withdrawals</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <div className="card p-5 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-foreground-secondary font-medium">Available Balance</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(wallet.availableBalance)}</p>
            </div>
          </div>
          <Button size="sm" className="w-full shimmer-btn">
            <Download className="w-4 h-4" /> Withdraw Funds
          </Button>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-foreground-secondary font-medium">Pending Clearance</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(wallet.pendingBalance)}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-yellow-600">
            <Clock className="w-3 h-3" />
            <span>Available in 3-5 business days</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-4"
      >
        <div className="card p-4">
          <p className="text-xs text-foreground-secondary">Total Earned</p>
          <p className="text-lg font-bold text-foreground mt-1">{formatCurrency(wallet.totalEarned)}</p>
          <TrendingUp className="w-4 h-4 text-success mt-1" />
        </div>
        <div className="card p-4">
          <p className="text-xs text-foreground-secondary">Total Withdrawn</p>
          <p className="text-lg font-bold text-foreground mt-1">{formatCurrency(wallet.totalWithdrawn)}</p>
          <ArrowUpRight className="w-4 h-4 text-foreground-secondary mt-1" />
        </div>
      </motion.div>

      <div className="card p-5">
        <h3 className="font-semibold text-foreground mb-4">Transaction History</h3>
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  tx.type === "credit" ? "bg-success/10" : "bg-destructive/10"
                }`}>
                  {tx.type === "credit" ? (
                    <ArrowUpRight className="w-4 h-4 text-success" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-destructive" />
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
                  tx.status === "completed" ? "text-success" : "text-yellow-600"
                }`}>
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}