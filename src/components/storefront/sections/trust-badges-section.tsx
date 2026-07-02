"use client";

import { Truck, Shield, RotateCcw, Headphones } from "lucide-react";

export function TrustBadgesSection() {
  const badges = [
    { icon: Truck, label: "Free Shipping", sublabel: "On orders over $100" },
    { icon: Shield, label: "Secure Payment", sublabel: "100% protected" },
    { icon: RotateCcw, label: "Easy Returns", sublabel: "30-day policy" },
    { icon: Headphones, label: "24/7 Support", sublabel: "Always here to help" },
  ];

  return (
    <section className="border-b border-border">
      <div className="container-xl py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-foreground-secondary">{item.sublabel}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
