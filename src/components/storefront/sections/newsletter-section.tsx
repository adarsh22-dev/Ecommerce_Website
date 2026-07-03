"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Mail, PartyPopper, ArrowRight, Check } from "lucide-react";
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
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-primary/3 to-transparent rounded-full blur-3xl" />

      <div className="container-xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-2xl mx-auto"
        >
          <div className="rounded-3xl border border-border bg-card/80 backdrop-blur-sm p-8 lg:p-12 shadow-lg">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-5">
                {subscribed ? (
                  <PartyPopper className="w-7 h-7 text-primary" />
                ) : (
                  <Mail className="w-7 h-7 text-primary" />
                )}
              </div>

              {subtitle && (
                <p className="text-caption text-primary mb-3">{subtitle}</p>
              )}
              <h2 className="font-serif text-section-heading text-foreground mb-4">
                {title || "Join Our Newsletter"}
              </h2>
              <p className="text-foreground-secondary mb-8 max-w-md mx-auto leading-relaxed">
                Be the first to know about new arrivals, exclusive offers, and style inspiration. No spam, ever.
              </p>

              {subscribed ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center justify-center gap-2 text-success"
                >
                  <Check className="w-5 h-5" />
                  <span className="font-medium">You're subscribed!</span>
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <div className="flex-1 relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-secondary/60" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full h-12 pl-10 pr-4 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <Button type="submit" className="shimmer-btn h-12 px-6" loading={subscribing}>
                    Subscribe
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
              )}

              <p className="text-xs text-foreground-secondary/60 mt-4">
                By subscribing, you agree to our Privacy Policy and consent to receive updates.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
