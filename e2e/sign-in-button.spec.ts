import { expect, test } from '@playwright/test';

test.describe('Sign in button', () => {
  test('renders without issue', async ({ page }) => {
    await page.goto('/');

    const signIn = page.getByRole('link', { name: /^sign in$/i });
    await expect(signIn).toBeVisible();
  });

  test('matches header snapshot', async ({ page }) => {
      await page.goto('/');

      const header = page.locator('header').first();
      await expect(header).toBeVisible();
      await expect(header).toHaveScreenshot('header-sign-in.png');
  });
});
