"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, User, Menu, X, Heart } from "lucide-react";
import { useCart } from "@/lib/contexts/cart-context";
import { useAuth } from "@/lib/contexts/auth-context";
import { cn } from "@/lib/utils";
import { SmartMegaMenu } from "@/components/storefront/smart-mega-menu";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { itemCount, openCart } = useCart();
  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
        className={cn(
          "sticky top-0 z-40 transition-all duration-300",
          scrolled
            ? "bg-white/90 backdrop-blur-xl border-b border-border shadow-sm h-[60px]"
            : "bg-white h-[80px]"
        )}
      >
        <div className="container-xl h-full flex items-center justify-between">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 -ml-2 text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-xl lg:text-2xl font-bold tracking-tight text-foreground">
              ECOM
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8 relative">
            <SmartMegaMenu />
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2.5 text-foreground-secondary hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link
              href="/account/wishlist"
              className="hidden sm:flex p-2.5 text-foreground-secondary hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* Account */}
            {user ? (
              <div className="relative group">
                <Link
                  href="/account"
                  className="p-2.5 text-foreground-secondary hover:text-foreground hover:bg-muted rounded-lg transition-colors flex items-center gap-2"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline text-sm font-medium">
                    {profile?.full_name?.split(" ")[0] || "Account"}
                  </span>
                </Link>
                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-white rounded-xl shadow-lg border border-border py-2 min-w-[180px]">
        <Link href="/account" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
          My Account
        </Link>
        <Link href="/account/orders" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
          Orders
        </Link>
        {profile?.role === "admin" || profile?.role === "super_admin" ? (
          <Link href="/admin" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
            Admin Panel
          </Link>
        ) : profile?.role === "vendor" ? (
          <Link href="/vendor" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
            Vendor Dashboard
          </Link>
        ) : null}
                    <hr className="my-1 border-border" />
                    <button
                      onClick={signOut}
                      className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/auth"
                className="p-2.5 text-foreground-secondary hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                <User className="w-5 h-5" />
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative p-2.5 text-foreground-secondary hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-primary text-[10px] font-bold text-white flex items-center justify-center"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute left-0 top-0 h-full w-[300px] bg-white shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <span className="font-serif text-xl font-bold">ECOM</span>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-muted rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="space-y-1">
                  <SmartMegaMenu onNavClick={() => setMobileMenuOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Link
                      href="/about"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
                    >
                      About
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <Link
                      href="/contact"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
                    >
                      Contact
                    </Link>
                  </motion.div>
                </nav>
                <hr className="my-6 border-border" />
                <div className="space-y-1">
                  <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium hover:bg-muted rounded-lg transition-colors">
                    My Account
                  </Link>
                  <Link href="/account/wishlist" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium hover:bg-muted rounded-lg transition-colors">
                    Wishlist
                  </Link>
                  <Link href="/account/orders" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium hover:bg-muted rounded-lg transition-colors">
                    Orders
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}

function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ecom-recent-searches");
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setSelectedIndex(-1);
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { getProducts } = await import("@/lib/services/products");
        const data = await getProducts({ search: query, limit: 6 });
        setResults(data.products || []);
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const saveSearch = (term: string) => {
    if (!term.trim()) return;
    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem("ecom-recent-searches", JSON.stringify(updated));
    } catch {}
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem("ecom-recent-searches");
    } catch {}
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = query.trim() ? results : [];
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          const product = items[selectedIndex];
          saveSearch(query);
          window.location.href = `/products/${product.slug}`;
        }
        break;
      case "Escape":
        onClose();
        break;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative mx-auto mt-[10vh] w-full max-w-2xl px-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
                <Search className="w-5 h-5 text-foreground-secondary flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search products..."
                  className="flex-1 text-lg outline-none bg-transparent placeholder:text-foreground-secondary/50"
                  autoFocus
                />
                <button onClick={onClose} className="text-foreground-secondary hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="max-h-[400px] overflow-y-auto p-4">
                {/* Recent Searches */}
                {!query && recentSearches.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-foreground-secondary uppercase tracking-wider">
                        Recent Searches
                      </span>
                      <button
                        onClick={clearRecentSearches}
                        className="text-xs text-foreground-secondary hover:text-foreground transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="px-3 py-1.5 bg-muted rounded-full text-xs text-foreground-secondary hover:text-foreground hover:bg-muted/80 transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {!query && recentSearches.length === 0 && (
                  <div className="text-center py-8 text-sm text-foreground-secondary">
                    Start typing to search products
                  </div>
                )}

                {loading && (
                  <div className="text-center py-8 text-sm text-foreground-secondary">
                    Searching...
                  </div>
                )}
                {!loading && query && results.length === 0 && (
                  <div className="text-center py-8 text-sm text-foreground-secondary">
                    No products found for &ldquo;{query}&rdquo;
                  </div>
                )}
                {results.map((product, index) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    onClick={() => saveSearch(query)}
                    className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${
                      index === selectedIndex ? "bg-primary/5 ring-1 ring-primary/20" : "hover:bg-muted"
                    }`}
                  >
                    <div className="h-12 w-12 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                      {product.product_images?.[0]?.image_url && (
                        <img
                          src={product.product_images[0].image_url}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{product.title}</p>
                      <p className="text-sm text-foreground-secondary">${product.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
