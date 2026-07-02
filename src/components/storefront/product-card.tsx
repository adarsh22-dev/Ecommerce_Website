"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag, Heart, GitCompareArrows, Share2, Check } from "lucide-react";
import { useCart } from "@/lib/contexts/cart-context";
import { formatCurrency, calculateDiscount } from "@/lib/utils";
import type { ProductWithDetails } from "@/lib/types";

interface ProductCardProps {
  product: ProductWithDetails;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isCompared, setIsCompared] = useState(false);
  const [copied, setCopied] = useState(false);
  const [flyAnim, setFlyAnim] = useState<{ active: boolean; x: number; y: number; imgX: number; imgY: number } | null>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();

  useEffect(() => {
    try {
      const wishlist = JSON.parse(window.localStorage.getItem("ecom-wishlist") || "[]");
      const compare = JSON.parse(window.localStorage.getItem("ecom-compare") || "[]");
      setIsWishlisted(wishlist.includes(product.id));
      setIsCompared(compare.includes(product.id));
    } catch {
      // ignore storage failures
    }
  }, [product.id]);

  const images = product.product_images || [];
  const primaryImage = images[0]?.image_url;
  const secondaryImage = images[1]?.image_url;
  const isOnSale = product.sale_price !== null && product.sale_price < product.price;
  const discount = isOnSale ? calculateDiscount(product.price, product.sale_price!) : 0;

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Get button position for fly animation origin
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const imgRect = imgRef.current?.getBoundingClientRect();

    if (imgRect && primaryImage) {
      // Calculate end position (top-right corner where cart icon is)
      const cartX = window.innerWidth - 40;
      const cartY = 40;

      setFlyAnim({
        active: true,
        x: cartX - imgRect.left - imgRect.width / 2,
        y: cartY - imgRect.top - imgRect.height / 2,
        imgX: 0,
        imgY: 0,
      });

      setTimeout(() => setFlyAnim(null), 700);
    }

    addItem(product as any);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  }, [addItem, product, primaryImage]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const key = "ecom-wishlist";
    const stored = JSON.parse(window.localStorage.getItem(key) || "[]");
    const next = isWishlisted ? stored.filter((item: string) => item !== product.id) : [...stored, product.id];
    window.localStorage.setItem(key, JSON.stringify(next));
    setIsWishlisted(!isWishlisted);
  };

  const toggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const key = "ecom-compare";
    const stored = JSON.parse(window.localStorage.getItem(key) || "[]");
    const next = isCompared ? stored.filter((item: string) => item !== product.id) : [...stored, product.id];
    window.localStorage.setItem(key, JSON.stringify(next));
    setIsCompared(!isCompared);
  };

  const shareProduct = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/products/${product.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.title, text: `Check out ${product.title}`, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    } catch {
      // ignore share errors
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group"
    >
      <Link href={`/products/${product.slug}`}>
        <div
          className="card overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image */}
          <div ref={imgRef} className="relative aspect-[3/4] overflow-hidden bg-muted">
            {primaryImage ? (
              <>
                <Image
                  src={primaryImage}
                  alt={product.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className={`object-cover transition-all duration-500 ${
                    isHovered && secondaryImage ? "opacity-0" : "opacity-100"
                  } group-hover:scale-105`}
                />
                {secondaryImage && (
                  <Image
                    src={secondaryImage}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className={`object-cover transition-all duration-500 absolute inset-0 ${
                      isHovered ? "opacity-100" : "opacity-0"
                    } group-hover:scale-105`}
                  />
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-foreground-secondary/20">
                <ShoppingBag className="w-12 h-12" />
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {isOnSale && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-2.5 py-1 bg-destructive text-white text-[10px] font-bold uppercase tracking-wider rounded-full"
                >
                  -{discount}%
                </motion.span>
              )}
              {new Date(product.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="px-2.5 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-wider rounded-full"
                >
                  New
                </motion.span>
              )}
            </div>

            {/* Flying ghost image */}
            {flyAnim?.active && primaryImage && (
              <motion.div
                initial={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 }}
                animate={{
                  opacity: [1, 1, 0],
                  scale: [1, 0.6, 0.2],
                  x: flyAnim.x,
                  y: flyAnim.y,
                  rotate: [0, 10, 15],
                }}
                transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                className="fixed z-[100] pointer-events-none"
                style={{
                  width: 120,
                  height: 160,
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
                }}
              >
                <Image
                  src={primaryImage}
                  alt=""
                  fill
                  className="object-cover"
                />
              </motion.div>
            )}

            <div className="absolute right-3 top-3 z-10 flex flex-col gap-2">
              <button
                type="button"
                onClick={toggleWishlist}
                className="rounded-full bg-white/90 p-2 shadow-sm backdrop-blur transition hover:bg-white"
                aria-label="Add to wishlist"
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? "fill-destructive text-destructive" : "text-foreground-secondary"}`} />
              </button>
              <button
                type="button"
                onClick={toggleCompare}
                className="rounded-full bg-white/90 p-2 shadow-sm backdrop-blur transition hover:bg-white"
                aria-label="Add to compare"
              >
                <GitCompareArrows className={`h-4 w-4 ${isCompared ? "text-primary" : "text-foreground-secondary"}`} />
              </button>
              <button
                type="button"
                onClick={shareProduct}
                className="rounded-full bg-white/90 p-2 shadow-sm backdrop-blur transition hover:bg-white"
                aria-label="Share product"
              >
                {copied ? <Check className="h-4 w-4 text-success" /> : <Share2 className="h-4 w-4 text-foreground-secondary" />}
              </button>
            </div>

            {/* Quick Add button */}
            <motion.div
              initial={false}
              animate={{
                y: isHovered ? 0 : 20,
                opacity: isHovered ? 1 : 0,
              }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="absolute bottom-4 left-4 right-4"
            >
              <button
                onClick={handleAddToCart}
                className={`w-full h-11 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
                  addedToCart
                    ? "bg-success text-white"
                    : "bg-white/95 backdrop-blur-sm text-foreground hover:bg-white shadow-lg"
                }`}
              >
                {addedToCart ? (
                  <>
                    <motion.svg
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </motion.svg>
                    Added!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    Quick Add
                  </>
                )}
              </button>
            </motion.div>
          </div>

          {/* Info */}
          <div className="p-4">
            {product.category && (
              <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-foreground-secondary mb-1.5">
                {product.category.name}
              </p>
            )}
            <h3 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
              {product.title}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              {isOnSale ? (
                <>
                  <span className="text-sm font-semibold text-destructive">
                    {formatCurrency(product.sale_price!)}
                  </span>
                  <span className="text-sm text-foreground-secondary/50 line-through">
                    {formatCurrency(product.price)}
                  </span>
                </>
              ) : (
                <span className="text-sm font-semibold text-foreground">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
