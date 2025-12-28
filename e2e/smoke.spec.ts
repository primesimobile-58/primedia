import { test, expect } from '@playwright/test'

test('Homepage loads and shows CTA', async ({ page }) => {
  await page.goto('/tr', { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('button', { name: /Explore Platform|Platformu Keşfet/i })).toBeVisible()
})
