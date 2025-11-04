import { test, expect } from "@playwright/test";

test("home page renders hero and plans", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Power your digital life/i })).toBeVisible();
  const planSection = page.getByRole("heading", { name: /Popular plans/i });
  await expect(planSection).toBeVisible();
});
