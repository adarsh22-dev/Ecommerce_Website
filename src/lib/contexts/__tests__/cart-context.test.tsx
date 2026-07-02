import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "../cart-context";
import type { ReactNode } from "react";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

const mockProduct = {
  id: "prod-1",
  title: "Test Product",
  slug: "test-product",
  price: 100,
  sale_price: null,
  description: "A test product",
  sku: "TST-001",
  stock_quantity: 10,
  status: "active" as const,
  tags: [],
  category_id: null,
  vendor_id: null,
  sale_start: null,
  sale_end: null,
  track_inventory: true,
  allow_backorders: false,
  meta_title: null,
  meta_description: null,
  og_image_url: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  product_images: [],
  product_options: [],
  product_variants: [],
};

function wrapper({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}

describe("CartContext", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it("starts with an empty cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toEqual([]);
    expect(result.current.itemCount).toBe(0);
    expect(result.current.subtotal).toBe(0);
  });

  it("adds an item to the cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockProduct);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].product.id).toBe("prod-1");
    expect(result.current.items[0].quantity).toBe(1);
    expect(result.current.itemCount).toBe(1);
  });

  it("increases quantity for existing item", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockProduct);
    });

    act(() => {
      result.current.addItem(mockProduct);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.itemCount).toBe(2);
  });

  it("updates item quantity", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockProduct);
    });

    act(() => {
      result.current.updateQuantity("prod-1", 5);
    });

    expect(result.current.items[0].quantity).toBe(5);
    expect(result.current.itemCount).toBe(5);
  });

  it("removes item when quantity is set to 0", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockProduct);
    });

    act(() => {
      result.current.updateQuantity("prod-1", 0);
    });

    expect(result.current.items).toHaveLength(0);
  });

  it("removes an item from the cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockProduct);
    });

    act(() => {
      result.current.removeItem("prod-1");
    });

    expect(result.current.items).toHaveLength(0);
  });

  it("calculates subtotal correctly", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockProduct);
    });

    act(() => {
      result.current.addItem(mockProduct, undefined, 2);
    });

    expect(result.current.subtotal).toBe(300);
  });

  it("clears the cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockProduct);
      result.current.addItem({ ...mockProduct, id: "prod-2" });
    });

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.items).toHaveLength(0);
  });

  it("opens and closes the cart drawer", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.isOpen).toBe(false);

    act(() => {
      result.current.openCart();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.closeCart();
    });
    expect(result.current.isOpen).toBe(false);

    act(() => {
      result.current.toggleCart();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.toggleCart();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it("opens cart when item is added", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockProduct);
    });

    expect(result.current.isOpen).toBe(true);
  });

  it("calculates sale price when available", () => {
    const saleProduct = { ...mockProduct, sale_price: 80 };
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(saleProduct, undefined, 2);
    });

    expect(result.current.subtotal).toBe(160);
  });

  it("persists cart to localStorage", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockProduct);
    });

    const stored = JSON.parse(localStorageMock.getItem("ecom-cart") || "[]");
    expect(stored).toHaveLength(1);
    expect(stored[0].product.id).toBe("prod-1");
  });
});
