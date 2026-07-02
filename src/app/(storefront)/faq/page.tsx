"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "How long does shipping take?", a: "Standard shipping takes 5-7 business days. Express shipping delivers within 2-3 business days. Free standard shipping is available on orders over $100." },
  { q: "What is your return policy?", a: "We offer a 30-day return policy on all unworn, unwashed items in original packaging. Simply contact our support team to initiate a return." },
  { q: "Do you ship internationally?", a: "Yes! We ship to over 50 countries worldwide. International shipping rates and delivery times vary by location." },
  { q: "How can I track my order?", a: "Once your order ships, you'll receive a tracking number via email. You can use this to track your package in real-time." },
  { q: "Can I modify or cancel my order?", a: "Orders can be modified or cancelled within 2 hours of placement. After that, we begin processing for immediate shipment." },
  { q: "What payment methods do you accept?", a: "We accept all major credit cards (Visa, Mastercard, Amex), Google Pay, and other secure payment methods through our payment processor." },
  { q: "Are your products authentic?", a: "Absolutely. All our products are sourced directly from authorized distributors or manufacturers. We stand behind the authenticity of every item." },
  { q: "Do you offer gift cards?", a: "Yes! Digital gift cards are available in amounts from $25 to $200. They're delivered instantly via email and never expire." },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="section-padding">
      <div className="container-xl max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <p className="text-caption text-primary mb-3">Help Center</p>
          <h1 className="font-serif text-section-heading text-foreground">Frequently Asked Questions</h1>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="card overflow-hidden">
              <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="flex items-center justify-between w-full p-5 text-left">
                <span className="text-sm font-medium text-foreground pr-4">{faq.q}</span>
                <motion.div animate={{ rotate: openIndex === index ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0">
                  <ChevronDown className="w-5 h-5 text-foreground-secondary" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm text-foreground-secondary leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
