"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Head from "next/head";
import {
  Star, Heart, ShoppingBag, Minus, Plus, ChevronRight, Truck,
  RotateCcw, Shield, Facebook, Twitter, MessageCircle, Link2, Check,
  X, Ruler, ChevronLeft, MapPin, Package, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/lib/contexts/cart-context";
import { useAuth } from "@/lib/contexts/auth-context";
import { formatCurrency, calculateDiscount } from "@/lib/utils";
import { ProductCard } from "@/components/storefront/product-card";
import { ProductReviews } from "@/components/storefront/product-reviews";
import { AmazonGallery } from "@/components/storefront/amazon-gallery";
import { InstagramVideos } from "@/components/storefront/instagram-videos";
import { ProductImageSlider } from "@/components/storefront/product-image-slider";
import { getProductMediaForSlug, mergeProductMedia } from "@/lib/services/product-content";
import { ProductJsonLd, BreadcrumbJsonLd, FaqJsonLd } from "@/components/storefront/json-ld";
import toast from "react-hot-toast";
import type { ProductWithDetails, ProductVariant } from "@/lib/types";

// --- Color mapping for swatches ---
const COLOR_MAP: Record<string, string> = {
  black: "#1a1a1a", white: "#ffffff", gray: "#6b7280", grey: "#6b7280",
  navy: "#1e3a5f", blue: "#2563eb", lightblue: "#93c5fd", sky: "#0ea5e9",
  red: "#dc2626", burgundy: "#800020", maroon: "#800000",
  green: "#16a34a", forest: "#228b22", olive: "#556b2f",
  pink: "#ec4899", rose: "#f43f5e", coral: "#ff6b6b",
  purple: "#7c3aed", lavender: "#a78bfa", violet: "#8b5cf6",
  yellow: "#eab308", gold: "#d4a017", orange: "#f97316",
  brown: "#8b4513", tan: "#d2b48c", beige: "#f5f5dc",
  silver: "#c0c0c0", bronze: "#cd7f32",
};

function getColorHex(value: string): string {
  const key = value.toLowerCase().replace(/\s+/g, "");
  return COLOR_MAP[key] || `var(--color-${key})`;
}

function isColorOption(name: string): boolean {
  return ["color", "colour", "finish", "shade", "tone"].some(k => name.toLowerCase().includes(k));
}

function PdpSkeleton() {
  return (
    <div className="section-padding">
      <div className="container-xl">
        <Skeleton className="h-4 w-64 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
            <div className="flex gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-20 rounded-lg" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-14 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SizeGuideModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const measurements = [32, 36, 40, 44, 48, 52];
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={e => e.stopPropagation()}
          className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Ruler className="w-5 h-5 text-primary" />
              <h2 className="font-serif text-xl">Size Guide</h2>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 font-medium text-foreground-secondary">Size</th>
                  {sizes.map(s => <th key={s} className="py-3 px-2 font-medium text-center">{s}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-2 text-foreground-secondary">Chest (in)</td>
                  {measurements.map((m, i) => (
                    <td key={i} className="py-3 px-2 text-center font-medium">{m}"</td>
                  ))}
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-2 text-foreground-secondary">Waist (in)</td>
                  {measurements.map((m, i) => (
                    <td key={i} className="py-3 px-2 text-center font-medium">{m - 4}"</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-2 text-foreground-secondary">Length (in)</td>
                  {measurements.map((m, i) => (
                    <td key={i} className="py-3 px-2 text-center font-medium">{m / 2 + 10}"</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-foreground-secondary mt-4">Measurements are approximate. For exact sizing, please refer to the product specifications.</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const resolvedParams = params;
  const [product, setProduct] = useState<ProductWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [activeSection, setActiveSection] = useState<string>("description");
  const [wishlist, setWishlist] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<ProductWithDetails[]>([]);
  const [recentProducts, setRecentProducts] = useState<ProductWithDetails[]>([]);
  const [copied, setCopied] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [mediaContent, setMediaContent] = useState<{ images: any[]; videos: any[] }>({ images: [], videos: [] });
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const { addItem, openCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { getProductBySlug, getRelatedProducts: fetchRelated, getCrossSellProducts } = await import("@/lib/services/products");
        const data = await getProductBySlug(resolvedParams.slug);
        setProduct(data as ProductWithDetails);

        if (data.category_id) {
          try {
            const related = await fetchRelated(data.category_id, data.id, 6);
            setRelatedProducts(related as ProductWithDetails[]);
          } catch { /* not critical */ }
        }

        // Fetch cross-sell from all products if related is too few
        if (!data.category_id) {
          try {
            const cross = getCrossSellProducts(data.id, 4);
            setRelatedProducts(cross as ProductWithDetails[]);
          } catch { /* not critical */ }
        }

        try {
          const content = await getProductMediaForSlug(resolvedParams.slug);
          const merged = mergeProductMedia(data.product_images || [], content);
          setMediaContent(merged);
        } catch {
          setMediaContent({ images: [], videos: [] });
        }
      } catch {
        toast.error("Product not found");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [resolvedParams.slug]);

  useEffect(() => {
    if (!product) return;
    try {
      const stored = window.localStorage.getItem("ecom-recent-products");
      const parsed = stored ? JSON.parse(stored) : [];
      const next = [product, ...parsed.filter((item: ProductWithDetails) => item.id !== product.id)].slice(0, 6);
      window.localStorage.setItem("ecom-recent-products", JSON.stringify(next));
      setRecentProducts(next as ProductWithDetails[]);
    } catch { /* ignore */ }
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const metaTitle = product.meta_title || `${product.title} | ECOM`;
    document.title = metaTitle;
    let metaDesc = document.querySelector("meta[name='description']");
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", product.meta_description || product.description || "");
    let ogImage = document.querySelector("meta[property='og:image']");
    if (!ogImage) {
      ogImage = document.createElement("meta");
      ogImage.setAttribute("property", "og:image");
      document.head.appendChild(ogImage);
    }
    if (product.og_image_url || product.product_images?.[0]?.image_url) {
      ogImage.setAttribute("content", product.og_image_url || product.product_images[0].image_url);
    }
    let ogTitle = document.querySelector("meta[property='og:title']");
    if (!ogTitle) {
      ogTitle = document.createElement("meta");
      ogTitle.setAttribute("property", "og:title");
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute("content", metaTitle);
  }, [product]);

  useEffect(() => {
    if (!product || !user) return;
    async function checkWishlist() {
      try {
        const { isInWishlist } = await import("@/lib/services/user");
        const inWishlist = await isInWishlist(user!.id, product!.id);
        setWishlist(inWishlist);
      } catch { /* not critical */ }
    }
    checkWishlist();
  }, [product, user]);

  // --- Dynamic variant matching ---
  const matchedVariant = useMemo<ProductVariant | null>(() => {
    if (!product?.product_variants?.length) return null;
    const selectedKeys = Object.keys(selectedOptions);
    if (selectedKeys.length === 0) return null;
    return product.product_variants.find(v =>
      v.option_values.every(ov => selectedOptions[ov.option_name] === ov.value)
    ) || null;
  }, [product, selectedOptions]);

  const displayPrice = matchedVariant?.price ?? null;
  const displayStock = matchedVariant?.stock_quantity ?? null;
  const effectivePrice = displayPrice ?? (product?.sale_price ?? product?.price ?? 0);
  const effectiveStock = displayStock ?? (product?.stock_quantity ?? 0);
  const isOnSale = (displayPrice ?? product?.sale_price ?? product?.price ?? 0) < (product?.price ?? 0);
  const discount = calculateDiscount(product?.price ?? 0, effectivePrice);

  if (loading) return <PdpSkeleton />;
  if (!product) {
    return (
      <div className="section-padding text-center">
        <div className="container-xl">
          <h1 className="font-serif text-section-heading text-foreground mb-4">Product Not Found</h1>
          <p className="text-foreground-secondary mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Link href="/products"><Button>Browse Products</Button></Link>
        </div>
      </div>
    );
  }

  const images = mediaContent.images.length > 0 ? mediaContent.images : (product.product_images || []);
  const videos = mediaContent.videos;
  const shortDescription = product.meta_description || product.description || "Premium quality crafted for everyday comfort, style, and long-lasting performance.";
  const tags = product.tags || [];
  const crossSellProducts = relatedProducts.slice(0, 2);
  const upsellProducts = relatedProducts.slice(2, 4);

  const handleAddToCart = () => {
    addItem(product, undefined, quantity, selectedOptions);
    openCart();
    toast.success("Added to cart!");
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      toast.error("Please sign in to add to wishlist");
      return;
    }
    try {
      const { addToWishlist, removeFromWishlist } = await import("@/lib/services/user");
      if (wishlist) {
        await removeFromWishlist(user.id, product.id);
        setWishlist(false);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(user.id, product.id);
        setWishlist(true);
        toast.success("Added to wishlist!");
      }
    } catch {
      toast.error("Failed to update wishlist");
    }
  };

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const text = `Check out ${product.title} at ECOM!`;
    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(text)}`,
    };
    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch { /* fallback */ }
      return;
    }
    window.open(shareUrls[platform], '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  const productFaqs = [
    { question: `Is the ${product.title} authentic?`, answer: "Yes, all our products are 100% authentic and sourced directly from authorized manufacturers and distributors." },
    { question: `What is the warranty on the ${product.title}?`, answer: "Every purchase comes with a 2-year warranty covering manufacturing defects. Extended warranty options are available at checkout." },
    { question: "How long does shipping take?", answer: "Standard shipping takes 5-7 business days. Express shipping delivers within 2-3 business days. Free standard shipping on orders over $100." },
    { question: "Can I return this product?", answer: "Yes! We offer a 30-day return policy on all unworn, unwashed items in original packaging. Simply contact our support team to initiate a return." },
    { question: "What payment methods do you accept?", answer: "We accept all major credit cards (Visa, Mastercard, Amex), Google Pay, and other secure payment methods through our payment processor." },
  ];

  const productSchema = {
    title: product.title,
    description: product.description,
    slug: product.slug,
    price: effectivePrice,
    image: images[0]?.image_url || undefined,
    sku: product.sku,
    category: product.category?.name,
    average_rating: product.average_rating,
    review_count: product.review_count,
  };

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Products", url: "/products" },
    ...(product.category ? [{ name: product.category.name, url: `/products?category=${product.category_id}` }] : []),
    { name: product.title, url: `/products/${product.slug}` },
  ];

  const sectionTabs = [
    { id: "description", label: "Description" },
    { id: "shipping", label: "Shipping & Returns" },
  ];

  return (
    <>
      <ProductJsonLd product={productSchema} />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <FaqJsonLd questions={productFaqs} />
      <SizeGuideModal open={showSizeGuide} onClose={() => setShowSizeGuide(false)} />

      <div className="section-padding pb-28 lg:pb-12">
        <div className="container-xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-foreground-secondary mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/products" className="hover:text-foreground transition-colors">Products</Link>
            {product.category && (
              <>
                <ChevronRight className="w-3 h-3" />
                <Link href={`/products?category=${product.category_id}`} className="hover:text-foreground transition-colors">
                  {product.category.name}
                </Link>
              </>
            )}
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium truncate max-w-[200px]">{product.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div className="relative">
              <AmazonGallery
                images={images}
                productTitle={product.title}
                isOnSale={isOnSale}
                discount={discount}
              />
              {videos.length > 0 && (
                <div className="mt-4 rounded-2xl border border-border/80 bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary">Video ad</p>
                      <h3 className="font-serif text-lg text-foreground truncate">{videos[0].title}</h3>
                      {videos[0].description && <p className="mt-1 text-sm text-foreground-secondary line-clamp-2">{videos[0].description}</p>}
                    </div>
                    <a href={videos[0].video_url} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background whitespace-nowrap hover:bg-foreground/90 transition-colors">Watch</a>
                  </div>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6 lg:space-y-8">
              <div>
                {product.category && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-caption text-primary mb-2"
                  >
                    {product.category.name}
                  </motion.p>
                )}
                <motion.h1
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="font-serif text-section-heading text-foreground"
                >
                  {product.title}
                </motion.h1>

                {/* Rating row */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-4 mt-4"
                >
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star =>
                      <Star key={star} className={`w-4 h-4 ${star <= (product.average_rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                    )}
                    {product.review_count !== undefined && (
                      <span className="text-sm text-foreground-secondary ml-2">
                        {product.average_rating?.toFixed(1)} &middot; <a href="#product-reviews" className="hover:text-foreground transition-colors">{product.review_count} reviews</a>
                      </span>
                    )}
                  </div>
                </motion.div>

                {/* Price */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="flex items-center gap-3 mt-4"
                >
                  <span className="text-2xl font-semibold text-foreground">
                    {formatCurrency(effectivePrice)}
                  </span>
                  {isOnSale && (
                    <span className="text-lg text-foreground-secondary line-through">
                      {formatCurrency(product.price)}
                    </span>
                  )}
                  {matchedVariant && (
                    <span className="text-xs text-foreground-secondary">Variant price</span>
                  )}
                </motion.div>
              </div>

              {/* Options */}
              {product.product_options?.map(option => (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-foreground">
                      {option.name}: <span className="text-foreground-secondary">{selectedOptions[option.name] || "Select"}</span>
                    </p>
                    {isColorOption(option.name) && (
                      <button
                        onClick={() => setShowSizeGuide(true)}
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        <Ruler className="w-3 h-3" />
                        Size Guide
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {option.product_option_values.map(value => {
                      const isColor = isColorOption(option.name);
                      const isSelected = selectedOptions[option.name] === value.value;
                      return isColor ? (
                        <button
                          key={value.id}
                          onClick={() => setSelectedOptions({ ...selectedOptions, [option.name]: value.value })}
                          className={`relative w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                            isSelected
                              ? "border-foreground scale-110 shadow-md"
                              : "border-border hover:border-foreground/40"
                          }`}
                          title={value.value}
                        >
                          <span
                            className="absolute inset-1 rounded-full"
                            style={{ backgroundColor: getColorHex(value.value) }}
                          />
                          {isSelected && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <Check className={`w-4 h-4 ${['white', 'beige', 'tan', 'cream', 'ivory', 'silver'].includes(value.value.toLowerCase()) ? 'text-foreground' : 'text-white'}`} />
                            </span>
                          )}
                        </button>
                      ) : (
                        <button
                          key={value.id}
                          onClick={() => setSelectedOptions({ ...selectedOptions, [option.name]: value.value })}
                          className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                            isSelected
                              ? "border-primary bg-primary text-white shadow-sm"
                              : "border-border hover:border-foreground/30 hover:bg-muted/50"
                          }`}
                        >
                          {value.value}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              ))}

              {/* Quantity & Stock */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <p className="text-sm font-medium text-foreground mb-3">Quantity</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-10 w-10 flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="h-10 w-12 flex items-center justify-center text-sm font-medium border-x border-border bg-muted/30">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(effectiveStock, quantity + 1))}
                      className="h-10 w-10 flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${effectiveStock > 0 ? "bg-success" : "bg-destructive"}`} />
                    <span className="text-sm text-foreground-secondary">
                      {effectiveStock > 0
                        ? effectiveStock > 10
                          ? "In stock"
                          : `Only ${effectiveStock} left`
                        : "Out of stock"
                      }
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Tags & Description */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl border border-border bg-muted/30 p-4"
              >
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tags.map(tag => (
                      <span key={tag} className="rounded-full bg-white px-3 py-1 text-[11px] font-medium text-foreground-secondary shadow-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-sm leading-6 text-foreground-secondary">{shortDescription}</p>
              </motion.div>

              {/* Add to Cart + Wishlist (Desktop) */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="hidden lg:flex gap-3"
              >
                <Button
                  onClick={handleAddToCart}
                  disabled={effectiveStock === 0}
                  className="flex-1 shimmer-btn"
                  size="lg"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {effectiveStock === 0 ? "Out of Stock" : "Add to Cart"}
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleWishlistToggle}
                  className={wishlist ? "text-destructive border-destructive" : ""}
                >
                  <Heart className={`w-5 h-5 ${wishlist ? "fill-current" : ""}`} />
                </Button>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-3 gap-4 pt-4 border-t border-border"
              >
                {[
                  { icon: Truck, label: "Free Shipping", sub: "Orders over $100" },
                  { icon: RotateCcw, label: "30-Day Returns", sub: "Hassle-free" },
                  { icon: Shield, label: "2-Year Warranty", sub: "Peace of mind" },
                ].map(item => (
                  <div key={item.label} className="text-center">
                    <item.icon className="w-5 h-5 text-foreground-secondary mx-auto mb-1" />
                    <p className="text-xs font-medium text-foreground">{item.label}</p>
                    <p className="text-[10px] text-foreground-secondary">{item.sub}</p>
                  </div>
                ))}
              </motion.div>

              {/* Social Proof */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="flex items-center gap-3 text-sm text-foreground-secondary"
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-white flex items-center justify-center">
                      <span className="text-[10px] font-medium text-primary">{['JD','AK','ML'][i-1]}</span>
                    </div>
                  ))}
                </div>
                <p><strong className="text-foreground">24</strong> people bought this recently</p>
              </motion.div>

              {/* Social Share */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-2 pt-2"
              >
                <span className="text-xs font-medium text-foreground-secondary mr-1">Share:</span>
                {[
                  { key: 'facebook', icon: Facebook, label: 'Share on Facebook' },
                  { key: 'twitter', icon: Twitter, label: 'Share on Twitter' },
                  { key: 'whatsapp', icon: MessageCircle, label: 'Share on WhatsApp' },
                  { key: 'copy', icon: copied ? Check : Link2, label: 'Copy link' },
                ].map(({ key, icon: Icon, label }) => (
                  <button
                    key={key}
                    onClick={() => handleShare(key)}
                    className="w-8 h-8 rounded-full bg-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-all duration-200"
                    title={label}
                  >
                    <Icon className={`w-4 h-4 ${key === 'copy' && copied ? 'text-green-500' : ''}`} />
                  </button>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Media Showcase - Redesigned */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-16"
          >
            <div className="text-center mb-10">
              <p className="text-caption text-primary mb-3">Media Showcase</p>
              <h2 className="font-serif text-section-heading text-foreground">See it in action</h2>
              <p className="text-foreground-secondary mt-3 max-w-lg mx-auto">Explore the product through curated visuals and motion content</p>
            </div>

            <div className="grid lg:grid-cols-5 gap-4 lg:gap-6">
              {/* Hero image - takes 3 columns */}
              {images[0] && (
                <div className="lg:col-span-3 relative group">
                  <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full min-h-[300px] rounded-2xl overflow-hidden bg-muted shadow-md">
                    <Image
                      src={images[0].image_url}
                      alt={images[0].alt_text || product.title}
                      fill
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                      <span className="text-white/80 text-xs font-medium bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        {images.length} photos &middot; Click to explore
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Side gallery - takes 2 columns */}
              <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                {images.slice(1, 4).map((image, index) => {
                  const isLast = index === images.slice(1, 4).length - 1;
                  const remaining = images.length - 4;
                  return (
                    <div key={image.id} className="relative group">
                      <div className={`relative aspect-square rounded-xl overflow-hidden bg-muted shadow-sm ${isLast ? "" : ""}`}>
                        <Image
                          src={image.image_url}
                          alt={image.alt_text || product.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="25vw"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                        {isLast && remaining > 0 && (
                          <>
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <span className="text-white text-2xl font-bold">+{remaining}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
                {images.length <= 1 && (
                  <>
                    <div className="relative aspect-square rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center border border-dashed border-border">
                      <p className="text-xs text-foreground-secondary text-center px-4">More images coming soon</p>
                    </div>
                    <div className="relative aspect-square rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center border border-dashed border-border">
                      <p className="text-xs text-foreground-secondary text-center px-4">More images coming soon</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Video cards row */}
            {videos.length > 0 && (
              <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.slice(0, 3).map((video, index) => (
                  <motion.a
                    key={video.id || index}
                    href={video.video_url}
                    target="_blank"
                    rel="noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="group relative block"
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-muted shadow-sm">
                      {video.thumbnail_url ? (
                        <Image
                          src={video.thumbnail_url}
                          alt={video.title || `Video ${index + 1}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 1024px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center mx-auto mb-2">
                              <svg className="w-5 h-5 text-foreground ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                            <span className="text-xs text-foreground-secondary">Watch video</span>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-white transition-all duration-300">
                          <svg className="w-6 h-6 text-foreground ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      {video.title && (
                        <div className="absolute bottom-3 left-3 right-3">
                          <p className="text-sm font-medium text-white drop-shadow-lg">{video.title}</p>
                          {video.description && (
                            <p className="text-xs text-white/70 mt-0.5 line-clamp-1">{video.description}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.a>
                ))}
              </div>
            )}

            {/* Fallback video card when no videos */}
            {videos.length === 0 && images.length > 0 && (
              <div className="mt-8">
                <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-6 lg:p-8 shadow-sm">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-caption text-primary font-semibold">Video Ads</p>
                        <h3 className="font-serif text-2xl text-foreground mt-1">Watch the story</h3>
                        <p className="text-sm text-foreground-secondary mt-2 max-w-md leading-relaxed">
                          Short-form videos highlight <strong className="text-foreground">{product.title}</strong> in action with social-first styling and quick product tips.
                        </p>
                      </div>
                    </div>
                    <div className="rounded-xl border border-primary/10 bg-white/70 p-4 text-sm text-foreground-secondary max-w-xs">
                      {product.title} is featured in curated motion ads so customers can experience the look and feel before buying.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Image Slider */}
          <div className="mt-8">
            <ProductImageSlider images={images} productTitle={product.title} />
          </div>

          {/* Cross-sell */}
          {crossSellProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16"
            >
              <div className="mb-6 flex items-end justify-between">
                <div>
                  <p className="text-caption text-primary">Cross-sell</p>
                  <h2 className="font-serif text-2xl text-foreground">Complete the look</h2>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {crossSellProducts.map((p, index) => (
                  <ProductCard key={p.id} product={p} index={index} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Upsell */}
          {upsellProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16"
            >
              <div className="mb-6 flex items-end justify-between">
                <div>
                  <p className="text-caption text-primary">Upsell</p>
                  <h2 className="font-serif text-2xl text-foreground">Upgrade options</h2>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {upsellProducts.map((p, index) => (
                  <ProductCard key={p.id} product={p} index={index + 2} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Section Tabs - replaces accordion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 max-w-4xl"
          >
            <div className="border-b border-border flex gap-0 overflow-x-auto">
              {sectionTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                    activeSection === tab.id
                      ? "border-primary text-foreground"
                      : "border-transparent text-foreground-secondary hover:text-foreground hover:border-foreground/20"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="py-6">
              <AnimatePresence mode="wait">
                {activeSection === "description" && (
                  <motion.div
                    key="description"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div
                      className="text-sm text-foreground-secondary prose prose-sm max-w-none leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: product.description || "<p>No description available.</p>" }}
                    />
                  </motion.div>
                )}

                {activeSection === "shipping" && (
                  <motion.div
                    key="shipping"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="grid gap-4 sm:grid-cols-3">
                      {[
                        { icon: Package, title: "Standard", desc: "5-7 business days", price: "$9.99 or Free over $100" },
                        { icon: Clock, title: "Express", desc: "2-3 business days", price: "$19.99" },
                        { icon: MapPin, title: "International", desc: "10-15 business days", price: "Varies by region" },
                      ].map(item => (
                        <div key={item.title} className="rounded-xl border border-border p-4">
                          <item.icon className="w-5 h-5 text-primary mb-2" />
                          <p className="text-sm font-medium text-foreground">{item.title}</p>
                          <p className="text-xs text-foreground-secondary">{item.desc}</p>
                          <p className="text-xs font-medium text-foreground mt-1">{item.price}</p>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-xl bg-success/5 border border-success/10 p-4">
                      <p className="text-sm font-medium text-success flex items-center gap-2">
                        <Truck className="w-4 h-4" />
                        Free shipping on all orders over $100
                      </p>
                      <p className="text-xs text-foreground-secondary mt-1">Returns are accepted within 30 days of purchase. Items must be unworn with original tags and packaging.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* FAQ Section - standalone accordion */}
          <div className="mt-20 max-w-4xl" id="product-faq">
            <div className="mb-8">
              <p className="text-caption text-primary mb-2">FAQ</p>
              <h2 className="font-serif text-section-heading text-foreground">Frequently asked questions</h2>
            </div>
            <div className="space-y-3">
              {productFaqs.map((faq, index) => (
                <div key={index} className="border border-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                    className="flex items-center justify-between w-full p-4 lg:p-5 text-left hover:bg-muted/30 transition-colors"
                  >
                    <span className="text-sm lg:text-base font-medium text-foreground pr-4">{faq.question}</span>
                    <ChevronRight
                      className={`w-4 h-4 text-foreground-secondary flex-shrink-0 transition-transform duration-200 ${
                        activeFaq === index ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {activeFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="px-4 lg:px-5 pb-4 lg:pb-5 text-sm text-foreground-secondary leading-relaxed">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              <p className="text-sm text-foreground-secondary pt-2">
                Have more questions?{" "}
                <Link href="/faq" className="text-primary hover:underline font-medium">
                  Visit our FAQ page
                </Link>
              </p>
            </div>
          </div>

          {/* Reviews Section - standalone */}
          <div className="mt-20 max-w-4xl" id="product-reviews">
            <div className="mb-8">
              <p className="text-caption text-primary mb-2">Reviews</p>
              <h2 className="font-serif text-section-heading text-foreground">
                Customer reviews{product.review_count ? ` (${product.review_count})` : ''}
              </h2>
            </div>
            <ProductReviews
              productId={product.id}
              reviewCount={product.review_count}
              averageRating={product.average_rating}
            />
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-20"
            >
              <h2 className="font-serif text-section-heading text-foreground mb-8">Related products</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {relatedProducts.map((p, index) => (
                  <ProductCard key={p.id} product={p} index={index} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Recently Viewed */}
          {recentProducts.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-20"
            >
              <h2 className="font-serif text-section-heading text-foreground mb-8">Recently viewed</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin">
                {recentProducts.filter(item => item.id !== product.id).map((item, index) => (
                  <div key={item.id} className="min-w-[220px] md:min-w-[250px] snap-start">
                    <ProductCard product={item} index={index} />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <InstagramVideos productTitle={product.title} />
        </div>
      </div>

      {/* Sticky Mobile Add-to-Cart Bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-border px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
      >
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div>
            <p className="text-xs text-foreground-secondary">Price</p>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-foreground">
                {formatCurrency(effectivePrice)}
              </span>
              {isOnSale && (
                <span className="text-sm text-foreground-secondary line-through">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-9 w-9 flex items-center justify-center hover:bg-muted transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="h-9 w-10 flex items-center justify-center text-sm font-medium border-x border-border bg-muted/30">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(effectiveStock, quantity + 1))}
                className="h-9 w-9 flex items-center justify-center hover:bg-muted transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <Button
              onClick={handleAddToCart}
              disabled={effectiveStock === 0}
              className="shimmer-btn h-10"
            >
              <ShoppingBag className="w-4 h-4" />
              {effectiveStock === 0 ? "Sold Out" : "Add"}
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
}