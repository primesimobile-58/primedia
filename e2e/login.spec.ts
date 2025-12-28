import { test, expect } from '@playwright/test'

test('Login page shows email/password and OAuth buttons', async ({ page }) => {
  await page.goto('/auth/login', { waitUntil: 'domcontentloaded' })
  await expect(page.getByLabel(/Email/i)).toBeVisible()
  await expect(page.getByLabel(/Password/i)).toBeVisible()
  await expect(page.getByRole('button', { name: /Sign In/i })).toBeVisible()
  await expect(page.getByRole('button', { name: /Google ile Giriş/i })).toBeVisible()
  await expect(page.getByRole('button', { name: /Apple ile Giriş/i })).toBeVisible()
})
