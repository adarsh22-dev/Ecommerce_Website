"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Settings,
  BarChart3,
  Image,
  Search,
  Menu,
  X,
  ChevronLeft,
  FileText,
  Globe,
  Layout,
  Store,
  Building2,
  Shield,
  History,
  LogOut,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useAuth } from "@/lib/contexts/auth-context";

const AdminAICopilot = dynamic(
  () => import("@/components/admin/ai-copilot").then((mod) => mod.AdminAICopilot),
  { ssr: false }
);

type SidebarLink = { label: string; href: string; icon: React.ElementType };
type SidebarDivider = { divider: true; label: string };
type SidebarItem = SidebarLink | SidebarDivider;

const sidebarLinks: SidebarItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Categories", href: "/admin/categories", icon: Tag },
  { label: "Homepage", href: "/admin/homepage", icon: Layout },
  { label: "Coupons", href: "/admin/coupons", icon: FileText },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Media", href: "/admin/media", icon: Image },
  { label: "Settings", href: "/admin/settings", icon: Settings },
  { label: "SEO", href: "/admin/seo", icon: Globe },
  { label: "Vendors", href: "/admin/vendors", icon: Store },
  { label: "Wholesalers", href: "/admin/wholesalers", icon: Building2 },
  { label: "Activity", href: "/admin/activity", icon: History },
  { label: "Super Admin", href: "/admin/super-admin", icon: Shield },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { profile, signOut } = useAuth();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (profile === undefined) return;
    setAuthReady(true);
    if (!profile) {
      router.replace("/auth?redirect=/admin");
    } else if (profile.role !== "admin" && profile.role !== "super_admin") {
      router.replace("/");
    }
  }, [profile, router]);

  if (!authReady || !profile || (profile.role !== "admin" && profile.role !== "super_admin")) {
    return null;
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* Sidebar - Desktop */}
      <aside
        className={`hidden lg:flex flex-col bg-white border-r border-border transition-all duration-300 ${
          collapsed ? "w-[72px]" : "w-64"
        }`}
      >
        <div className={`flex items-center h-16 px-4 border-b border-border ${collapsed ? "justify-center" : "justify-between"}`}>
          <Link href="/admin" className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-black text-white">A</span>
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground leading-tight truncate">Admin</p>
                <p className="text-[10px] text-foreground-secondary/60 leading-tight truncate">Control Panel</p>
              </div>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 admin-sidebar-scroll">
          {sidebarLinks.map((item, idx) => {
            if ("divider" in item && item.divider) {
              return (
                <div key={`divider-${idx}`} className="pt-4 pb-1 px-3">
                  {!collapsed ? (
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-foreground-secondary/60">
                      {item.label}
                    </p>
                  ) : (
                    <div className="border-t border-border mx-1" />
                  )}
                </div>
              );
            }
            const link = item as SidebarLink;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? "bg-primary/5 text-primary admin-sidebar-link active"
                    : "text-foreground-secondary hover:bg-muted hover:text-foreground"
                }`}
                title={collapsed ? link.label : undefined}
              >
                <link.icon className={`w-5 h-5 flex-shrink-0 ${isActive(link.href) ? "text-primary" : ""}`} />
                {!collapsed && <span className="truncate">{link.label}</span>}
                {isActive(link.href) && !collapsed && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border">
          <Link
            href="/"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground-secondary hover:bg-muted hover:text-foreground transition-all duration-200 ${
              collapsed ? "justify-center" : ""
            }`}
            title="View Store"
          >
            <Globe className="w-5 h-5 flex-shrink-0" />
          </Link>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between h-16 px-5 border-b border-border">
                <span className="font-serif text-xl font-bold tracking-tight">Admin</span>
                <button onClick={() => setMobileOpen(false)} className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="p-4 space-y-1 admin-sidebar-scroll" style={{ height: "calc(100% - 4rem)" }}>
                {sidebarLinks.map((item, idx) => {
                  if ("divider" in item && item.divider) {
                    return (
                      <div key={`divider-${idx}`} className="pt-4 pb-1 px-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-foreground-secondary/60">
                          {item.label}
                        </p>
                      </div>
                    );
                  }
                  const link = item as SidebarLink;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive(link.href) ? "bg-primary/5 text-primary admin-sidebar-link active" : "text-foreground-secondary hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <link.icon className={`w-5 h-5 ${isActive(link.href) ? "text-primary" : ""}`} />
                      <span>{link.label}</span>
                      {isActive(link.href) && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                      )}
                    </Link>
                  );
                })}
                <div className="pt-4 mt-4 border-t border-border">
                  <Link
                    href="/"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground-secondary hover:bg-muted hover:text-foreground transition-all duration-200"
                  >
                    <Globe className="w-5 h-5" />
                    <span>View Store</span>
                  </Link>
                </div>
              </nav>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white/95 backdrop-blur-sm border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/admin" className="hidden sm:flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                <span className="text-[10px] font-black text-primary">A</span>
              </div>
              <span className="text-sm font-semibold text-foreground">Admin</span>
            </Link>
            <div className="hidden sm:block w-px h-5 bg-border" />
            <div className="flex items-center gap-2 bg-muted/70 rounded-lg px-3 py-2 w-48 sm:w-64 focus-within:bg-muted focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <Search className="w-4 h-4 text-foreground-secondary flex-shrink-0" />
              <input
                type="text"
                placeholder="Search anything..."
                className="bg-transparent text-sm outline-none w-full placeholder:text-foreground-secondary/40"
              />
              <span className="hidden lg:inline-flex text-[10px] font-medium text-foreground-secondary">
                Search
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-muted transition-colors"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-foreground leading-tight">{profile?.full_name || "Admin"}</p>
                  <p className="text-xs text-foreground-secondary capitalize">{profile?.role === "admin" ? "Administrator" : profile?.role || "User"}</p>
                </div>
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary ring-2 ring-primary/5">
                  {(profile?.full_name?.[0] || profile?.email?.[0] || "A").toUpperCase()}
                </div>
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-border py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-medium text-foreground">{profile?.full_name || "Admin"}</p>
                      <p className="text-xs text-foreground-secondary truncate">{profile?.email || ""}</p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => { setProfileOpen(false); router.push("/admin/settings"); }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <Settings className="w-4 h-4 text-foreground-secondary" />
                        Settings
                      </button>
                      <button
                        onClick={() => { setProfileOpen(false); router.push("/"); }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <Globe className="w-4 h-4 text-foreground-secondary" />
                        View Store
                      </button>
                    </div>
                    <div className="border-t border-border py-1">
                      <button
                        onClick={async () => {
                          setProfileOpen(false);
                          await signOut();
                          router.push("/auth");
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-destructive hover:bg-destructive/5 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">{children}</main>
      </div>
      <AdminAICopilot />
    </div>
  );
}
