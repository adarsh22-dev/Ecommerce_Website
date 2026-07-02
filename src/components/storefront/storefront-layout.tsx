"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { Header } from "@/components/storefront/header";
import { Footer } from "@/components/storefront/footer";
import { CartDrawer } from "@/components/storefront/cart-drawer";

const AIChatWidget = dynamic(
  () => import("@/components/storefront/ai-chat").then((mod) => mod.AIChatWidget),
  { ssr: false }
);

const BackToTop = dynamic(
  () => import("@/components/storefront/back-to-top").then((mod) => mod.BackToTop),
  { ssr: false }
);

const FloatingCart = dynamic(
  () =>
    import("@/components/storefront/floating-cart").then(
      (mod) => mod.FloatingCart
    ),
  { ssr: false }
);

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const pageTransition = {
  duration: 0.4,
  ease: [0.25, 0.1, 0.25, 1],
};

function AnnouncementBar() {
  const [settings, setSettings] = useState<{
    announcement_bar_active: boolean;
    announcement_bar_text: string | null;
    announcement_bar_link: string | null;
    announcement_bar_color: string | null;
  } | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { getSiteSettings } = await import("@/lib/services/products");
        const data = await getSiteSettings();
        setSettings(data);
      } catch {
        // Not critical
      }
    }
    fetchSettings();
  }, []);

  if (!settings?.announcement_bar_active || !settings.announcement_bar_text) return null;

  const bgColor = settings.announcement_bar_color || "#1A1A1A";

  return (
    <div
      className="text-white text-center py-2 px-4 text-xs tracking-widest uppercase"
      style={{ backgroundColor: bgColor }}
    >
      {settings.announcement_bar_link ? (
        <a href={settings.announcement_bar_link} className="hover:underline">
          {settings.announcement_bar_text}
        </a>
      ) : (
        settings.announcement_bar_text
      )}
    </div>
  );
}

export function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <CartDrawer />
      <FloatingCart />
      <BackToTop />
      <AIChatWidget />
    </div>
  );
}
