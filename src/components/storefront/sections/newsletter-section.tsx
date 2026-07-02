"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface NewsletterSectionProps {
  title?: string;
  subtitle?: string;
  settings?: Record<string, any>;
}

export function NewsletterSection({ title, subtitle }: NewsletterSectionProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribing(true);
    try {
      const { subscribeToNewsletter } = await import("@/lib/services/products");
      const result = await subscribeToNewsletter(email);
      toast.success(result.message);
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubscribing(false);
    }
  }, [email]);

  return (
    <section className="section-padding bg-background-secondary">
      <div className="container-xl">
        <div className="max-w-xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {subtitle && (
              <p className="text-caption text-primary mb-3">{subtitle}</p>
            )}
            <h2 className="font-serif text-section-heading text-foreground mb-4">
              {title || "Join Our Newsletter"}
            </h2>
            <p className="text-foreground-secondary mb-8">
              Be the first to know about new arrivals, exclusive offers, and style inspiration.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 h-12 px-4 rounded-lg bg-white border border-border text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <Button type="submit" className="shimmer-btn h-12 px-6" loading={subscribing}>
                {subscribed ? "Subscribed!" : "Subscribe"}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
