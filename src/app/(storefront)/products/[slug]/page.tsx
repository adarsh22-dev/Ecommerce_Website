"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Star, Heart, ShoppingBag, Minus, Plus, ChevronRight, Truck, RotateCcw, Shield, Facebook, Twitter, MessageCircle, Link2, Check } from "lucide-react";
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
import type { ProductWithDetails } from "@/lib/types";

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

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const resolvedParams = params;
  const [product, setProduct] = useState<ProductWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState<string | null>("description");
  const [wishlist, setWishlist] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<ProductWithDetails[]>([]);
  const [recentProducts, setRecentProducts] = useState<ProductWithDetails[]>([]);
  const [copied, setCopied] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [mediaContent, setMediaContent] = useState<{ images: any[]; videos: any[] }>({ images: [], videos: [] });
  const { addItem, openCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { getProductBySlug, getRelatedProducts: fetchRelated } = await import("@/lib/services/products");
        const data = await getProductBySlug(resolvedParams.slug);
        setProduct(data as ProductWithDetails);

        if (data.category_id) {
          try {
            const related = await fetchRelated(data.category_id, data.id, 4);
            setRelatedProducts(related as ProductWithDetails[]);
          } catch {
            // Related products not critical
          }
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
    } catch {
      // ignore storage errors
    }
  }, [product]);

  useEffect(() => {
    if (!product || !user) return;
    async function checkWishlist() {
      try {
        const { isInWishlist } = await import("@/lib/services/user");
        const inWishlist = await isInWishlist(user!.id, product!.id);
        setWishlist(inWishlist);
      } catch {
        // Not critical
      }
    }
    checkWishlist();
  }, [product, user]);

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
  const primaryImage = images[0]?.image_url;
  const isOnSale = product.sale_price !== null && product.sale_price < product.price;
  const discount = isOnSale ? calculateDiscount(product.price, product.sale_price!) : 0;

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

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  const productFaqs = [
    { question: `Is the ${product.title} authentic?`, answer: "Yes, all our products are 100% authentic and sourced directly from authorized manufacturers and distributors." },
    { question: `What is the warranty on the ${product.title}?`, answer: "Every purchase comes with a 2-year warranty covering manufacturing defects. Extended warranty options are available at checkout." },
    { question: "How long does shipping take?", answer: "Standard shipping takes 5-7 business days. Express shipping delivers within 2-3 business days. Free standard shipping on orders over $100." },
    { question: "Can I return this product?", answer: "Yes! We offer a 30-day return policy on all unworn, unwashed items in original packaging. Simply contact our support team to initiate a return." },
    { question: "What payment methods do you accept?", answer: "We accept all major credit cards (Visa, Mastercard, Amex), Google Pay, and other secure payment methods through our payment processor." },
  ];

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

  const productSchema = {
    title: product.title,
    description: product.description,
    slug: product.slug,
    price: isOnSale ? product.sale_price! : product.price,
    image: primaryImage || undefined,
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

  return (
    <>
      <ProductJsonLd product={productSchema} />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <FaqJsonLd questions={productFaqs} />
    <div className="section-padding">
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
          <span className="text-foreground font-medium">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Polished product collage */}
          <div className="relative space-y-4">
            <AmazonGallery
              images={images}
              productTitle={product.title}
              isOnSale={isOnSale}
              discount={discount}
            />
            {videos.length > 0 && (
              <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-primary">Video ad</p>
                    <h3 className="font-serif text-xl text-foreground">{videos[0].title}</h3>
                    {videos[0].description && <p className="mt-1 text-sm text-foreground-secondary">{videos[0].description}</p>}
                  </div>
                  <a href={videos[0].video_url} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background">Watch</a>
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              {product.category && (
                <p className="text-caption text-primary mb-2">{product.category.name}</p>
              )}
              <h1 className="font-serif text-section-heading text-foreground">{product.title}</h1>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`w-4 h-4 ${star <= (product.average_rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                  ))}
                  {product.review_count !== undefined && (
                    <span className="text-sm text-foreground-secondary ml-2">({product.average_rating?.toFixed(1)} · {product.review_count} reviews)</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <span className="text-2xl font-semibold text-foreground">
                  {formatCurrency(isOnSale ? product.sale_price! : product.price)}
                </span>
                {isOnSale && (
                  <span className="text-lg text-foreground-secondary line-through">
                    {formatCurrency(product.price)}
                  </span>
                )}
              </div>
            </div>

            {/* Options */}
            {product.product_options?.map((option) => (
              <div key={option.id}>
                <p className="text-sm font-medium text-foreground mb-3">
                  {option.name}: <span className="text-foreground-secondary">{selectedOptions[option.name] || "Select"}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {option.product_option_values.map((value) => (
                    <button
                      key={value.id}
                      onClick={() => setSelectedOptions({ ...selectedOptions, [option.name]: value.value })}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                        selectedOptions[option.name] === value.value
                          ? "border-primary bg-primary text-white"
                          : "border-border hover:border-foreground/30"
                      }`}
                    >
                      {value.value}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity */}
            <div>
              <p className="text-sm font-medium text-foreground mb-3">Quantity</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10 flex items-center justify-center hover:bg-muted transition-colors rounded-l-lg"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="h-10 w-12 flex items-center justify-center text-sm font-medium border-x border-border">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    className="h-10 w-10 flex items-center justify-center hover:bg-muted transition-colors rounded-r-lg"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-foreground-secondary">
                  {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : "Out of stock"}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-muted/30 p-4">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-foreground-secondary shadow-sm">
                    #{tag}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-sm leading-6 text-foreground-secondary">{shortDescription}</p>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                className="flex-1 shimmer-btn"
                size="lg"
              >
                <ShoppingBag className="w-5 h-5" />
                {product.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={handleWishlistToggle}
                className={wishlist ? "text-destructive border-destructive" : ""}
              >
                <Heart className={`w-5 h-5 ${wishlist ? "fill-current" : ""}`} />
              </Button>
            </div>

            {/* Trust */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
              {[
                { icon: Truck, label: "Free Shipping" },
                { icon: RotateCcw, label: "30-Day Returns" },
                { icon: Shield, label: "2-Year Warranty" },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <item.icon className="w-5 h-5 text-foreground-secondary mx-auto mb-1" />
                  <p className="text-xs text-foreground-secondary">{item.label}</p>
                </div>
              ))}
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-3 text-sm text-foreground-secondary">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-white flex items-center justify-center">
                    <span className="text-[10px] font-medium text-primary">{['JD','AK','ML'][i-1]}</span>
                  </div>
                ))}
              </div>
              <p><strong className="text-foreground">24</strong> people bought this recently</p>
            </div>

            {/* Social Share */}
            <div className="flex items-center gap-2 pt-2">
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
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-caption text-primary">Image collage</p>
                <h2 className="font-serif text-2xl text-foreground">Visual showcase</h2>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {images.slice(0, 4).map((image, index) => (
                <div key={image.id} className={`relative aspect-[4/5] overflow-hidden rounded-2xl ${index === 0 ? "sm:col-span-2" : ""}`}>
                  <Image src={image.image_url} alt={image.alt_text || product.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-gradient-to-br from-primary/10 to-transparent p-6">
            <p className="text-caption text-primary">Video ads</p>
            <h2 className="font-serif text-2xl text-foreground">Watch the story</h2>
            <p className="mt-3 text-sm leading-6 text-foreground-secondary">Short-form videos highlight the product in action with social-first styling and quick product tips.</p>
            <div className="mt-4 rounded-2xl border border-primary/20 bg-white/70 p-4 text-sm text-foreground-secondary">
              {product.title} is featured in curated motion ads so customers can experience the look and feel before buying.
            </div>
          </div>
        </div>

        <div className="mt-8">
          <ProductImageSlider images={images} productTitle={product.title} />
        </div>

        {crossSellProducts.length > 0 && (
          <div className="mt-16">
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
          </div>
        )}

        {upsellProducts.length > 0 && (
          <div className="mt-16">
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
          </div>
        )}

        {/* Accordion Sections */}
        <div className="mt-20 max-w-3xl">
          {[
            { id: "description", title: "Description", content: product.description || "<p>No description available.</p>" },
            { id: "shipping", title: "Shipping & Returns", content: "<p>Free standard shipping on orders over $100. Express shipping available at checkout. Returns accepted within 30 days of purchase.</p>" },
            { id: "faq", title: "FAQ", content: "faq-component" },
            { id: "reviews", title: `Reviews${product.review_count ? ` (${product.review_count})` : ''}`, content: "reviews-component" },
          ].map((section) => (
            <div key={section.id} className="border-b border-border">
              <button
                onClick={() => toggleAccordion(section.id)}
                className="flex items-center justify-between w-full py-5 text-left"
              >
                <span className="text-base font-medium text-foreground">{section.title}</span>
                <motion.div
                  animate={{ rotate: activeAccordion === section.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="w-5 h-5 text-foreground-secondary rotate-90" />
                </motion.div>
              </button>
              <AnimatePresence>
                {activeAccordion === section.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    {section.id === "reviews" ? (
                      <div className="pb-6">
                        <ProductReviews
                          productId={product.id}
                          reviewCount={product.review_count}
                          averageRating={product.average_rating}
                        />
                      </div>
                    ) : section.id === "faq" ? (
                      <div className="pb-6 space-y-3">
                        {productFaqs.map((faq, index) => (
                          <div key={index} className="border border-border rounded-xl overflow-hidden">
                            <button
                              onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                              className="flex items-center justify-between w-full p-4 text-left"
                            >
                              <span className="text-sm font-medium text-foreground pr-4">{faq.question}</span>
                              <motion.div
                                animate={{ rotate: activeFaq === index ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronRight className="w-4 h-4 text-foreground-secondary rotate-90 flex-shrink-0" />
                              </motion.div>
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
                                  <p className="px-4 pb-4 text-sm text-foreground-secondary leading-relaxed">{faq.answer}</p>
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
                    ) : (
                      <div
                        className="pb-6 text-sm text-foreground-secondary prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: section.content || "" }}
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="font-serif text-section-heading text-foreground mb-8">Related products</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {relatedProducts.map((p, index) => (
                <ProductCard key={p.id} product={p} index={index} />
              ))}
            </div>
          </div>
        )}

        {recentProducts.length > 1 && (
          <div className="mt-20">
            <h2 className="font-serif text-section-heading text-foreground mb-8">Recently viewed</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {recentProducts.filter((item) => item.id !== product.id).map((item, index) => (
                <ProductCard key={item.id} product={item} index={index} />
              ))}
            </div>
          </div>
        )}

        <InstagramVideos productTitle={product.title} />
      </div>
    </div>
    </>
  );
}
