import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 320, height: 844 } });

test('should not overflow viewport', async ({ page }) => {
  await page.goto('/');

  const pill = page.getByText('Community-Driven · Transparent · Impactful');
  await expect(pill).toBeInViewport({ratio: 1});
});
