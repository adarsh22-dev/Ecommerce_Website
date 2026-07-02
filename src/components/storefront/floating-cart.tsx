"use client";

import { useCart } from "@/lib/contexts/cart-context";

export function FloatingCart() {
  // This component ensures the cart context is always mounted
  // for the floating cart animation to work
  const { itemCount } = useCart();
  return null;
}
