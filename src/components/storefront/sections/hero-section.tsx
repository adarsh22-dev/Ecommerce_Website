"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSlide {
  image_url: string;
  heading: string;
  subheading: string;
  cta_text: string;
  cta_link: string;
}

function SlideContent({ slide, direction }: { slide: HeroSlide; direction: number }) {
  return (
    <motion.div
      key={slide.heading}
      custom={direction}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
      className="max-w-xl lg:max-w-2xl px-4 sm:px-0"
    >
      <motion.span
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="inline-block text-[10px] sm:text-xs text-white/60 uppercase tracking-[0.15em] mb-3 sm:mb-4"
      >
        New Collection
      </motion.span>
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="font-serif text-2xl sm:text-4xl lg:text-5xl xl:text-6xl text-white leading-[1.1] tracking-tight"
      >
        {slide.heading}
      </motion.h1>
      {slide.subheading && (
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-3 sm:mt-6 text-sm sm:text-base lg:text-lg text-white/70 max-w-md leading-relaxed"
        >
          {slide.subheading}
        </motion.p>
      )}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <Link href={slide.cta_link || "/products"}>
          <Button
            className="mt-5 sm:mt-8 bg-white text-foreground hover:bg-white/90 group shadow-lg shadow-black/10 text-sm sm:text-base"
            size="lg"
          >
            <span>{slide.cta_text}</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
}

export function HeroSection({ settings }: { settings: { slides?: HeroSlide[] } }) {
  const slides = settings?.slides || [];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  }, [currentSlide]);

  const next = useCallback(() => {
    setDirection(1);
    setCurrentSlide(prev => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [slides.length, next]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
  };

  if (slides.length === 0) {
    return (
      <div className="relative h-[50vh] sm:h-[80vh] min-h-[400px] bg-muted flex items-center justify-center">
        <p className="text-foreground-secondary px-4 text-center text-sm">Configure hero slides in Admin → Homepage</p>
      </div>
    );
  }

  return (
    <section
      className="relative h-[60vh] sm:h-[70vh] lg:h-[85vh] min-h-[400px] sm:min-h-[600px] max-h-[900px] overflow-hidden bg-foreground"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-[1.2s] ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image_url || "/images/hero/hero-1.jpg"}
            alt={slide.heading || "Hero"}
            fill
            className="object-cover scale-105"
            style={{
              transform: index === currentSlide ? "scale(1.05)" : "scale(1)",
              transition: "transform 6s ease-out",
            }}
            priority={index === 0}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>
      ))}

      {/* Navigation arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center transition-all text-white"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center transition-all text-white"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </>
      )}

      <div className="container-xl h-full flex items-center relative z-10">
        <AnimatePresence mode="wait" custom={direction}>
          <SlideContent key={currentSlide} slide={slides[currentSlide]} direction={direction} />
        </AnimatePresence>
      </div>

      {/* Slide indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="group flex items-center"
              aria-label={`Go to slide ${index + 1}`}
            >
              <span
                className={`block rounded-full transition-all duration-500 ${
                  index === currentSlide
                    ? "w-6 sm:w-10 h-[3px] bg-white"
                    : "w-[6px] h-[6px] bg-white/40 group-hover:bg-white/60"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}