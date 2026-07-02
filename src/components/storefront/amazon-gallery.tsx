"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GalleryImage {
  id: string;
  image_url: string;
  alt_text: string | null;
}

interface AmazonGalleryProps {
  images: GalleryImage[];
  productTitle: string;
  isOnSale?: boolean;
  discount?: number;
}

export function AmazonGallery({
  images,
  productTitle,
  isOnSale,
  discount,
}: AmazonGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const hasMultiple = images.length > 1;

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  }, []);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const currentImage = images[selectedIndex];

  return (
    <>
      <div className="flex gap-3 lg:gap-4">
        {/* Vertical Thumbnail Strip */}
        {hasMultiple && (
          <div className="hidden sm:flex flex-col gap-2 flex-shrink-0">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setSelectedIndex(i)}
                className={`relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
                  i === selectedIndex
                    ? "border-primary shadow-sm"
                    : "border-border/60 hover:border-foreground/30"
                }`}
              >
                <Image
                  src={img.image_url}
                  alt={img.alt_text || `${productTitle} thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}

        {/* Main Image */}
        <div className="flex-1">
          <div
            ref={imageRef}
            className="relative aspect-[4/5] rounded-xl overflow-hidden bg-muted cursor-crosshair group"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onMouseMove={handleMouseMove}
            onClick={() => openLightbox(selectedIndex)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0"
              >
                {currentImage ? (
                  <Image
                    src={currentImage.image_url}
                    alt={currentImage.alt_text || productTitle}
                    fill
                    className="object-cover transition-transform duration-200"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-foreground-secondary/20">
                    <ZoomIn className="w-16 h-16" />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Sale Badge */}
            {isOnSale && (
              <div className="absolute top-3 left-3 z-10">
                <Badge variant="destructive">-{discount}%</Badge>
              </div>
            )}

            {/* Zoom Hint */}
            <div className="absolute bottom-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
                <ZoomIn className="w-3.5 h-3.5 text-foreground-secondary" />
                <span className="text-[11px] font-medium text-foreground-secondary">Hover to zoom</span>
              </div>
            </div>

            {/* Horizontal Thumbnails for Mobile */}
            {hasMultiple && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 sm:hidden flex gap-1.5 z-10">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setSelectedIndex(i); }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === selectedIndex ? "bg-white w-4" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Zoom Lens */}
            {isHovering && currentImage && (
              <div
                className="absolute inset-0 pointer-events-none z-20"
                style={{
                  background: `radial-gradient(circle 120px at ${mousePos.x}% ${mousePos.y}%, transparent 0%, rgba(0,0,0,0.3) 100%)`,
                }}
              />
            )}
          </div>

          {/* Zoomed Preview (on hover) */}
          <AnimatePresence>
            {isHovering && currentImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="hidden lg:block absolute left-[calc(50%+1.5rem)] top-0 w-[calc(50%-1.5rem)] h-full z-30 pointer-events-none"
                style={{
                  backgroundImage: `url(${currentImage.image_url})`,
                  backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
                  backgroundSize: "250%",
                  backgroundRepeat: "no-repeat",
                  borderRadius: "0.75rem",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
            >
              <X className="w-6 h-6" />
            </button>

            {hasMultiple && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <motion.div
              key={lightboxIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full max-w-4xl max-h-[90vh] m-4"
              onClick={(e) => e.stopPropagation()}
            >
              {images[lightboxIndex] && (
                <Image
                  src={images[lightboxIndex].image_url}
                  alt={images[lightboxIndex].alt_text || productTitle}
                  fill
                  className="object-contain"
                  sizes="90vw"
                  priority
                />
              )}
            </motion.div>

            {/* Lightbox Thumbnails */}
            {hasMultiple && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-50">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex(i);
                    }}
                    className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                      i === lightboxIndex ? "border-white opacity-100" : "border-transparent opacity-50 hover:opacity-80"
                    }`}
                  >
                    <Image
                      src={img.image_url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Counter */}
            <div className="absolute top-4 left-4 z-50 text-white/80 text-sm font-medium">
              {lightboxIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
