"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, Wrench, ShieldCheck, PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SaleBannerIndustrial() {
  return (
    <section className="section-padding">
      <div className="container-xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Background with industrial gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900 via-amber-800 to-stone-900" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-40 h-40 border-2 border-white/20 rounded-full" />
            <div className="absolute bottom-10 right-10 w-60 h-60 border-2 border-white/10 rounded-full" />
            <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-white/10 rounded-full blur-xl" />
          </div>

          {/* Industrial pattern overlay */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.03) 20px, rgba(255,255,255,0.03) 21px)`,
            }}
          />

          <div className="relative z-10 p-8 lg:p-16">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                >
                  <div className="flex items-center gap-2 text-amber-400/80 text-caption mb-4">
                    <PackageOpen className="w-4 h-4" />
                    <span className="tracking-[0.2em] uppercase">Commercial & Industrial</span>
                  </div>
                  <h2 className="font-serif text-4xl lg:text-5xl text-white leading-[1.1]">
                    Heavy-Duty Parts
                    <br />
                    <span className="text-amber-400">Bulk Discounts</span>
                  </h2>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-amber-100/70 text-lg max-w-md leading-relaxed"
                >
                  Genuine truck parts, tractor components, and industrial machinery spares at competitive prices. Pan-India delivery with fleet-order priority.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="grid grid-cols-2 gap-4"
                >
                  {[
                    { icon: Truck, label: "Fleet Discounts", sub: "5+ units" },
                    { icon: Wrench, label: "Genuine Parts", sub: "OEM certified" },
                    { icon: ShieldCheck, label: "Warranty", sub: "Up to 2 years" },
                    { icon: PackageOpen, label: "Bulk Shipping", sub: "Free over $500" },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-3 bg-white/5 rounded-xl p-3 backdrop-blur-sm">
                      <item.icon className="w-5 h-5 text-amber-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-white">{item.label}</p>
                        <p className="text-xs text-amber-200/60">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="flex flex-wrap gap-3 pt-2"
                >
                  <Link href="/products?category=truck-parts">
                    <Button className="bg-amber-400 text-foreground hover:bg-amber-500 group" size="lg">
                      Shop Truck Parts
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/20" size="lg">
                      Request Quote
                    </Button>
                  </Link>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="hidden lg:block relative"
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/images/banners/industrial-banner.jpg"
                    alt="Heavy duty truck parts"
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-900/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 text-foreground">
                      <p className="text-sm font-bold">Tata Motors Certified</p>
                      <p className="text-xs text-foreground-secondary">Authorized heavy-duty parts distributor</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}