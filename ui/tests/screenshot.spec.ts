import { test, expect } from '@playwright/test';

test.describe('UI Screenshot Capture', () => {
  test('should capture screenshots of key pages', async ({ page }) => {
    // Home page
    await page.goto('http://localhost:3000');
    await expect(page.locator('h1')).toContainText('Power your digital life');
    await page.screenshot({ path: 'home.png' });

    // Products page
    await page.getByRole('link', { name: 'All Plans' }).first().click();
    await expect(page.locator('h1')).toContainText('Choose your plan');
    await page.screenshot({ path: 'products.png' });

    // Login page
    await page.getByRole('link', { name: 'Sign In' }).first().click();
    await expect(page.locator('h1')).toContainText('Welcome back');
    await page.screenshot({ path: 'login.png' });

    // Cart page (empty)
    await page.getByRole('link', { name: 'Cart' }).first().click();
    await expect(page.locator('h1')).toContainText('Your cart');
    await page.screenshot({ path: 'cart.png' });
  });
});
