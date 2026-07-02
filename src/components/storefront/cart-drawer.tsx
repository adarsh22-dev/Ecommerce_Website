"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, itemCount } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Cart ({itemCount})</h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <ShoppingBag className="w-16 h-16 text-foreground-secondary/20 mb-4" />
                  <p className="text-lg font-medium text-foreground mb-2">Your cart is empty</p>
                  <p className="text-sm text-foreground-secondary mb-6">
                    Add some items to get started
                  </p>
                  <Button variant="secondary" onClick={closeCart}>
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {items.map((item, index) => {
                    const price = item.variant?.price || item.product.sale_price || item.product.price;
                    return (
                      <motion.div
                        key={`${item.product.id}-${item.variant?.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex gap-4 p-6 border-b border-border"
                      >
                        <div className="h-24 w-24 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                          {item.product.product_images?.[0] ? (
                            <Image
                              src={item.product.product_images[0].image_url}
                              alt={item.product.title}
                              width={96}
                              height={96}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-foreground-secondary/30">
                              <ShoppingBag className="w-8 h-8" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              href={`/products/${item.product.slug}`}
                              onClick={closeCart}
                              className="text-sm font-medium text-foreground hover:text-primary transition-colors truncate"
                            >
                              {item.product.title}
                            </Link>
                            <button
                              onClick={() => removeItem(item.product.id, item.variant?.id)}
                              className="flex-shrink-0 p-1 text-foreground-secondary hover:text-destructive transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          {item.variant && (
                            <p className="text-xs text-foreground-secondary mt-1">
                              {item.variant.option_values.map((v) => v.value).join(" / ")}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  updateQuantity(item.product.id, item.quantity - 1, item.variant?.id)
                                }
                                className="h-7 w-7 rounded-md border border-border flex items-center justify-center hover:bg-muted transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.product.id, item.quantity + 1, item.variant?.id)
                                }
                                className="h-7 w-7 rounded-md border border-border flex items-center justify-center hover:bg-muted transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <p className="text-sm font-semibold">{formatCurrency(price * item.quantity)}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground-secondary">Subtotal</span>
                  <span className="text-lg font-semibold">{formatCurrency(subtotal)}</span>
                </div>
                <p className="text-xs text-foreground-secondary">
                  Shipping and taxes calculated at checkout
                </p>
                <Link href="/checkout" onClick={closeCart}>
                  <Button className="w-full shimmer-btn" size="lg">
                    Proceed to Checkout
                  </Button>
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="block text-center text-sm text-foreground-secondary hover:text-foreground transition-colors"
                >
                  View Full Cart
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
