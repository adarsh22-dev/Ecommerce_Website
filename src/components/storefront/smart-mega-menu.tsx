"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, ChevronLeft } from "lucide-react";
import type { Category } from "@/lib/types";

interface SmartMegaMenuProps {
  onNavClick?: () => void;
}

interface CategoryNode {
  category: Category;
  children: CategoryNode[];
  depth: number;
}

function buildTree(categories: Category[]): CategoryNode[] {
  const map = new Map<string, CategoryNode>();
  const roots: CategoryNode[] = [];

  for (const cat of categories) {
    map.set(cat.id, { category: cat, children: [], depth: 0 });
  }

  for (const cat of categories) {
    const node = map.get(cat.id)!;
    if (cat.parent_id && map.has(cat.parent_id)) {
      const parent = map.get(cat.parent_id)!;
      parent.children.push(node);
      node.depth = parent.depth + 1;
    } else if (!cat.parent_id) {
      roots.push(node);
    }
  }

  const sortByOrder = (nodes: CategoryNode[]) =>
    nodes.sort((a, b) => a.category.sort_order - b.category.sort_order);

  sortByOrder(roots);
  for (const root of roots) {
    sortByOrder(root.children);
    for (const child of root.children) {
      sortByOrder(child.children);
    }
  }

  return roots;
}

function MobileCategoryNav({
  tree,
  onNavClick,
}: {
  tree: CategoryNode[];
  onNavClick?: () => void;
}) {
  const [stack, setStack] = useState<{ title: string; nodes: CategoryNode[] }[]>([
    { title: "Categories", nodes: tree },
  ]);

  const current = stack[stack.length - 1];
  const isRoot = stack.length === 1;

  const pushLevel = (title: string, nodes: CategoryNode[]) => {
    setStack((prev) => [...prev, { title, nodes }]);
  };

  const popLevel = () => {
    if (stack.length > 1) {
      setStack((prev) => prev.slice(0, -1));
    }
  };

  return (
    <div>
      {/* Mobile breadcrumb */}
      {!isRoot && (
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/30">
          <button
            onClick={popLevel}
            className="p-1 -ml-1 text-foreground-secondary hover:text-foreground rounded transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1 text-xs text-foreground-secondary/60 overflow-x-auto whitespace-nowrap">
            {stack.slice(0, -1).map((level, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <span className="mx-0.5 text-foreground-secondary/30">&gt;</span>}
                <button
                  onClick={() => {
                    setStack((prev) => prev.slice(0, i + 1));
                  }}
                  className="hover:text-foreground transition-colors"
                >
                  {level.title}
                </button>
              </span>
            ))}
            <span className="mx-0.5 text-foreground-secondary/30">&gt;</span>
            <span className="font-medium text-foreground/80">{current.title}</span>
          </div>
        </div>
      )}

      <ul className="pb-2 space-y-0.5 pt-1">
        {current.nodes.map((node) => {
          const hasChildren = node.children.length > 0;
          return (
            <li key={node.category.id}>
              <Link
                href={hasChildren ? "#" : `/products?category=${node.category.slug}`}
                onClick={(e) => {
                  if (hasChildren) {
                    e.preventDefault();
                    pushLevel(node.category.name, node.children);
                  } else {
                    onNavClick?.();
                  }
                }}
                className="flex items-center justify-between px-4 py-2.5 rounded-lg text-sm transition-colors hover:bg-muted"
              >
                <span className="text-foreground">{node.category.name}</span>
                {hasChildren ? (
                  <ChevronRight className="w-4 h-4 text-foreground-secondary/40 flex-shrink-0" />
                ) : (
                  <span className="text-[10px] text-foreground-secondary/40">Shop</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function SmartMegaMenu({ onNavClick }: SmartMegaMenuProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [activeL1, setActiveL1] = useState<string | null>(null);
  const [activeL2, setActiveL2] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { getCategories } = await import("@/lib/services/products");
        const data = await getCategories();
        setCategories(data || []);
      } catch {
        // Fallback silently
      }
    }
    fetchCategories();
  }, []);

  const tree = buildTree(categories);

  const getL2Children = (l1Id: string) => {
    const l1 = tree.find((n) => n.category.id === l1Id);
    return l1?.children || [];
  };

  const getL3Children = (l1Id: string, l2Id: string) => {
    const l2s = getL2Children(l1Id);
    const l2 = l2s.find((n) => n.category.id === l2Id);
    return l2?.children || [];
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpenDropdown(false);
        setActiveL1(null);
        setActiveL2(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      if (activeL2) {
        setActiveL2(null);
      } else if (activeL1) {
        setActiveL1(null);
      } else {
        setOpenDropdown(false);
        triggerRef.current?.focus();
      }
    }
  };

  const closeMenu = () => {
    setOpenDropdown(false);
    setActiveL1(null);
    setActiveL2(null);
  };

  const handleL1Hover = (id: string | null) => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    if (id) {
      setActiveL1(id);
      setActiveL2(null);
    }
  };

  const handleL2Hover = (id: string | null) => {
    if (id) {
      setActiveL2(id);
    } else {
      setActiveL2(null);
    }
  };

  const shopLinks = [
    { label: "All Products", href: "/products" },
    { label: "New Arrivals", href: "/products?sort=newest" },
  ];

  const otherLinks = [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const activeL1Node = tree.find((n) => n.category.id === activeL1);
  const activeL2Children = activeL1 ? getL2Children(activeL1) : [];
  const activeL3Children =
    activeL1 && activeL2
      ? getL3Children(activeL1, activeL2)
      : [];

  return (
    <>
      {/* Desktop Trigger */}
      <div className="hidden lg:flex items-center gap-12">
        <button
          ref={triggerRef}
          onMouseEnter={() => setOpenDropdown(true)}
          onClick={() => setOpenDropdown(!openDropdown)}
          onKeyDown={handleKeyDown}
          className="text-sm font-medium text-foreground-secondary hover:text-foreground transition-colors relative group flex items-center gap-1"
          aria-expanded={openDropdown}
          aria-haspopup="true"
        >
          Shop
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              openDropdown ? "rotate-180" : ""
            }`}
          />
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
        </button>

        {shopLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm font-medium text-foreground-secondary hover:text-foreground transition-colors relative group"
          >
            {link.label}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
          </Link>
        ))}

        <div className="w-px h-4 bg-border" />

        {otherLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm font-medium text-foreground-secondary hover:text-foreground transition-colors relative group"
          >
            {link.label}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
          </Link>
        ))}
      </div>

      {/* Desktop Mega Menu — Breadcrumb + cascading L1 > L2 > L3 */}
      <AnimatePresence>
        {openDropdown && (
          <div
            ref={dropdownRef}
            onMouseEnter={() => setOpenDropdown(true)}
            onMouseLeave={() => {
              closeTimeoutRef.current = setTimeout(() => {
                setOpenDropdown(false);
                setActiveL1(null);
                setActiveL2(null);
              }, 150);
            }}
            onKeyDown={handleKeyDown}
            className="absolute left-0 top-full w-full z-50 hidden lg:block"
          >
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="bg-white border-b border-border shadow-lg"
            >
              {/* Breadcrumb trail */}
              <div className="border-b border-border bg-muted/40">
                <div className="container-xl py-2">
                  <nav className="flex items-center gap-1.5 text-xs text-foreground-secondary/60">
                    <span className="font-medium text-foreground/80">All Categories</span>
                    {activeL1 && (
                      <>
                        <span className="text-foreground-secondary/30">&gt;</span>
                        <span className={activeL2 ? "text-foreground-secondary/60" : "font-medium text-foreground/80"}>
                          {activeL1Node?.category.name}
                        </span>
                      </>
                    )}
                    {activeL2 && (
                      <>
                        <span className="text-foreground-secondary/30">&gt;</span>
                        <span className="font-medium text-foreground/80">
                          {activeL2Children.find((n) => n.category.id === activeL2)?.category.name}
                        </span>
                      </>
                    )}
                  </nav>
                </div>
              </div>

              <div className="container-xl py-8">
                {/* Roadmap Grid: each L1 = column, L2 = bold sub-heading, L3 = links */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                  {tree.slice(0, 10).map((l1) => (
                    <div key={l1.category.id} className="min-w-0">
                      {/* L1 — Domain category (column header) */}
                      <div className="mb-4 pb-3 border-b border-border/50">
                        <Link
                          href={`/products?category=${l1.category.slug}`}
                          onClick={closeMenu}
                          className="block text-sm font-bold text-foreground hover:text-primary transition-colors"
                        >
                          {l1.category.name}
                        </Link>
                      </div>
                      {/* L2 + L3 — Sub-categories and their children */}
                      {l1.children.length > 0 && (
                        <ul className="space-y-4">
                          {l1.children.slice(0, 5).map((l2) => (
                            <li key={l2.category.id}>
                              {/* L2 — Sub-heading (bold, uppercase) */}
                              <Link
                                href={`/products?category=${l2.category.slug}`}
                                onClick={closeMenu}
                                className="block text-[11px] font-semibold text-foreground-secondary/80 uppercase tracking-wider hover:text-foreground transition-colors mb-1.5"
                              >
                                {l2.category.name}
                              </Link>
                              {/* L3 — Deep links */}
                              {l2.children.length > 0 && (
                                <ul className="space-y-1">
                                  {l2.children.slice(0, 5).map((l3) => (
                                    <li key={l3.category.id}>
                                      <Link
                                        href={`/products?category=${l3.category.slug}`}
                                        onClick={closeMenu}
                                        className="block text-xs text-foreground-secondary/60 hover:text-foreground transition-colors pl-2 border-l border-border/30 hover:border-primary/50"
                                      >
                                        {l3.category.name}
                                      </Link>
                                    </li>
                                  ))}
                                  {l2.children.length > 5 && (
                                    <li>
                                      <Link
                                        href={`/products?category=${l2.category.slug}`}
                                        onClick={closeMenu}
                                        className="text-xs text-primary/70 hover:text-primary transition-colors pl-2"
                                      >
                                        +{l2.children.length - 5} more
                                      </Link>
                                    </li>
                                  )}
                                </ul>
                              )}
                            </li>
                          ))}
                          {l1.children.length > 5 && (
                            <li>
                              <Link
                                href={`/products?category=${l1.category.slug}`}
                                onClick={closeMenu}
                                className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                              >
                                View all {l1.children.length} subcategories &rarr;
                              </Link>
                            </li>
                          )}
                        </ul>
                      )}
                      {l1.children.length === 0 && (
                        <p className="text-xs text-foreground-secondary/40 italic">No subcategories</p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Bottom links */}
                <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <Link
                      href="/products?sort=newest"
                      onClick={closeMenu}
                      className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      View New Arrivals &rarr;
                    </Link>
                    <Link
                      href="/products"
                      onClick={closeMenu}
                      className="text-sm font-medium text-foreground-secondary hover:text-foreground transition-colors"
                    >
                      Browse All Products &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile — Nested drill-down with breadcrumb L1 > L2 > L3 */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileExpanded(!mobileExpanded)}
          className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
        >
          <span>Parts & Categories</span>
          <ChevronRight
            className={`w-4 h-4 transition-transform duration-200 ${
              mobileExpanded ? "rotate-90" : ""
            }`}
          />
        </button>
        <AnimatePresence>
          {mobileExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <MobileCategoryNav
                tree={tree}
                onNavClick={onNavClick}
              />
              <div className="pb-2 space-y-1 border-t border-border mt-1">
                <Link
                  href="/products?sort=newest"
                  onClick={() => onNavClick?.()}
                  className="block px-4 py-2.5 text-sm font-medium text-primary hover:bg-muted rounded-lg transition-colors"
                >
                  New Arrivals
                </Link>
                <Link
                  href="/products"
                  onClick={() => onNavClick?.()}
                  className="block px-4 py-2.5 text-sm font-medium text-primary hover:bg-muted rounded-lg transition-colors"
                >
                  All Products
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
