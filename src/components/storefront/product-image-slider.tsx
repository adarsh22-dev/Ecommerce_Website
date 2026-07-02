"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductImageSliderProps {
  images: Array<{ id: string; image_url: string; alt_text: string | null }>;
  productTitle: string;
}

export function ProductImageSlider({ images, productTitle }: ProductImageSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images.length) return null;

  const displayImages = images.slice(0, 4);

  const goPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="mt-6 rounded-2xl border border-border bg-muted/30 p-3 sm:p-4">
      <div className="relative overflow-hidden rounded-xl">
        <div className="flex transition-transform duration-300" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
          {displayImages.map((image) => (
            <div key={image.id} className="min-w-full aspect-[4/5] relative">
              <Image
                src={image.image_url}
                alt={image.alt_text || `${productTitle} image`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {displayImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-sm backdrop-blur"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4 text-foreground" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-sm backdrop-blur"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4 text-foreground" />
            </button>
          </>
        )}
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {displayImages.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${index === activeIndex ? "border-primary" : "border-transparent"}`}
          >
            <Image src={image.image_url} alt="" fill sizes="64px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
