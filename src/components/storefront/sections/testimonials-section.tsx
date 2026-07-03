"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rajesh Mehta",
    role: "Fleet Owner, Mumbai",
    avatar: "RM",
    content: "The quality of parts here is exceptional. We've been sourcing truck components for our entire fleet and the reliability has cut our maintenance downtime by half.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Workshop Manager, Delhi",
    avatar: "PS",
    content: "Finally found a place that stocks genuine heavy-duty parts. The AI chat helped me find the exact alternator I needed in seconds. Highly recommend for commercial vehicle repairs.",
    rating: 5,
  },
  {
    name: "Amit Verma",
    role: "Transport Business Owner",
    avatar: "AV",
    content: "Bulk pricing on truck tires and brake systems saved us over 30% compared to local dealers. Fast delivery and genuine products. Game changer for our operations.",
    rating: 5,
  },
  {
    name: "Sunil Patel",
    role: "Garage Owner, Gujarat",
    avatar: "SP",
    content: "I was struggling to find compatible parts for older truck models. Their catalog is extensive and the detailed specifications made it easy to order exactly what I needed.",
    rating: 4,
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

export function TestimonialsSection() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background-secondary/50 to-transparent" />
      <div className="container-xl relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-caption text-primary mb-3">Testimonials</p>
          <h2 className="font-serif text-section-heading text-foreground">Trusted by commercial operators</h2>
          <p className="text-foreground-secondary mt-4 max-w-lg mx-auto">Hear from fleet owners, mechanics, and transport businesses who rely on us for quality parts.</p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={item}
              className="relative bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <Quote className="w-6 h-6 text-primary/20 absolute top-4 right-4" />
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className={`w-3.5 h-3.5 ${s < t.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                ))}
              </div>
              <p className="text-sm text-foreground-secondary leading-relaxed mb-5">&ldquo;{t.content}&rdquo;</p>
              <div className="flex items-center gap-3 pt-3 border-t border-border">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-foreground-secondary">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}