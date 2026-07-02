"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/storefront/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ProductWithDetails, Category } from "@/lib/types";

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Best Selling", value: "best-selling" },
  { label: "Rating", value: "rating" },
];

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="card overflow-hidden">
          <Skeleton className="aspect-[3/4] w-full rounded-none" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [priceRange, setPriceRange] = useState({ min: searchParams.get("minPrice") || "", max: searchParams.get("maxPrice") || "" });
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { getProducts, getCategories: fetchCategories } = await import("@/lib/services/products");

      const filters: Record<string, unknown> = { sort, limit: 50 };
      if (selectedCategory) filters.category = selectedCategory;
      if (priceRange.min) filters.minPrice = Number(priceRange.min);
      if (priceRange.max) filters.maxPrice = Number(priceRange.max);
      if (search) filters.search = search;

      const [productsResult, categoriesResult] = await Promise.allSettled([
        getProducts(filters as any),
        fetchCategories(),
      ]);

      if (productsResult.status === "fulfilled") {
        setProducts(productsResult.value.products as ProductWithDetails[]);
        setTotalCount(productsResult.value.total);
      }
      if (categoriesResult.status === "fulfilled") {
        setCategories(categoriesResult.value);
      }
    } catch {
      // Failed to fetch
    } finally {
      setLoading(false);
    }
  }, [sort, selectedCategory, priceRange.min, priceRange.max, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateURL = useCallback(
    (params: Record<string, string>) => {
      const newParams = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          newParams.set(key, value);
        } else {
          newParams.delete(key);
        }
      });
      router.push(`/products?${newParams.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  useEffect(() => {
    setSort(searchParams.get("sort") || "newest");
    setSelectedCategory(searchParams.get("category") || "");
    setPriceRange({
      min: searchParams.get("minPrice") || "",
      max: searchParams.get("maxPrice") || "",
    });
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  const clearFilters = () => {
    setSelectedCategory("");
    setPriceRange({ min: "", max: "" });
    setSearch("");
    router.push("/products", { scroll: false });
  };

  const activeFilters: string[] = [];
  if (selectedCategory) {
    const cat = categories.find((c) => c.id === selectedCategory || c.slug === selectedCategory);
    activeFilters.push(`category:${cat?.name || selectedCategory}`);
  }
  if (priceRange.min) activeFilters.push(`min:$${priceRange.min}`);
  if (priceRange.max) activeFilters.push(`max:$${priceRange.max}`);
  if (search) activeFilters.push(`search:${search}`);

  return (
    <div className="section-padding">
      <div className="container-xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-section-heading text-foreground">
              {selectedCategory
                ? categories.find((c) => c.id === selectedCategory || c.slug === selectedCategory)?.name || "Products"
                : "All Products"}
            </h1>
            <p className="mt-2 text-sm text-foreground-secondary">
              {loading ? "Loading..." : `${totalCount} products`}
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors lg:hidden"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                updateURL({ sort: e.target.value });
              }}
              className="h-10 px-4 pr-8 border border-border rounded-lg text-sm bg-white focus:outline-none focus:border-primary appearance-none"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-foreground-secondary">Active filters:</span>
            {activeFilters.map((filter) => {
              const [type, value] = filter.split(":");
              return (
                <button
                  key={filter}
                  onClick={() => {
                    if (type === "category") { setSelectedCategory(""); updateURL({ category: "" }); }
                    if (type === "min") { setPriceRange((p) => ({ ...p, min: "" })); updateURL({ minPrice: "" }); }
                    if (type === "max") { setPriceRange((p) => ({ ...p, max: "" })); updateURL({ maxPrice: "" }); }
                    if (type === "search") { setSearch(""); updateURL({ search: "" }); }
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-primary/5 text-primary text-xs font-medium rounded-full hover:bg-primary/10 transition-colors"
                >
                  {value}
                  <X className="w-3 h-3" />
                </button>
              );
            })}
            <button
              onClick={clearFilters}
              className="text-xs text-foreground-secondary hover:text-foreground underline"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="flex gap-8">
          {/* Sidebar filters - Desktop */}
          <div className={`${filtersOpen ? "block" : "hidden"} lg:block w-full lg:w-64 flex-shrink-0`}>
            <div className="space-y-8">
              {/* Search */}
              <div>
                <h3 className="text-sm font-medium text-foreground mb-4">Search</h3>
                <Input
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-sm font-medium text-foreground mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category.id}
                        onChange={() => {
                          setSelectedCategory(category.id);
                          updateURL({ category: category.id });
                        }}
                        className="sr-only peer"
                      />
                      <div className="h-4 w-4 rounded-full border-2 border-border peer-checked:border-primary flex items-center justify-center transition-all">
                        {selectedCategory === category.id && (
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <span className="text-sm text-foreground-secondary group-hover:text-foreground transition-colors">
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-sm font-medium text-foreground mb-4">Price Range</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="h-10 w-full px-3 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                  />
                  <span className="text-foreground-secondary">—</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="h-10 w-full px-3 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <Button
                  variant="secondary"
                  className="w-full mt-3"
                  size="sm"
                  onClick={() => {
                    updateURL({
                      minPrice: priceRange.min,
                      maxPrice: priceRange.max,
                    });
                  }}
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <ProductGridSkeleton />
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg font-medium text-foreground mb-2">No products found</p>
                <p className="text-sm text-foreground-secondary mb-6">
                  Try adjusting your filters or search terms
                </p>
                <Button variant="secondary" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {products.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
