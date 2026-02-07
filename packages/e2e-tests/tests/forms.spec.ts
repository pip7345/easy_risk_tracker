import { test, expect } from '@playwright/test';

test.describe('Form Interactions', () => {
  test('demo page form should be functional', async ({ page }) => {
    await page.goto('/demo');
    
    // Check form elements exist
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
    await expect(page.locator('input[type="text"]').first()).toBeVisible();
    
    // Check buttons
    await expect(page.getByRole('button', { name: /Fetch Project/i })).toBeVisible();
  });

  test('login form should have all fields', async ({ page }) => {
    await page.goto('/login');
    
    // Check all form fields
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
    await expect(page.locator('input[type="password"]').nth(1)).toBeVisible();
    await expect(page.locator('input[type="text"]').first()).toBeVisible();
    
    // Check buttons
    await expect(page.getByRole('button', { name: /Continue to Project/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Use Sample Data/i })).toBeVisible();
  });

  test('login form sample data button should navigate', async ({ page }) => {
    await page.goto('/login');
    
    // Click sample data button
    await page.getByRole('button', { name: /Use Sample Data/i }).click();
    
    // Should navigate to demo-full with sample parameter
    await page.waitForURL('**/demo-full?sample=true');
    await expect(page.locator('h1')).toContainText('Full Project Dashboard');
  });

  test('demo form inputs should accept text', async ({ page }) => {
    await page.goto('/demo');
    
    // Fill in the form
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]').first();
    const projectIdInput = page.locator('input[type="text"]').first();
    
    await emailInput.fill('test@example.com');
    await passwordInput.fill('testpassword');
    await projectIdInput.fill('test-project-id');
    
    // Verify values were entered
    await expect(emailInput).toHaveValue('test@example.com');
    await expect(passwordInput).toHaveValue('testpassword');
    await expect(projectIdInput).toHaveValue('test-project-id');
  });
});
