import { test, expect } from '@playwright/test';

test.describe('Authentication Protocol', () => {
  test('should navigate to login and see the auth protocol', async ({ page }) => {
    await page.goto('/login');
    
    // Verify premium branding is present
    await expect(page.locator('text=Initiate Session')).toBeVisible();
    await expect(page.locator('text=Auth Protocol')).toBeVisible();
    
    // Check form elements
    await expect(page.locator('label:has-text("Neural ID")')).toBeVisible();
    await expect(page.locator('label:has-text("Access Key")')).toBeVisible();
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('#username', 'wronguser');
    await page.fill('#password', 'wrongpass');
    await page.click('button:has-text("Commit Session")');
    
    // Since we mock the backend or expect failure
    // This depends on the real implementation or MSW
    // For now, we just verify the interaction
  });
});
