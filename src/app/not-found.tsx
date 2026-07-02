"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
        <p className="font-serif text-[120px] font-bold text-foreground/5 leading-none">404</p>
        <h1 className="text-2xl font-semibold text-foreground mt-4">Page Not Found</h1>
        <p className="text-foreground-secondary mt-2 mb-8">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link href="/"><Button className="shimmer-btn" size="lg">Back to Home</Button></Link>
      </motion.div>
    </div>
  );
}
