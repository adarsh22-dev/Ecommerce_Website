"use client";

import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingBag,
  Bot,
  BarChart3,
  Shield,
  Smartphone,
  Zap,
  Globe,
} from "lucide-react";

const techHighlights = [
  {
    icon: LayoutDashboard,
    title: "Next.js 14 + React 18",
    desc: "App Router, Server Components, SSR, ISR — modern React at its best",
  },
  {
    icon: ShoppingBag,
    title: "Enterprise Commerce Engine",
    desc: "Products, cart, checkout, orders, payments, wishlist, reviews, coupons, and marketplace workflows",
  },
  {
    icon: Bot,
    title: "AI-Powered Assistants",
    desc: "Customer AI chat + Admin AI copilot with streaming and tool calling via GPT-4o",
  },
  {
    icon: BarChart3,
    title: "Admin Analytics",
    desc: "Revenue charts, KPIs, order management, low stock alerts, customer insights",
  },
  {
    icon: Shield,
    title: "Supabase + RLS",
    desc: "PostgreSQL with Row Level Security, real-time auth, storage buckets",
  },
  {
    icon: Smartphone,
    title: "Responsive & Animated",
    desc: "Mobile-first design with Framer Motion, Radix UI, and Tailwind CSS",
  },
  {
    icon: Zap,
    title: "Production Grade",
    desc: "Rate limiting, Sentry, security headers, structured logging, Docker, CI/CD",
  },
  {
    icon: Globe,
    title: ".NET 8 Backend API",
    desc: "ASP.NET Core Web API with EF Core, JWT auth, Swagger, PostgreSQL",
  },
];

export default function AboutPage() {
  return (
    <div className="section-padding">
      <div className="container-xl max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-caption text-primary mb-3">Our Story</p>
          <h1 className="font-serif text-section-heading text-foreground mb-4">
            About ECOM
          </h1>
          <p className="text-lg text-foreground-secondary max-w-2xl mx-auto leading-relaxed">
            A multi-tenant enterprise commerce platform built with Next.js, .NET 8, Supabase,
            and AI for B2C, B2B, vendor, and marketplace scenarios.
          </p>
        </motion.div>

        {/* Tech Stack Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-20"
        >
          {techHighlights.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="card card-hover p-6"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center mb-4">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1.5">{item.title}</h3>
              <p className="text-sm text-foreground-secondary leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="prose prose-lg max-w-none space-y-6 text-foreground-secondary"
        >
          <p className="text-lg leading-relaxed">
            Founded in 2024, ECOM was born from a simple idea: modern commerce needs more than a
            storefront. It needs a flexible platform for customers, vendors, and
            operators to collaborate at enterprise scale.
          </p>
          <p className="leading-relaxed">
            We are building a commerce platform that supports marketplace onboarding, multi-role
            administration, AI copilots, and future-ready SaaS architecture for organizations that
            need speed, control, and resilience.
          </p>
          <p className="leading-relaxed">
            The platform is designed to serve both direct-to-consumer experiences and complex
            B2B or multi-vendor operating models without sacrificing usability or governance.
          </p>

          <h2 className="font-serif text-xl text-foreground mt-8">Our Mission</h2>
          <p className="leading-relaxed">
            To make enterprise commerce simpler, smarter, and more adaptable for organizations that
            need to grow across channels and customer segments. We&apos;re committed to secure
            architecture, thoughtful automation, and a platform experience that scales from a
            single brand to a multi-tenant marketplace.
          </p>

          <h2 className="font-serif text-xl text-foreground mt-8">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 not-prose">
            {[
              { title: "Quality First", desc: "Every product meets our rigorous quality standards before it reaches you." },
              { title: "Sustainable", desc: "Eco-friendly packaging and responsibly sourced materials." },
              { title: "Transparent", desc: "No hidden fees. Fair pricing. Honest descriptions." },
              { title: "Customer Obsessed", desc: "Your satisfaction drives every decision we make." },
            ].map((value) => (
              <div key={value.title} className="p-5 bg-muted rounded-xl">
                <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-sm text-foreground-secondary">{value.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
