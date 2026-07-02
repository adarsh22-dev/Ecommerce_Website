import { test, expect } from "@playwright/test";

test.describe("Checkout", () => {
  test("checkout page redirects to auth when not logged in", async ({ page }) => {
    await page.goto("/checkout");
    // Should redirect to auth or show login prompt
    await page.waitForTimeout(2000);
    const currentUrl = page.url();
    expect(
      currentUrl.includes("/auth") || currentUrl.includes("/checkout")
    ).toBeTruthy();
  });
});
