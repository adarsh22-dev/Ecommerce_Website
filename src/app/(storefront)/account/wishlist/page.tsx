"use client";

import { useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { ProductCard } from "@/components/storefront/product-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const placeholderWishlist = [
  {
    id: "1", title: "Turbocharger Assembly Kit", slug: "turbocharger-assembly-kit", price: 45000, sale_price: 39999,
    category: { name: "Engine & Drivetrain" },
    product_images: [{ image_url: "/images/products/product-3.jpg" }],
    created_at: new Date().toISOString(), status: "active" as const, sku: "ENG-TC-002", stock_quantity: 10,
    track_inventory: true, allow_backorders: false, tags: [], description: null, sale_start: null, sale_end: null,
    meta_title: null, meta_description: null, og_image_url: null,
  },
  {
    id: "4", title: "Diesel Engine Cylinder Head Assembly", slug: "diesel-engine-cylinder-head-assembly", price: 28500, sale_price: 24999,
    category: { name: "Engine & Drivetrain" },
    product_images: [{ image_url: "/images/products/product-1.jpg" }],
    created_at: new Date().toISOString(), status: "active" as const, sku: "ENG-CH-001", stock_quantity: 15,
    track_inventory: true, allow_backorders: false, tags: [], description: null, sale_start: null, sale_end: null,
    meta_title: null, meta_description: null, og_image_url: null,
  },
];

export default function WishlistPage() {
  const [items, setItems] = useState(placeholderWishlist);

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-6">Wishlist</h2>
      {items.length === 0 ? (
        <div className="card p-12 text-center">
          <Heart className="w-16 h-16 text-foreground-secondary/20 mx-auto mb-4" />
          <p className="text-lg font-medium mb-2">Your wishlist is empty</p>
          <p className="text-sm text-foreground-secondary mb-6">Save your favorite items here.</p>
          <Link href="/products"><Button className="shimmer-btn">Browse Products</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {items.map((product, index) => (
            <ProductCard key={product.id} product={product as any} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
