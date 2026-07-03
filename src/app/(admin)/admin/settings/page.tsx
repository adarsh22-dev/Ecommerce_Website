"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabPanel } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";

interface SiteSettings {
  id: string;
  site_name: string;
  tagline: string | null;
  logo_url: string | null;
  logo_inverted_url: string | null;
  favicon_url: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  business_address: string | null;
  currency_code: string;
  currency_symbol: string;
  tax_rate: number;
  tax_inclusive: boolean;
  social_instagram: string | null;
  social_facebook: string | null;
  social_twitter: string | null;
  social_tiktok: string | null;
  social_youtube: string | null;
  openrouter_api_key: string | null;
  openrouter_model: string | null;
}

const defaultSettings: SiteSettings = {
  id: "1",
  site_name: "ECOM",
  tagline: "Premium Shopping Experience",
  logo_url: null,
  logo_inverted_url: null,
  favicon_url: null,
  contact_email: "",
  contact_phone: "",
  business_address: "",
  currency_code: "USD",
  currency_symbol: "$",
  tax_rate: 0,
  tax_inclusive: false,
  social_instagram: "",
  social_facebook: "",
  social_twitter: "",
  social_tiktok: "",
  social_youtube: "",
  openrouter_api_key: null,
  openrouter_model: null,
};

const settingsTabs = [
  { label: "Brand", value: "brand" },
  { label: "Contact", value: "contact" },
  { label: "Shipping", value: "shipping" },
  { label: "Tax", value: "tax" },
  { label: "Social", value: "social" },
  { label: "AI", value: "ai" },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("brand");
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      const supabase = (await import("@/lib/supabase/client")).createClient();
      const { data } = await supabase.from("site_settings").select("*").eq("id", "1").single();
      if (data) setSettings(data as SiteSettings);
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const supabase = (await import("@/lib/supabase/client")).createClient();
      const { error } = await supabase.from("site_settings").update({
        site_name: settings.site_name,
        tagline: settings.tagline,
        contact_email: settings.contact_email,
        contact_phone: settings.contact_phone,
        business_address: settings.business_address,
        tax_rate: settings.tax_rate,
        tax_inclusive: settings.tax_inclusive,
        social_instagram: settings.social_instagram,
        social_facebook: settings.social_facebook,
        social_twitter: settings.social_twitter,
        social_tiktok: settings.social_tiktok,
        social_youtube: settings.social_youtube,
        openrouter_api_key: settings.openrouter_api_key || null,
        openrouter_model: settings.openrouter_model || null,
      }).eq("id", "1");
      if (error) throw error;
      toast.success("Settings saved!");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div><Skeleton className="h-8 w-48" /><Skeleton className="h-4 w-64 mt-2" /></div>
        <div className="admin-card p-6 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-foreground-secondary mt-1">Manage your store settings and configuration</p>
      </div>

      <div className="admin-card p-6">
        <Tabs tabs={settingsTabs} value={activeTab} onChange={setActiveTab}>
          <TabPanel value="brand" activeTab={activeTab}>
            <div className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-medium mb-2">Brand Logo</label>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-40 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border text-sm text-foreground-secondary hover:border-primary/40 transition-colors cursor-pointer">
                    {settings.logo_url ? (
                      <img src={settings.logo_url} alt="Logo" className="h-full w-full object-contain p-2" />
                    ) : (
                      "Upload Logo"
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-foreground-secondary">Recommended: 200x50px, PNG or SVG</p>
                    <Button variant="secondary" size="sm" className="mt-2">Upload</Button>
                  </div>
                </div>
              </div>
              <Input
                label="Site Name"
                value={settings.site_name}
                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
              />
              <Textarea
                label="Tagline"
                value={settings.tagline || ""}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Currency Code" value={settings.currency_code} onChange={(e) => setSettings({ ...settings, currency_code: e.target.value })} />
                <Input label="Currency Symbol" value={settings.currency_symbol} onChange={(e) => setSettings({ ...settings, currency_symbol: e.target.value })} />
              </div>
              <Button onClick={handleSave} loading={saving} className="shimmer-btn">Save Changes</Button>
            </div>
          </TabPanel>

          <TabPanel value="contact" activeTab={activeTab}>
            <div className="space-y-4 max-w-2xl">
              <Input label="Business Email" type="email" value={settings.contact_email || ""} onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })} />
              <Input label="Phone" value={settings.contact_phone || ""} onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })} />
              <Textarea label="Business Address" value={settings.business_address || ""} onChange={(e) => setSettings({ ...settings, business_address: e.target.value })} />
              <Button onClick={handleSave} loading={saving} className="shimmer-btn">Save Changes</Button>
            </div>
          </TabPanel>

          <TabPanel value="shipping" activeTab={activeTab}>
            <div className="space-y-4 max-w-2xl">
              <p className="text-sm text-foreground-secondary">Shipping methods are managed in the shipping configuration.</p>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-1">Default Settings</p>
                <p className="text-xs text-foreground-secondary">Configure shipping rates, free shipping thresholds, and estimated delivery times.</p>
              </div>
              <div className="border border-border rounded-xl divide-y divide-border">
                <div className="p-4 flex items-center justify-between">
                  <div><p className="text-sm font-medium">Free Shipping</p><p className="text-xs text-foreground-secondary">Orders over $100</p></div>
                  <span className="text-sm font-medium text-success">Free</span>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div><p className="text-sm font-medium">Standard Shipping</p><p className="text-xs text-foreground-secondary">5-7 business days</p></div>
                  <span className="text-sm font-medium">$9.99</span>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div><p className="text-sm font-medium">Express Shipping</p><p className="text-xs text-foreground-secondary">2-3 business days</p></div>
                  <span className="text-sm font-medium">$19.99</span>
                </div>
              </div>
              <Button onClick={handleSave} loading={saving} className="shimmer-btn">Save Changes</Button>
            </div>
          </TabPanel>

          <TabPanel value="tax" activeTab={activeTab}>
            <div className="space-y-4 max-w-2xl">
              <Input
                label="Tax Rate (%)"
                type="number"
                step="0.01"
                value={settings.tax_rate.toString()}
                onChange={(e) => setSettings({ ...settings, tax_rate: parseFloat(e.target.value) || 0 })}
              />
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.tax_inclusive}
                  onChange={(e) => setSettings({ ...settings, tax_inclusive: e.target.checked })}
                  className="rounded border-border accent-primary"
                />
                <span className="text-sm text-foreground">Tax-inclusive pricing (prices shown include tax)</span>
              </label>
              <Button onClick={handleSave} loading={saving} className="shimmer-btn">Save Changes</Button>
            </div>
          </TabPanel>

          <TabPanel value="social" activeTab={activeTab}>
            <div className="space-y-4 max-w-2xl">
              <Input label="Instagram URL" placeholder="https://instagram.com/..." value={settings.social_instagram || ""} onChange={(e) => setSettings({ ...settings, social_instagram: e.target.value })} />
              <Input label="Facebook URL" placeholder="https://facebook.com/..." value={settings.social_facebook || ""} onChange={(e) => setSettings({ ...settings, social_facebook: e.target.value })} />
              <Input label="Twitter / X URL" placeholder="https://twitter.com/..." value={settings.social_twitter || ""} onChange={(e) => setSettings({ ...settings, social_twitter: e.target.value })} />
              <Input label="TikTok URL" placeholder="https://tiktok.com/..." value={settings.social_tiktok || ""} onChange={(e) => setSettings({ ...settings, social_tiktok: e.target.value })} />
              <Input label="YouTube URL" placeholder="https://youtube.com/..." value={settings.social_youtube || ""} onChange={(e) => setSettings({ ...settings, social_youtube: e.target.value })} />
              <Button onClick={handleSave} loading={saving} className="shimmer-btn">Save Changes</Button>
            </div>
          </TabPanel>

          <TabPanel value="ai" activeTab={activeTab}>
            <div className="space-y-4 max-w-2xl">
              <div className="p-4 bg-muted rounded-lg mb-2">
                <p className="text-sm font-medium mb-1">OpenRouter AI Configuration</p>
                <p className="text-xs text-foreground-secondary">Configure AI features like the customer chat widget and admin copilot. Environment variables take precedence over values set here.</p>
              </div>
              <Input
                label="OpenRouter API Key"
                type="password"
                placeholder="sk-or-v1-..."
                value={settings.openrouter_api_key || ""}
                onChange={(e) => setSettings({ ...settings, openrouter_api_key: e.target.value })}
              />
              <Input
                label="AI Model"
                placeholder="openai/gpt-4o"
                value={settings.openrouter_model || ""}
                onChange={(e) => setSettings({ ...settings, openrouter_model: e.target.value })}
              />
              <p className="text-xs text-foreground-secondary">Model options: <code className="bg-muted px-1 rounded">openai/gpt-4o</code>, <code className="bg-muted px-1 rounded">anthropic/claude-3.5-sonnet</code>, <code className="bg-muted px-1 rounded">google/gemini-pro</code>, <code className="bg-muted px-1 rounded">meta-llama/llama-3-70b</code></p>
              <Button onClick={handleSave} loading={saving} className="shimmer-btn">Save Changes</Button>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
}
