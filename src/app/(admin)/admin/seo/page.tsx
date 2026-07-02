"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

export default function AdminSeoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">SEO Settings</h1>
        <p className="text-sm text-foreground-secondary mt-1">Configure search engine optimization settings</p>
      </div>

      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="font-semibold mb-4">Global SEO</h2>
        <div className="space-y-4 max-w-2xl">
          <Input label="Meta Title Template" defaultValue="{Page Title} | ECOM" placeholder="{Page Title} | {Site Name}" />
          <Textarea label="Default Meta Description" defaultValue="Discover curated collections of premium products." />
          <Input label="Google Analytics ID" placeholder="G-XXXXXXXXXX" />
          <Input label="Google Search Console Verification" placeholder="Meta tag content" />
          <Input label="Facebook Pixel ID" placeholder="XXXXXXXXXX" />
          <Button onClick={() => toast.success("SEO settings saved!")} className="shimmer-btn">Save Changes</Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="font-semibold mb-4">Robots.txt</h2>
        <Textarea label="" defaultValue={"User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: https://ecom.com/sitemap.xml"} />
        <Button onClick={() => toast.success("Robots.txt saved!")} className="shimmer-btn mt-4">Save</Button>
      </div>

      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="font-semibold mb-4">Structured Data</h2>
        <p className="text-sm text-foreground-secondary mb-4">JSON-LD structured data is automatically injected into pages.</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-sm">Organization Schema (Homepage)</span>
            <span className="text-xs text-success font-medium">Active</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-sm">Product Schema (PDP)</span>
            <span className="text-xs text-success font-medium">Active</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm">BreadcrumbList Schema</span>
            <span className="text-xs text-success font-medium">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
