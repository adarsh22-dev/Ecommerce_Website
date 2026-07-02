"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
  return (
    <section className="py-20">
      <div className="container-xl">
        <div
          className="relative rounded-2xl overflow-hidden p-12 lg:p-20"
          style={{
            background: settings.bg_color
              ? `linear-gradient(135deg, ${settings.bg_color}, ${settings.bg_color}dd)`
              : "linear-gradient(135deg, #1a1a1a, #2a2a2a)",
          }}
        >
          <div className="relative z-10 max-w-xl" style={{ color: settings.text_color || "#ffffff" }}>
            {subtitle && (
              <p className="text-caption mb-4" style={{ color: settings.text_color ? `${settings.text_color}99` : "rgba(255,255,255,0.6)" }}>
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className="font-serif text-section-heading mb-4">{title}</h2>
            )}
            <Link href={settings.cta_link || "/products"}>
              <Button
                className="mt-4 shimmer-btn"
                style={{
                  background: settings.text_color === "#ffffff" ? "#fff" : settings.text_color,
                  color: settings.bg_color || "#1a1a1a",
                }}
                size="lg"
              >
                {settings.cta_text || "Shop Now"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
