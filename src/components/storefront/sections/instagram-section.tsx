"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageSquare, Heart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const instagramPlaceholderPosts = [
  { id: "1", image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop", likes: 124, caption: "New drop alert! 🔥" },
  { id: "2", image_url: "https://images.unsplash.com/photo-1603187187314-3c6a9b3e1b2b?w=400&h=400&fit=crop", likes: 89, caption: "Weekend vibes" },
  { id: "3", image_url: "https://images.unsplash.com/photo-1600086827875-a63b01f1335c?w=400&h=400&fit=crop", likes: 203, caption: "Minimalist aesthetics" },
  { id: "4", image_url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop", likes: 156, caption: "Shop the look" },
  { id: "5", image_url: "https://images.unsplash.com/photo-1556306535-0f2c9300c0c0?w=400&h=400&fit=crop", likes: 67, caption: "Summer essentials" },
  { id: "6", image_url: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=400&fit=crop", likes: 178, caption: "Deals you can't miss" },
  { id: "7", image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop", likes: 92, caption: "Quality you can trust" },
  { id: "8", image_url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=400&fit=crop", likes: 145, caption: "Style inspo ✨" },
];

interface InstagramSectionProps {
  title?: string;
  subtitle?: string;
  settings: {
    username?: string;
    access_token?: string;
    limit?: number;
  };
}

export function InstagramSection({ title, subtitle, settings }: InstagramSectionProps) {
  const limit = settings?.limit || 8;

  return (
    <section className="section-padding bg-background-secondary">
      <div className="container-xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {subtitle && <p className="text-caption text-primary mb-3">{subtitle}</p>}
          <h2 className="font-serif text-section-heading text-foreground">
            {title || (settings.username ? `Follow @${settings.username}` : "Follow Us")}
          </h2>
          {settings.username && (
            <p className="text-foreground-secondary mt-2 text-sm">
              <Link href={`https://instagram.com/${settings.username}`} target="_blank" className="text-primary hover:underline">
                @{settings.username}
              </Link>
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {instagramPlaceholderPosts.slice(0, limit).map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group relative aspect-square rounded-xl overflow-hidden"
            >
              <Image
                src={post.image_url}
                alt={post.caption}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-white text-sm font-medium">
                    <Heart className="w-4 h-4 fill-white" /> {post.likes}
                  </span>
                  <span className="flex items-center gap-1.5 text-white text-sm font-medium">
                    <MessageSquare className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href={settings.username ? `https://instagram.com/${settings.username}` : "#"}
            target="_blank"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Follow us on Instagram
          </Link>
        </div>
      </div>
    </section>
  );
}
