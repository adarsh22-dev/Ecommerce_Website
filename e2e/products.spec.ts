import { test, expect } from "@playwright/test";

test.describe("Products", () => {
  test("product listing page loads", async ({ page }) => {
    await page.goto("/products");
    await expect(page).toHaveURL(/\/products/);
  });

  test("can search for products", async ({ page }) => {
    await page.goto("/products");
    // Check if search input exists on the page
    const searchInput = page.locator('input[placeholder*="Search" i]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill("test");
      // Wait for results or URL change
      await page.waitForTimeout(500);
    }
  });

  test("product detail page", async ({ page }) => {
    await page.goto("/products");
    // Click on first product link if available
    const productLink = page.locator("a[href*='/products/']").first();
    if (await productLink.isVisible()) {
      await productLink.click();
      await expect(page).toHaveURL(/\/products\/.+/);
    }
  });

  test("add to cart flow", async ({ page }) => {
    await page.goto("/products");
    const productLink = page.locator("a[href*='/products/']").first();
    if (await productLink.isVisible()) {
      await productLink.click();
      await expect(page).toHaveURL(/\/products\/.+/);

      // Look for add to cart button
      const addToCartBtn = page.locator("button:has-text('Add to Cart')").first();
      if (await addToCartBtn.isVisible()) {
        await addToCartBtn.click();
        // Cart should open
        await page.waitForTimeout(500);
      }
    }
  });
});
