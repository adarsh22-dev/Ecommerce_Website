"use client";

import { motion } from "framer-motion";
import { Truck, Shield, RotateCcw, Headphones } from "lucide-react";

const badges = [
  { icon: Truck, label: "Free Shipping", sublabel: "On orders over $100" },
  { icon: Shield, label: "Secure Payment", sublabel: "100% protected" },
  { icon: RotateCcw, label: "Easy Returns", sublabel: "30-day policy" },
  { icon: Headphones, label: "24/7 Support", sublabel: "Always here to help" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

export function TrustBadgesSection() {
  return (
    <section className="border-b border-border bg-background-secondary/30">
      <div className="container-xl py-8">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={badge.label}
                variants={item}
                className="flex items-center gap-3 group"
              >
                <div className="h-11 w-11 rounded-xl bg-primary/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{badge.label}</p>
                  <p className="text-xs text-foreground-secondary">{badge.sublabel}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
