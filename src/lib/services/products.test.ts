import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getCategories, getProducts, importCsvRecords } from "./products";

describe("CSV import fallback", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("persists imported categories and returns them from getCategories", async () => {
    const result = await importCsvRecords("categories", [{
      name: "Accessories",
      slug: "accessories",
      description: "Imported accessories",
    }]);

    expect(result.successCount).toBe(1);

    const categories = await getCategories();
    expect(categories.some((category) => category.name === "Accessories")).toBe(true);
  });

  it("includes imported products in getProducts results", async () => {
    const result = await importCsvRecords("products", [{
      title: "Imported Lamp",
      slug: "imported-lamp",
      price: 80,
      sku: "SKU-100",
      stock_quantity: 10,
    }]);

    expect(result.successCount).toBe(1);

    const { products } = await getProducts();
    expect(products.some((product: { title: string }) => product.title === "Imported Lamp")).toBe(true);
  });
});
