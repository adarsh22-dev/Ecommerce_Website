"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface HeroSlide {
  image_url: string;
  heading: string;
  subheading: string;
  cta_text: string;
  cta_link: string;
}

export function HeroSection({ settings }: { settings: { slides?: HeroSlide[] } }) {
  const slides = settings?.slides || [];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <div className="relative h-[80vh] min-h-[600px] bg-muted flex items-center justify-center">
        <p className="text-foreground-secondary">Configure hero slides in Admin → Homepage</p>
      </div>
    );
  }

  return (
    <section className="relative h-[80vh] min-h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"}`}
        >
          <Image
            src={slide.image_url || "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&h=900&fit=crop"}
            alt={slide.heading || "Hero"}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      ))}
      <div className="container-xl h-full flex items-center relative z-10">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-2xl"
        >
          <h1 className="font-serif text-hero-sm lg:text-hero text-white leading-[1.1] tracking-tight">
            {slides[currentSlide].heading}
          </h1>
          {slides[currentSlide].subheading && (
            <p className="mt-6 text-lg text-white/80 max-w-md">{slides[currentSlide].subheading}</p>
          )}
          <Link href={slides[currentSlide].cta_link || "/products"}>
            <Button className="mt-8 shimmer-btn bg-white text-foreground hover:bg-white/90" size="lg">
              {slides[currentSlide].cta_text}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1 rounded-full transition-all duration-300 ${index === currentSlide ? "w-8 bg-white" : "w-2 bg-white/40"}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
