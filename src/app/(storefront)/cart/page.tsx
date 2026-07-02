"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/contexts/cart-context";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, subtotal, itemCount } = useCart();
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="section-padding">
      <div className="container-xl">
        <h1 className="font-serif text-section-heading text-foreground mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-20 h-20 text-foreground-secondary/20 mx-auto mb-6" />
            <p className="text-xl font-medium text-foreground mb-2">Your cart is empty</p>
            <p className="text-sm text-foreground-secondary mb-8">
              Looks like you haven&apos;t added any items yet.
            </p>
            <Link href="/products">
              <Button size="lg" className="shimmer-btn">Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-foreground-secondary">{itemCount} item{itemCount !== 1 ? "s" : ""} in cart</p>
                <button onClick={clearCart} className="text-xs text-destructive hover:text-destructive/80 transition-colors">
                  Clear Cart
                </button>
              </div>
              {items.map((item) => {
                const price = item.variant?.price || item.product.sale_price || item.product.price;
                return (
                  <motion.div
                    key={`${item.product.id}-${item.variant?.id}`}
                    layout
                    className="card p-4 flex gap-4"
                  >
                    <div className="h-28 w-28 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                      {item.product.product_images?.[0] ? (
                        <Image
                          src={item.product.product_images[0].image_url}
                          alt={item.product.title}
                          width={112}
                          height={112}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-foreground-secondary/20">
                          <ShoppingBag className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link href={`/products/${item.product.slug}`} className="font-medium text-foreground hover:text-primary transition-colors">
                            {item.product.title}
                          </Link>
                          {item.variant && (
                            <p className="text-xs text-foreground-secondary mt-1">
                              {item.variant.option_values.map((v) => v.value).join(" / ")}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id, item.variant?.id)}
                          className="p-1 text-foreground-secondary hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2 border border-border rounded-lg">
                          <button onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variant?.id)} className="h-8 w-8 flex items-center justify-center hover:bg-muted transition-colors rounded-l-lg">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variant?.id)} className="h-8 w-8 flex items-center justify-center hover:bg-muted transition-colors rounded-r-lg">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="font-semibold text-foreground">{formatCurrency(price * item.quantity)}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-foreground mb-6">Order Summary</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground-secondary">Subtotal</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-secondary">Shipping</span>
                    <span className="font-medium">{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-secondary">Tax</span>
                    <span className="font-medium">{formatCurrency(tax)}</span>
                  </div>
                  <hr className="border-border my-4" />
                  <div className="flex justify-between text-base font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-foreground-secondary mt-3">
                    Free shipping on orders over $100
                  </p>
                )}
                <Link href="/checkout">
                  <Button className="w-full mt-6 shimmer-btn" size="lg">
                    Proceed to Checkout
                  </Button>
                </Link>
                <Link href="/products" className="block text-center text-sm text-foreground-secondary hover:text-foreground mt-4 transition-colors">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
