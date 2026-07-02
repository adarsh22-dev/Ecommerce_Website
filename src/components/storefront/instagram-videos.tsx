"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ChevronLeft, ChevronRight, Heart, MessageCircle, Volume2, VolumeX } from "lucide-react";
import type { ProductVideo } from "@/lib/types";

// Placeholder videos when no product videos exist (Instagram-style UGC)
const placeholderVideos = [
  {
    id: "demo-1",
    thumbnail_url: "https://images.unsplash.com/photo-1600086827875-a63b01f1335c?w=600&h=800&fit=crop",
    video_url: "",
    title: "Style inspo",
    likes: 234,
    handle: "@style_icon",
  },
  {
    id: "demo-2",
    thumbnail_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop",
    video_url: "",
    title: "New favorite",
    likes: 567,
    handle: "@trendsetter",
  },
  {
    id: "demo-3",
    thumbnail_url: "https://images.unsplash.com/photo-1556306535-0f2c9300c0c0?w=600&h=800&fit=crop",
    video_url: "",
    title: "Perfect fit",
    likes: 189,
    handle: "@fashionista",
  },
  {
    id: "demo-4",
    thumbnail_url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=800&fit=crop",
    video_url: "",
    title: "Daily wear",
    likes: 423,
    handle: "@minimalist",
  },
  {
    id: "demo-5",
    thumbnail_url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=800&fit=crop",
    video_url: "",
    title: "Shop the look",
    likes: 312,
    handle: "@shopaholic",
  },
  {
    id: "demo-6",
    thumbnail_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=800&fit=crop",
    video_url: "",
    title: "Must have",
    likes: 678,
    handle: "@collector",
  },
];

interface InstagramVideosProps {
  videos?: Array<{
    id?: string;
    video_url: string;
    thumbnail_url?: string | null;
    title?: string | null;
    description?: string | null;
  }>;
  productTitle?: string;
}

export function InstagramVideos({ videos = [], productTitle }: InstagramVideosProps) {
  const [reelOpen, setReelOpen] = useState(false);
  const [reelIndex, setReelIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [likedReels, setLikedReels] = useState<Set<string>>(new Set());

  // If no product videos exist, show demo UGC content
  const displayVideos = videos.length > 0
    ? videos.map((v) => ({
        id: v.id ?? `video-${Math.random().toString(36).slice(2, 8)}`,
        thumbnail_url: v.thumbnail_url || "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&h=800&fit=crop",
        video_url: v.video_url,
        title: v.title || "Product video",
        likes: Math.floor(Math.random() * 500) + 50,
        handle: "@customer",
        description: v.description,
      }))
    : placeholderVideos;

  const openReel = (index: number) => {
    setReelIndex(index);
    setReelOpen(true);
  };

  const toggleReelLike = (id: string) => {
    setLikedReels((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (displayVideos.length === 0) return null;

  return (
    <div className="mt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-caption text-primary mb-1">Instagram</p>
            <h2 className="font-serif text-2xl text-foreground">As Seen On Social</h2>
          </div>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Follow us
          </a>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
          {displayVideos.slice(0, 6).map((video, index) => (
            <motion.button
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              onClick={() => openReel(index)}
              className="group relative aspect-[9/16] rounded-xl overflow-hidden bg-muted"
            >
              <Image
                src={video.thumbnail_url}
                alt={video.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 33vw, 16vw"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-90 shadow-lg">
                  <Play className="w-5 h-5 text-foreground ml-0.5" />
                </div>
              </div>

              {/* Bottom Info */}
              <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-[10px] font-medium truncate">{video.handle}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Heart className="w-2.5 h-2.5 text-white/80" />
                  <span className="text-[10px] text-white/80">{video.likes}</span>
                </div>
              </div>

              {/* Top Handle (always visible) */}
              <div className="absolute top-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-[10px] text-white font-medium bg-black/40 px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                  {video.handle}
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="text-center mt-6 sm:hidden">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Follow us on Instagram
          </a>
        </div>
      </motion.div>

      {/* Instagram Reels Modal */}
      <AnimatePresence>
        {reelOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          >
            {/* Close */}
            <button
              onClick={() => setReelOpen(false)}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation */}
            {displayVideos.length > 1 && (
              <>
                <button
                  onClick={() => setReelIndex((prev) => (prev > 0 ? prev - 1 : displayVideos.length - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setReelIndex((prev) => (prev < displayVideos.length - 1 ? prev + 1 : 0))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Reel Content */}
            <motion.div
              key={reelIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-[400px] aspect-[9/16] mx-4 rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={displayVideos[reelIndex].thumbnail_url}
                alt={displayVideos[reelIndex].title}
                fill
                className="object-cover"
                sizes="400px"
                priority
              />

              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

              {/* Play Button (center) */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
              </div>

              {/* User Info */}
              <div className="absolute bottom-20 left-4 right-16">
                <p className="text-white font-medium text-sm">{displayVideos[reelIndex].handle}</p>
                <p className="text-white/80 text-xs mt-1">{displayVideos[reelIndex].title}</p>
              </div>

              {/* Right Side Actions */}
              <div className="absolute bottom-20 right-4 flex flex-col items-center gap-4">
                <button
                  onClick={(e) => { e.stopPropagation(); toggleReelLike(displayVideos[reelIndex].id); }}
                  className="flex flex-col items-center gap-1"
                >
                  <div className={`p-2 rounded-full transition-colors ${
                    likedReels.has(displayVideos[reelIndex].id)
                      ? "bg-red-500/20 text-red-500"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}>
                    <Heart className={`w-6 h-6 ${likedReels.has(displayVideos[reelIndex].id) ? "fill-current" : ""}`} />
                  </div>
                  <span className="text-white text-xs font-medium">
                    {displayVideos[reelIndex].likes + (likedReels.has(displayVideos[reelIndex].id) ? 1 : 0)}
                  </span>
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); setMuted(!muted); }}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
                    {muted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                  </div>
                </button>
              </div>

              {/* Counter */}
              <div className="absolute top-4 left-4 z-50 text-white/80 text-sm font-medium">
                {reelIndex + 1} / {displayVideos.length}
              </div>
            </motion.div>

            {/* Bottom Thumbnails */}
            {displayVideos.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-50">
                {displayVideos.map((v, i) => (
                  <button
                    key={v.id}
                    onClick={() => setReelIndex(i)}
                    className={`relative w-8 h-8 rounded-md overflow-hidden border-2 transition-all ${
                      i === reelIndex ? "border-white opacity-100" : "border-transparent opacity-40 hover:opacity-70"
                    }`}
                  >
                    <Image
                      src={v.thumbnail_url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="32px"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
