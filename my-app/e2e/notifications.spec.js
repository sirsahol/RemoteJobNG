import { test, expect } from '@playwright/test';

test.describe('Notifications Protocol', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(/\/users\/me\//, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          username: 'testuser',
          role: 'job_seeker'
        }),
      });
    });

    await page.route(/\/notifications\//, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.addInitScript(() => {
      window.localStorage.setItem('user', JSON.stringify({
        id: 1,
        username: 'testuser',
        role: 'job_seeker'
      }));
      window.localStorage.setItem('token', 'MOCK_TOKEN');
    });
  });

  test('should display notifications and allow setting job alerts', async ({ page }) => {
    await page.goto('/notifications');
    await expect(page.getByText(/Intelligence Stream/i)).toBeVisible();
    
    // Check if Job Alert section is visible
    await expect(page.getByText(/Deployment Triggers/i)).toBeVisible();
    
    // Open the form if it's not visible
    const configureBtn = page.getByRole('button', { name: /\+ Configure Alert/i });
    if (await configureBtn.isVisible()) {
      await configureBtn.click();
    }

    // Fill the form (standardized Input and Button)
    await page.getByPlaceholder(/React, Rust, AWS, Architecture/i).fill('Rust, AWS, Next.js');
    await page.getByRole('button', { name: /Deploy Intelligence Trigger/i }).click();
  });
});
