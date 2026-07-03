"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Wallet, Store, LogOut } from "lucide-react";
import { useAuth } from "@/lib/contexts/auth-context";
import { Button } from "@/components/ui/button";

const sidebarLinks = [
  { label: "Dashboard", href: "/vendor", icon: LayoutDashboard },
  { label: "Products", href: "/vendor/products", icon: Package },
  { label: "Orders", href: "/vendor/orders", icon: ShoppingCart },
  { label: "Wallet", href: "/vendor/wallet", icon: Wallet },
];

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, profile, signOut } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <div className="section-padding">
        <div className="container-xl max-w-2xl text-center">
          <Store className="w-16 h-16 text-foreground-secondary/20 mx-auto mb-6" />
          <h1 className="font-serif text-section-heading text-foreground mb-4">Vendor Portal</h1>
          <p className="text-foreground-secondary mb-8">Please sign in to access your vendor dashboard.</p>
          <Link href="/auth"><Button className="shimmer-btn" size="lg">Sign In</Button></Link>
        </div>
      </div>
    );
  }

  if (profile?.role !== "vendor" && profile?.role !== "admin" && profile?.role !== "super_admin") {
    return (
      <div className="section-padding">
        <div className="container-xl max-w-2xl text-center">
          <Store className="w-16 h-16 text-foreground-secondary/20 mx-auto mb-6" />
          <h1 className="font-serif text-section-heading text-foreground mb-4">Access Restricted</h1>
          <p className="text-foreground-secondary mb-8">This area is for vendors only. If you are a vendor, please contact the admin to set up your account.</p>
          <Link href="/"><Button variant="secondary">Go Home</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="container-xl">
        <div className="flex items-center gap-3 mb-8">
          <Store className="w-6 h-6 text-primary" />
          <div>
            <h1 className="font-serif text-section-heading text-foreground">Vendor Portal</h1>
            <p className="text-sm text-foreground-secondary">Welcome, {profile?.full_name || "Vendor"}</p>
          </div>
        </div>
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