import { test, expect } from '@playwright/test';

test.describe('Frontend Pages', () => {
  test('home page should load and display content', async ({ page }) => {
    await page.goto('/');
    
    // Check title
    await expect(page.locator('h1')).toContainText('Crypto Bros Platform');
    
    // Check that all main cards are present
    await expect(page.getByRole('link', { name: /Documentation/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Simple Demo/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Full Demo/ })).toBeVisible();
  });

  test('home page links should be clickable', async ({ page }) => {
    await page.goto('/');
    
    // Test demo link
    const demoLink = page.getByRole('link', { name: /Simple Demo/i });
    await expect(demoLink).toBeVisible();
    
    // Test demo-full link
    const demoFullLink = page.getByRole('link', { name: /Full Demo/i });
    await expect(demoFullLink).toBeVisible();
    
    // Test docs link
    const docsLink = page.getByRole('link', { name: /Documentation/i });
    await expect(docsLink).toBeVisible();
  });

  test('demo page should load', async ({ page }) => {
    await page.goto('/demo');
    
    await expect(page.locator('h1')).toContainText('Easy Risk Tracker Demo');
    await expect(page.getByText('Project Fetch')).toBeVisible();
  });

  test('demo-full page should load', async ({ page }) => {
    await page.goto('/demo-full');
    
    await expect(page.locator('h1')).toContainText('Full Project Dashboard');
  });

  test('login page should load', async ({ page }) => {
    await page.goto('/login');
    
    await expect(page.locator('h1')).toContainText('Demo Full Access');
    await expect(page.locator('input[placeholder="name@example.com"]')).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
  });

  test('404 page should show for invalid routes', async ({ page }) => {
    await page.goto('/invalid-route-that-does-not-exist');
    
    await expect(page.locator('h1')).toContainText('404');
    await expect(page.getByText('Page not found')).toBeVisible();
  });
});
