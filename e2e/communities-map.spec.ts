import { expect, test } from '@playwright/test';

test('should open community detail modal when clicking View Details button in map popup', async ({ page }) => {
  await page.goto('/communities');

  const marker = page.locator('.leaflet-marker-icon').first();
  await expect(marker).toBeVisible({ timeout: 20_000 });
  await marker.click();

  const popup = page.locator('.leaflet-popup');
  await expect(popup).toBeVisible();

  const viewDetailsButton = popup.getByRole('link', { name: 'View Details' });
  await expect(viewDetailsButton).toBeVisible();
  await viewDetailsButton.click();

  const modal= page.getByRole("dialog")
  await expect(modal).toBeVisible();
  await expect(modal.getByRole('button', { name: 'Close' })).toBeVisible();
  await expect(modal.getByRole('link', { name: /View Full Page/ })).toBeVisible();
  await expect(page).toHaveURL(/\/communities\/[^/]+$/);
});
