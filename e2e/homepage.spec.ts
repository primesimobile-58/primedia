import { test, expect } from '@playwright/test'

test('Hero, navbar and i18n work without console errors', async ({ page }) => {
  const errors: string[] = []
  page.on('console', m => {
    if (m.type() === 'error') errors.push(m.text())
  })
  await page.goto('/tr', { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('link', { name: /Platform/i })).toBeVisible()
  await expect(page.getByRole('link', { name: /Intelligence/i })).toBeVisible()
  await expect(page.getByRole('link', { name: /Enterprise/i })).toBeVisible()
  await expect(page.getByRole('link', { name: /Sign In/i })).toBeVisible()
  await expect(page.getByRole('link', { name: /Get Started/i })).toBeVisible()
  const langToggle = page.getByRole('button', { name: /TR|EN/i })
  await langToggle.click()
  await expect(page.getByText(/Be first|Önce sen ol/i)).toBeVisible()
  expect(errors.join('\n')).not.toMatch(/DialogContent requires a DialogTitle|ReferenceError/i)
})

test('CTA routes work', async ({ page }) => {
  await page.goto('/tr', { waitUntil: 'domcontentloaded' })
  await page.getByRole('link', { name: /Sign In|Giriş Yap/i }).click()
  await expect(page).toHaveURL(/\/auth\/login/)
  await page.goto('/tr', { waitUntil: 'domcontentloaded' })
  await page.getByRole('link', { name: /Get Started|Başla/i }).click()
  await expect(page).toHaveURL(/\/demo/)
})
