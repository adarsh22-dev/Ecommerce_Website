"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { saveProductContent } from "@/lib/services/product-content";

interface ProductContentFormProps {
  slug: string;
  initialImages?: string[];
  initialVideos?: Array<{ video_url: string; thumbnail_url?: string | null; title?: string | null; description?: string | null }>;
}

export function ProductContentForm({ slug, initialImages = [], initialVideos = [] }: ProductContentFormProps) {
  const [images, setImages] = useState(initialImages.join("\n"));
  const [videoUrl, setVideoUrl] = useState(initialVideos[0]?.video_url ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState(initialVideos[0]?.thumbnail_url ?? "");
  const [title, setTitle] = useState(initialVideos[0]?.title ?? "");
  const [description, setDescription] = useState(initialVideos[0]?.description ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setImages(initialImages.join("\n"));
    setVideoUrl(initialVideos[0]?.video_url ?? "");
    setThumbnailUrl(initialVideos[0]?.thumbnail_url ?? "");
    setTitle(initialVideos[0]?.title ?? "");
    setDescription(initialVideos[0]?.description ?? "");
  }, [initialImages, initialVideos]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveProductContent(slug, {
        images: images.split(/\n|,/).map((value) => value.trim()).filter(Boolean),
        videos: videoUrl ? [{ video_url: videoUrl, thumbnail_url: thumbnailUrl || undefined, title: title || undefined, description: description || undefined }] : [],
      });
      toast.success("Product media saved");
    } catch {
      toast.error("Could not save product media");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 rounded-xl border border-border bg-background/70 p-4">
      <div>
        <h3 className="font-semibold text-foreground">Gallery and video ad content</h3>
        <p className="text-sm text-foreground-secondary">Admins and vendors can manage the collage and promo video shown on the product page.</p>
      </div>
      <Input label="Image URLs (one per line)" value={images} onChange={(e) => setImages(e.target.value)} textarea rows={6} />
      <Input label="Video URL" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
      <Input label="Thumbnail URL" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} />
      <Input label="Video title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Input label="Video description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save content"}</Button>
    </div>
  );
}
