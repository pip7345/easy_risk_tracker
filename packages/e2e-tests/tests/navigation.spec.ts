import { test, expect } from '@playwright/test';

test.describe('Navigation and Links', () => {
  test('navigate from home to demo page', async ({ page }) => {
    await page.goto('/');
    
    // Click on Simple Demo
    await page.getByRole('link', { name: /Simple Demo/i }).click();
    
    // Wait for navigation
    await page.waitForURL('**/demo');
    
    // Verify we're on the demo page
    await expect(page.locator('h1')).toContainText('Easy Risk Tracker Demo');
  });

  test('navigate from home to demo-full page', async ({ page }) => {
    await page.goto('/');
    
    // Click on Full Demo
    await page.getByRole('link', { name: /Full Demo/i }).click();
    
    // Wait for navigation
    await page.waitForURL('**/demo-full');
    
    // Verify we're on the demo-full page
    await expect(page.locator('h1')).toContainText('Full Project Dashboard');
  });

  test('navigate from home to login page via demo-full', async ({ page }) => {
    await page.goto('/');
    
    // Click on Full Demo
    await page.getByRole('link', { name: /Full Demo/i }).click();
    await page.waitForURL('**/demo-full');
    
    // If there's a login required, it should redirect or show login option
    // This test verifies the page loads without errors
    await expect(page.locator('h1')).toBeVisible();
  });

  test('404 page has working home link', async ({ page }) => {
    await page.goto('/invalid-route');
    
    // Find and click the "Go Home" link
    await page.getByRole('link', { name: /Go Home/i }).click();
    
    // Should navigate back to home
    await page.waitForURL('/');
    await expect(page.locator('h1')).toContainText('Crypto Bros Platform');
  });

  test('browser back button works', async ({ page }) => {
    // Start at home
    await page.goto('/');
    
    // Navigate to demo
    await page.getByRole('link', { name: /Simple Demo/i }).click();
    await page.waitForURL('**/demo');
    
    // Go back
    await page.goBack();
    
    // Should be back at home
    await expect(page.locator('h1')).toContainText('Crypto Bros Platform');
  });
});
