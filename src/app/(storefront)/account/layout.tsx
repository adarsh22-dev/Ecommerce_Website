"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Package, MapPin, Heart, Settings, Gift, Gem, LogOut, ChevronRight } from "lucide-react";
import { useAuth } from "@/lib/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate, formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";

const sidebarLinks = [
  { label: "My Account", href: "/account", icon: User },
  { label: "Orders", href: "/account/orders", icon: Package },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Gift Cards", href: "/account/gift-cards", icon: Gift },
  { label: "Loyalty Rewards", href: "/account/loyalty", icon: Gem },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Settings", href: "/account/settings", icon: Settings },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, profile, signOut, refreshProfile } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile?.full_name || "");

  if (!user) {
    return (
      <div className="section-padding">
        <div className="container-xl max-w-2xl text-center">
          <User className="w-16 h-16 text-foreground-secondary/20 mx-auto mb-6" />
          <h1 className="font-serif text-section-heading text-foreground mb-4">My Account</h1>
          <p className="text-foreground-secondary mb-8">Please sign in to view your account.</p>
          <Link href="/auth"><Button className="shimmer-btn" size="lg">Sign In</Button></Link>
        </div>
      </div>
    );
  }

  // If on /account root, show dashboard
  if (pathname === "/account") {
    return (
      <div className="section-padding">
        <div className="container-xl">
          <h1 className="font-serif text-section-heading text-foreground mb-8">My Account</h1>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <nav className="card p-4 space-y-1">
                {sidebarLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? "bg-primary/5 text-primary"
                        : "text-foreground-secondary hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={async () => { await signOut(); router.push("/"); }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-muted transition-colors w-full"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </nav>
            </div>

            {/* Content */}
            <div className="lg:col-span-3 space-y-6">
              <div className="card p-6">
                <h2 className="text-lg font-semibold mb-4">Welcome, {profile?.full_name || "there"}!</h2>
                <p className="text-sm text-foreground-secondary">
                  Manage your account settings, view orders, and update your profile.
                </p>
              </div>

              {/* Profile Card */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold">Profile Information</h3>
                  <button
                    onClick={() => {
                      if (editing) {
                        // Save would go here
                        toast.success("Profile updated!");
                      }
                      setEditing(!editing);
                    }}
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    {editing ? "Save" : "Edit"}
                  </button>
                </div>
                <div className="space-y-4">
                  <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} disabled={!editing} />
                  <Input label="Email" value={user.email || ""} disabled />
                  <Input label="Phone" value={profile?.phone || ""} disabled={!editing} placeholder="Add phone number" />
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold">Quick Actions</h3>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {sidebarLinks.slice(1, 5).map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-primary/20 hover:bg-primary/5 transition-all text-center"
                    >
                      <link.icon className="w-6 h-6 text-foreground-secondary" />
                      <span className="text-sm font-medium">{link.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For sub-routes, render with same layout
  return (
    <div className="section-padding">
      <div className="container-xl">
        <h1 className="font-serif text-section-heading text-foreground mb-8">My Account</h1>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <nav className="card p-4 space-y-1">
              {sidebarLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-primary/5 text-primary"
                      : "text-foreground-secondary hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => { signOut(); router.push("/"); }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-muted transition-colors w-full"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </nav>
          </div>
          <div className="lg:col-span-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
