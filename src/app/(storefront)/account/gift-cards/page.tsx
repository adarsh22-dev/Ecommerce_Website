"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Plus, Copy, Check, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

interface GiftCard {
  id: string;
  code: string;
  balance: number;
  initial_amount: number;
  recipient_name: string | null;
  status: "active" | "used" | "expired";
  valid_to: string | null;
  created_at: string;
}

export default function GiftCardsPage() {
  const [cards] = useState<GiftCard[]>([
    { id: "1", code: "GIFT-ABC123", balance: 50, initial_amount: 100, recipient_name: null, status: "active", valid_to: new Date(Date.now() + 365 * 86400000).toISOString(), created_at: new Date().toISOString() },
    { id: "2", code: "GIFT-DEF456", balance: 25, initial_amount: 75, recipient_name: "Priya", status: "active", valid_to: new Date(Date.now() + 180 * 86400000).toISOString(), created_at: new Date(Date.now() - 30 * 86400000).toISOString() },
    { id: "3", code: "GIFT-GHI789", balance: 0, initial_amount: 50, recipient_name: "Amit", status: "used", valid_to: null, created_at: new Date(Date.now() - 60 * 86400000).toISOString() },
  ]);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success("Gift card code copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activeBalance = cards.filter(c => c.status === "active").reduce((s, c) => s + c.balance, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-foreground text-lg">Gift Cards</h2>
        <p className="text-sm text-foreground-secondary">Manage your gift cards and balances</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-5 bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-pink-200/30"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
            <Gift className="w-5 h-5 text-pink-600" />
          </div>
          <div>
            <p className="text-xs text-foreground-secondary font-medium">Total Active Balance</p>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(activeBalance)}</p>
          </div>
        </div>
        <Button size="sm" className="shimmer-btn">
          <Plus className="w-4 h-4" /> Buy a Gift Card
        </Button>
      </motion.div>

      <div className="space-y-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`card p-5 ${card.status === "used" ? "opacity-60" : ""}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-pink-500" />
                  <span className="text-sm font-semibold text-foreground font-mono">{card.code}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${
                    card.status === "active" ? "bg-success/10 text-success" :
                    card.status === "used" ? "bg-foreground-secondary/10 text-foreground-secondary" : "bg-destructive/10 text-destructive"
                  }`}>
                    {card.status}
                  </span>
                </div>
                {card.recipient_name && (
                  <p className="text-xs text-foreground-secondary mt-1">From: {card.recipient_name}</p>
                )}
              </div>
              <button
                onClick={() => copyCode(card.code, card.id)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                {copiedId === card.id ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  <Copy className="w-4 h-4 text-foreground-secondary" />
                )}
              </button>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-lg font-bold text-foreground">{formatCurrency(card.balance)}</p>
                <p className="text-xs text-foreground-secondary">of {formatCurrency(card.initial_amount)} remaining</p>
              </div>
              <div className="text-right text-xs text-foreground-secondary">
                {card.valid_to && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Expires {formatDate(card.valid_to)}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {cards.length === 0 && (
        <div className="text-center py-12">
          <Gift className="w-12 h-12 text-foreground-secondary/20 mx-auto mb-4" />
          <p className="text-foreground-secondary">No gift cards yet</p>
        </div>
      )}
    </div>
  );
}