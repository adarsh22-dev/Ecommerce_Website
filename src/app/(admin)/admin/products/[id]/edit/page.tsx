"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductContentForm } from "@/components/admin/product-content-form";
import { getProductById } from "@/lib/services/products";
import { getProductMediaForSlug } from "@/lib/services/product-content";

export default function AdminProductEditPage() {
  const params = useParams();
  const [slug, setSlug] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<Array<{ video_url: string; thumbnail_url?: string | null; title?: string | null; description?: string | null }>>([]);

  useEffect(() => {
    async function load() {
      const id = params.id as string;
      const product = await getProductById(id);
      const media = await getProductMediaForSlug(product?.slug);
      setSlug(product?.slug ?? id);
      setImages((product?.product_images || []).map((image: any) => image.image_url));
      setVideos(media?.videos ?? []);
    }
    load();
  }, [params.id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/products">
          <Button variant="secondary" size="sm"><ArrowLeft className="mr-2 h-4 w-4" />Back</Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Edit product content</h1>
          <p className="text-sm text-foreground-secondary">Manage gallery images and promo videos for this product.</p>
        </div>
      </div>
      <ProductContentForm slug={slug} initialImages={images} initialVideos={videos} />
    </div>
  );
}
