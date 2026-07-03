"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, Trash2, Copy, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

const placeholderMedia = [
  { id: "1", url: "/images/products/product-1.jpg", filename: "cylinder-head.jpg", size: 68000, mime_type: "image/jpeg" },
  { id: "2", url: "/images/products/product-2.jpg", filename: "brake-rotor-set.jpg", size: 60000, mime_type: "image/jpeg" },
  { id: "3", url: "/images/products/product-3.jpg", filename: "led-headlight-kit.jpg", size: 80000, mime_type: "image/jpeg" },
  { id: "4", url: "/images/hero/hero-2.jpg", filename: "workshop-hero.jpg", size: 622000, mime_type: "image/jpeg" },
  { id: "5", url: "/images/banners/industrial-banner.jpg", filename: "industrial-banner.jpg", size: 178000, mime_type: "image/jpeg" },
  { id: "6", url: "/images/hero/hero-1.jpg", filename: "warehouse-hero.jpg", size: 193000, mime_type: "image/jpeg" },
];

function formatFileSize(bytes: number): string {
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

export default function AdminMediaPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Media Library</h1>
          <p className="text-sm text-foreground-secondary mt-1">{placeholderMedia.length} files</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-muted rounded-lg p-1">
            <button onClick={() => setView("grid")} className={`p-1.5 rounded ${view === "grid" ? "bg-white shadow-sm" : ""}`}>
              <Grid className="w-4 h-4" />
            </button>
            <button onClick={() => setView("list")} className={`p-1.5 rounded ${view === "list" ? "bg-white shadow-sm" : ""}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
          <Button><Upload className="w-4 h-4" /> Upload</Button>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
        <Upload className="w-10 h-10 text-foreground-secondary/30 mx-auto mb-3" />
        <p className="text-sm font-medium">Drag and drop images here, or click to browse</p>
        <p className="text-xs text-foreground-secondary mt-1">Supports JPG, PNG, GIF, WebP up to 5MB</p>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {placeholderMedia.map((media) => (
            <div
              key={media.id}
              onClick={() => toggleSelect(media.id)}
              className={`group relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                selected.includes(media.id) ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-border"
              }`}
            >
              <Image src={media.url} alt={media.filename} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <button className="p-2 bg-white rounded-lg hover:bg-white/90"><Copy className="w-4 h-4" /></button>
                  <button className="p-2 bg-white rounded-lg hover:bg-white/90 text-destructive"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-xs font-medium truncate">{media.filename}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-foreground-secondary p-4">File</th>
                <th className="text-left text-xs font-medium text-foreground-secondary p-4">Size</th>
                <th className="text-left text-xs font-medium text-foreground-secondary p-4">Type</th>
                <th className="text-right text-xs font-medium text-foreground-secondary p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {placeholderMedia.map((media) => (
                <tr key={media.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={media.url} alt={media.filename} width={40} height={40} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm font-medium">{media.filename}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-foreground-secondary">{formatFileSize(media.size)}</td>
                  <td className="p-4 text-sm text-foreground-secondary">{media.mime_type}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 hover:bg-muted rounded-lg"><Copy className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-muted rounded-lg text-destructive"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
