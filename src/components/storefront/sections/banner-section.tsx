"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BannerSectionProps {
  title?: string;
  subtitle?: string;
  settings: {
    image_url?: string;
    cta_text?: string;
    cta_link?: string;
    bg_color?: string;
    text_color?: string;
  };
}

export function BannerSection({ title, subtitle, settings }: BannerSectionProps) {
  const bgColor = settings.bg_color || "#1a1a1a";
  const textColor = settings.text_color || "#ffffff";

  return (
    <section className="py-20">
      <div className="container-xl">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative rounded-3xl overflow-hidden p-12 lg:p-20"
          style={{
            background: `linear-gradient(135deg, ${bgColor}, ${bgColor}dd)`,
          }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10" style={{ color: textColor }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              {subtitle && (
                <p
                  className="text-caption mb-4 flex items-center gap-2"
                  style={{ color: `${textColor}99` }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {subtitle}
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {title && (
                <h2 className="font-serif text-section-heading mb-6 max-w-xl">{title}</h2>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.45, duration: 0.5 }}
            >
              <Link href={settings.cta_link || "/products"}>
                <Button
                  className="group shimmer-btn"
                  style={{
                    background: textColor === "#ffffff" ? "#fff" : textColor,
                    color: bgColor,
                  }}
                  size="lg"
                >
                  <span>{settings.cta_text || "Shop Now"}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
