import { test } from '@playwright/test';

test('GPU hardware acceleration', async ({ page }) => {
  await page.goto('chrome://gpu');
  await page.screenshot({ path: 'gpu.png' });
});
