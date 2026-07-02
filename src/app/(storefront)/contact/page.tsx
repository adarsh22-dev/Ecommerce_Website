"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setLoading(false);
  };

  return (
    <div className="section-padding">
      <div className="container-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-caption text-primary mb-3">Get in Touch</p>
            <h1 className="font-serif text-section-heading text-foreground mb-6">Contact Us</h1>
            <p className="text-foreground-secondary mb-8">
              Have a question, suggestion, or just want to say hello? We&apos;d love to hear from you.
            </p>
            <div className="space-y-6">
              {[
                { icon: Mail, label: "Email", value: "hello@ecom.com" },
                { icon: Phone, label: "Phone", value: "+1 (234) 567-890" },
                { icon: MapPin, label: "Address", value: "123 Commerce St, New York, NY 10001" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-foreground-secondary">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <form onSubmit={handleSubmit} className="card p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <Input label="First Name" required />
                <Input label="Last Name" required />
              </div>
              <Input label="Email" type="email" required />
              <Input label="Subject" required />
              <Textarea label="Message" required placeholder="How can we help you?" />
              <Button type="submit" className="w-full shimmer-btn" size="lg" loading={loading}>
                Send Message
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
