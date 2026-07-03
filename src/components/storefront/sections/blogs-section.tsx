"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const articles = [
  {
    title: "Essential Truck Maintenance Checklist for Monsoon Season",
    excerpt: "Keep your fleet running smoothly during heavy rains with our comprehensive maintenance guide covering brakes, tires, and electrical systems.",
    image: "/images/banners/industrial-banner.jpg",
    category: "Maintenance",
    date: "Jun 28, 2026",
    readTime: "5 min read",
    slug: "#",
  },
  {
    title: "How to Choose the Right Heavy-Duty Truck Tires",
    excerpt: "A complete guide to tire selection for commercial vehicles including load ratings, tread patterns, and durability comparisons.",
    image: "/images/hero/hero-3.jpg",
    category: "Buying Guide",
    date: "Jun 22, 2026",
    readTime: "7 min read",
    slug: "#",
  },
  {
    title: "Understanding BS6 Emission Norms for Commercial Vehicles",
    excerpt: "Everything transport businesses need to know about BS6 compliance, retrofitting options, and maintaining emission systems.",
    image: "/images/hero/hero-1.jpg",
    category: "Industry News",
    date: "Jun 15, 2026",
    readTime: "6 min read",
    slug: "#",
  },
  {
    title: "Top 10 Signs Your Truck's Brake System Needs Replacement",
    excerpt: "Don't compromise on safety. Learn to identify early warning signs of brake wear and when to replace components.",
    image: "/images/hero/hero-2.jpg",
    category: "Safety",
    date: "Jun 8, 2026",
    readTime: "4 min read",
    slug: "#",
  },
];

export function BlogsSection() {
  return (
    <section className="section-padding">
      <div className="container-xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <p className="text-caption text-primary mb-3">Blogs & Articles</p>
            <h2 className="font-serif text-section-heading text-foreground">Industry insights & tips</h2>
          </div>
          <Link href="/blog" className="hidden sm:flex text-sm font-medium text-primary hover:text-primary/80 transition-colors items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((article, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <Link href={article.slug} className="group block">
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-muted mb-4">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-foreground/80 text-white text-[10px] font-semibold uppercase tracking-wider rounded-md backdrop-blur-sm">
                      {article.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-foreground-secondary mb-2">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{article.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.readTime}</span>
                </div>
                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug mb-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-xs text-foreground-secondary leading-relaxed line-clamp-2">{article.excerpt}</p>
              </Link>
            </motion.article>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/blog">
            <Button variant="secondary" size="sm">
              View All Articles <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}