import { test, expect } from '@playwright/test';

test('create task through UI', async ({ page }) => {
  await page.goto('/');
  await page.fill('input[placeholder="Title"]', 'E2E task');
  await page.fill('input[placeholder="Description"]', 'desc');
  await page.click('button:has-text("Add")');
  await expect(page.locator('text=E2E task')).toHaveCount(1);
});

