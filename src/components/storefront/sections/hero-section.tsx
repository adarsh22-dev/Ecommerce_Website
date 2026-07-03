"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Timer, Sparkles } from "lucide-react";

interface HeroSlide {
  image_url: string;
  heading: string;
  subheading: string;
  cta_text: string;
  cta_link: string;
}

function SlideContent({ slide, slideIndex, total }: { slide: HeroSlide; slideIndex: number; total: number }) {
  return (
    <motion.div
      key={slide.heading}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="relative z-10 w-full h-full flex items-center"
    >
      {/* Decorative sale circles */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/5 blur-3xl hidden lg:block" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl hidden lg:block" />

      <div className="container-xl w-full relative">
        <div className="max-w-2xl mx-auto lg:mx-0 px-4 sm:px-0 text-center lg:text-left">
          {/* Sale badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-6 sm:mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span className="text-[11px] sm:text-xs font-semibold text-white/80 uppercase tracking-wider">
              Limited Time Offer
            </span>
            <div className="flex items-center gap-1.5 ml-1 text-yellow-300">
              <Timer className="w-3 h-3" />
              <span className="text-[11px] font-mono font-bold">Ending Soon</span>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-[1.05] tracking-tight"
          >
            {slide.heading.split(" ").map((word, i) => (
              <span key={i}>
                <span className={`inline-block ${word === "Sale" || word === "sale" || word === "OFF" || word === "off" ? "text-yellow-300" : "text-white"} hover:scale-105 transition-transform duration-200`}>
                  {word}
                </span>
                {i < slide.heading.split(" ").length - 1 && " "}
              </span>
            ))}
          </motion.h1>

          {/* Subheading */}
          {slide.subheading && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-white/60 max-w-lg leading-relaxed mx-auto lg:mx-0"
            >
              {slide.subheading}
            </motion.p>
          )}

          {/* Price / offer tag */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="mt-5 sm:mt-7 inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/5"
          >
            <span className="text-xs sm:text-sm text-white/40 line-through">&#8377;49,999</span>
            <span className="text-lg sm:text-xl font-black text-yellow-300">&#8377;29,999</span>
            <span className="text-[10px] sm:text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">
              Save 40%
            </span>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 sm:mt-10 flex flex-col sm:flex-row items-center gap-4"
          >
            <Link href={slide.cta_link || "/products"}>
              <button className="group relative overflow-hidden h-12 sm:h-14 px-8 sm:px-10 rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-white font-bold text-sm sm:text-base transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:scale-[1.03] active:scale-[0.97]">
                <span className="relative z-10 flex items-center gap-2">
                  {slide.cta_text}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </button>
            </Link>
            <Link href="/products" className="group flex items-center gap-2 text-xs sm:text-sm text-white/40 hover:text-white/70 transition-colors duration-300 border-b border-white/10 hover:border-white/30 pb-0.5">
              View All Deals
              <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export function HeroSection({ settings }: { settings: { slides?: HeroSlide[] } }) {
  const slides = settings?.slides || [];
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const next = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
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
      <div className="relative h-[50vh] sm:h-[80vh] min-h-[400px] bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 flex items-center justify-center">
        <p className="text-zinc-500 px-4 text-center text-sm">Configure hero slides in Admin → Homepage</p>
      </div>
    );
  }

  const slide = slides[currentSlide];

  return (
    <section
      className="relative h-[70vh] sm:h-[80vh] lg:h-[88vh] min-h-[500px] sm:min-h-[600px] overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background image */}
      {slides.map((s, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-40 scale-100" : "opacity-0 scale-105"
          }`}
        >
          <Image
            src={s.image_url || "/images/hero/hero-1.jpg"}
            alt={s.heading || "Hero"}
            fill
            className="object-cover"
            style={{ objectPosition: "50% 30%" }}
            priority={index === 0}
            sizes="100vw"
          />
        </div>
      ))}

      {/* Gradient overlay - colorful for sale vibe */}
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/95 via-zinc-900/80 to-zinc-900/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/50 via-transparent to-zinc-900/20" />

      {/* Colorful accent gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-yellow-400 to-primary" />

      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />

      {/* Content */}
      <AnimatePresence mode="wait">
        <SlideContent key={currentSlide} slide={slide} slideIndex={currentSlide} total={slides.length} />
      </AnimatePresence>

      {/* Navigation arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 sm:left-6 lg:left-10 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 flex items-center justify-center transition-all duration-300 text-white/60 hover:text-white group"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:-translate-x-0.5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 sm:right-6 lg:right-10 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 flex items-center justify-center transition-all duration-300 text-white/60 hover:text-white group"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </>
      )}

      {/* Slide indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="group relative flex items-center h-2"
              aria-label={`Go to slide ${index + 1}`}
            >
              <span
                className={`block rounded-full transition-all duration-700 ease-out ${
                  index === currentSlide
                    ? "w-10 sm:w-14 h-2 bg-gradient-to-r from-primary to-primary/60"
                    : "w-2 h-2 bg-white/20 group-hover:bg-white/40"
                }`}
              />
            </button>
          ))}
        </div>
      )}

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/5 z-20">
        <motion.div
          key={currentSlide}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 6, ease: "linear" }}
          className="h-full bg-gradient-to-r from-primary to-yellow-400 origin-left"
        />
      </div>
    </section>
  );
}