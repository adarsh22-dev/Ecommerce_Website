"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gem, Star, TrendingUp, Gift, Award, ChevronRight, Clock } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function LoyaltyPage() {
  const [points] = useState(2450);
  const [tier, setTier] = useState<"bronze" | "silver" | "gold" | "platinum">("gold");

  const tierInfo = {
    bronze: { min: 0, color: "from-amber-700/20 to-amber-600/10", text: "text-amber-700", icon: Star },
    silver: { min: 500, color: "from-slate-400/20 to-slate-300/10", text: "text-slate-500", icon: Star },
    gold: { min: 2000, color: "from-yellow-500/20 to-yellow-400/10", text: "text-yellow-600", icon: Gem },
    platinum: { min: 5000, color: "from-indigo-500/20 to-purple-500/10", text: "text-indigo-500", icon: Award },
  };

  const nextTier = tier === "bronze" ? "silver" : tier === "silver" ? "gold" : tier === "gold" ? "platinum" : null;
  const nextTierMin = nextTier ? tierInfo[nextTier].min : null;
  const pointsToNext = nextTierMin ? nextTierMin - points : 0;
  const progress = nextTierMin ? (points / nextTierMin) * 100 : 100;

  const currentTier = tierInfo[tier];

  const history = [
    { action: "Purchase - Order #ORD-1042", points: 150, date: new Date().toISOString() },
    { action: "Purchase - Order #ORD-1039", points: 400, date: new Date(Date.now() - 7 * 86400000).toISOString() },
    { action: "Birthday Bonus", points: 200, date: new Date(Date.now() - 14 * 86400000).toISOString() },
    { action: "Purchase - Order #ORD-1035", points: 300, date: new Date(Date.now() - 21 * 86400000).toISOString() },
    { action: "Review Reward - Hydraulic Cylinder", points: 50, date: new Date(Date.now() - 30 * 86400000).toISOString() },
  ];

  const perks: Record<string, string[]> = {
    bronze: ["1 point per $1 spent", "Member-only sales access"],
    silver: ["1.5 points per $1 spent", "Free standard shipping", "Birthday bonus 200 points"],
    gold: ["2 points per $1 spent", "Free express shipping", "Birthday bonus 500 points", "Early access to sales"],
    platinum: ["3 points per $1 spent", "Free priority shipping", "Birthday bonus 1000 points", "Early access to sales", "Dedicated support"],
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-foreground text-lg">Loyalty Rewards</h2>
        <p className="text-sm text-foreground-secondary">Earn points with every purchase and unlock perks</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`card p-5 bg-gradient-to-br ${currentTier.color} border-transparent`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center">
              <currentTier.icon className={`w-6 h-6 ${currentTier.text}`} />
            </div>
            <div>
              <p className="text-xs text-foreground-secondary font-medium uppercase">{tier} Tier</p>
              <p className="text-3xl font-bold text-foreground">{points.toLocaleString()}</p>
              <p className="text-xs text-foreground-secondary">total points</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
          </div>
        </div>

        {nextTier && (
          <div>
            <div className="flex items-center justify-between text-xs text-foreground-secondary mb-1.5">
              <span>Progress to {nextTier}</span>
              <span>{points.toLocaleString()} / {nextTierMin?.toLocaleString()}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${Math.min(progress, 100)}%` }} />
            </div>
            <p className="text-xs text-foreground-secondary mt-1.5">{pointsToNext.toLocaleString()} points to reach {nextTier}</p>
          </div>
        )}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-5"
        >
          <h3 className="font-semibold text-foreground mb-4">{tier.charAt(0).toUpperCase() + tier.slice(1)} Perks</h3>
          <div className="space-y-2">
            {perks[tier].map((perk) => (
              <div key={perk} className="flex items-center gap-2 text-sm text-foreground-secondary">
                <Award className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{perk}</span>
              </div>
            ))}
          </div>
          {nextTier && (
            <div className="mt-4 p-3 rounded-lg bg-muted/50">
              <p className="text-xs font-medium text-foreground mb-2">Next tier: {nextTier}</p>
              <div className="space-y-1">
                {(perks[nextTier] || []).filter(p => !perks[tier].includes(p)).map((perk) => (
                  <div key={perk} className="flex items-center gap-1.5 text-xs text-foreground-secondary">
                    <ChevronRight className="w-3 h-3 text-primary" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card p-5"
        >
          <h3 className="font-semibold text-foreground mb-4">Points History</h3>
          <div className="space-y-3">
            {history.map((entry, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                <div>
                  <p className="text-sm text-foreground">{entry.action}</p>
                  <p className="text-xs text-foreground-secondary">{formatDate(entry.date)}</p>
                </div>
                <span className="text-sm font-semibold text-success">+{entry.points}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}