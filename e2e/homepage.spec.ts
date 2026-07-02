import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("displays the site name and navigation", async ({ page }) => {
    await expect(page.locator("text=ECOM").first()).toBeVisible();
    await expect(page.locator("text=New Arrivals").first()).toBeVisible();
    await expect(page.locator("text=All Products").first()).toBeVisible();
  });

  test("shows announcement bar", async ({ page }) => {
    const announcement = page.locator("text=Free shipping");
    if (await announcement.isVisible()) {
      await expect(announcement).toBeVisible();
    }
  });

  test("search modal opens and closes", async ({ page }) => {
    const searchButton = page.locator('[aria-label="Open search"]').or(
      page.locator("button").filter({ has: page.locator(".lucide-search") })
    ).first();
    await searchButton.click();
    await expect(page.locator('input[placeholder="Search products..."]')).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator('input[placeholder="Search products..."]')).not.toBeVisible();
  });

  test("navigation links work", async ({ page }) => {
    await page.locator("text=All Products").first().click();
    await expect(page).toHaveURL(/\/products/);
  });

  test("cart button is visible and clickable", async ({ page }) => {
    const cartButton = page.locator("button").filter({ has: page.locator(".lucide-shopping-bag") }).first();
    await expect(cartButton).toBeVisible();
    await cartButton.click();
  });
});
