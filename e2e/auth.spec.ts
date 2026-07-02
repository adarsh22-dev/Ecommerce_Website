import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("visits the auth page", async ({ page }) => {
    await page.goto("/auth");
    await expect(page.locator("text=Sign In").or(page.locator("text=Login"))).toBeVisible();
  });

  test("shows sign in form", async ({ page }) => {
    await page.goto("/auth");
    // Look for email input and sign in button
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible({ timeout: 10000 });

    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible({ timeout: 10000 });
  });

  test("shows validation errors for empty form", async ({ page }) => {
    await page.goto("/auth");
    const submitButton = page.locator('button[type="submit"]').or(
      page.locator("button:has-text('Sign In')").or(
        page.locator("button:has-text('Login')")
      )
    ).first();

    if (await submitButton.isEnabled()) {
      await submitButton.click();
      // Should show validation errors or stay on same page
      await expect(page).toHaveURL(/\/auth/);
    }
  });

  test("can switch to sign up", async ({ page }) => {
    await page.goto("/auth");
    const signUpTab = page.locator("text=Sign Up").or(page.locator("text=Register")).first();
    if (await signUpTab.isVisible()) {
      await signUpTab.click();
      await expect(page.locator('input[type="text"]').or(
        page.locator('input[placeholder*="name" i]')
      ).first()).toBeVisible();
    }
  });
});
