import { test, expect } from '@playwright/test';

test.describe('Dashboard Ecosystem', () => {
  test.beforeEach(async ({ page, context }) => {
    // Set cookie to bypass middleware
    await context.addCookies([{
      name: 'access_token',
      value: 'MOCK_TOKEN',
      domain: 'localhost',
      path: '/'
    }]);

    // Debug logging
    page.on('console', msg => {
      if (msg.type() === 'error') console.log(`BROWSER ERROR: ${msg.text()}`);
      else console.log(`BROWSER [${msg.type()}]: ${msg.text()}`);
    });
    
    page.on('requestfailed', request => {
      console.log(`REQUEST_FAILED: ${request.url()} - ${request.failure()?.errorText}`);
    });

    // Global Catch-all mock for all API calls to avoid connection errors
    await page.route(url => url.toString().includes('localhost:8000'), async route => {
      const url = route.request().url();
      console.log(`MOCKING API CALL: ${url}`);
      
      // Profile Mock
      if (url.includes('/users/me/')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            role: 'job_seeker', 
            is_staff: true, 
            company_name: 'Test Corp'
          }),
        });
      }
      
      // Array-based mocks
      if (url.includes('/intelligence/') || url.includes('/badges/') || url.includes('/verification/')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        });
      }

      // Notification Mock
      if (url.includes('/notifications/')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ results: [], count: 0, unread_count: 0 }),
        });
      }

      // Default Paginated Response
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ results: [], count: 0 }),
      });
    });
  });

  // Log body on failure
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      console.log(`TEST FAILED: ${testInfo.title}`);
      console.log(`URL AT FAILURE: ${page.url()}`);
      try {
        const bodyText = await page.innerText('body');
        console.log("BODY TEXT AT FAILURE:");
        console.log(bodyText);
      } catch (e) {
        console.log("Could not retrieve body text");
      }
    }
  });

  test('Seeker Dashboard should render stats and jobs', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('user', JSON.stringify({
        id: 1,
        username: 'testuser',
        role: 'job_seeker'
      }));
      window.localStorage.setItem('token', 'MOCK_TOKEN');
    });
    await page.goto('/dashboard/seeker');
    // Wait for loading to disappear
    await expect(page.locator('.animate-spin')).not.toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/Command Center/i).first()).toBeVisible();
    await expect(page.getByText(/Active Transmissions/i).first()).toBeVisible();
  });

  test('Employer Dashboard should render jobs table', async ({ page }) => {
    // Override profile for employer role
    await page.route(/\/users\/me\//, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          username: 'testuser',
          role: 'employer',
          company_name: 'Test Corp'
        }),
      });
    });
    await page.addInitScript(() => {
      window.localStorage.setItem('user', JSON.stringify({
        id: 1,
        username: 'testuser',
        role: 'employer',
        company_name: 'Test Corp'
      }));
      window.localStorage.setItem('token', 'MOCK_TOKEN');
    });
    await page.goto('/dashboard/employer');
    // Wait for loading to disappear
    await expect(page.locator('.animate-spin')).not.toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/Enterprise Command/i).first()).toBeVisible();
    await expect(page.getByText(/Active Listings/i).first()).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
  });

  test('Admin Verification should render pending requests', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('user', JSON.stringify({
        id: 1,
        username: 'admin',
        role: 'admin',
        is_staff: true
      }));
      window.localStorage.setItem('token', 'MOCK_TOKEN');
    });
    await page.goto('/admin/verification');
    await expect(page.getByText(/Network Integrity Terminal/i)).toBeVisible({ timeout: 10000 });
    await expect(page.locator('table')).toBeVisible();
  });
});
