import { test, expect } from '@playwright/test'

test('Demo request form submits successfully', async ({ page }) => {
  await page.goto('/demo', { waitUntil: 'domcontentloaded' })
  await page.getByLabel(/Full Name/i).fill('Test User')
  await page.getByLabel(/Email Address/i).fill('test+demo@example.com')
  await page.getByLabel(/Company Name/i).fill('Alya QA')
  const submit = page.getByRole('button', { name: /Request Demo|Send/i })
  await submit.click()
  await expect(page.getByText(/Thank you|Başarılı|Teşekkürler/i)).toBeVisible({ timeout: 5000 })
})

test('Newsletter form submits successfully', async ({ page }) => {
  await page.goto('/tr', { waitUntil: 'domcontentloaded' })
  const emailInput = page.getByPlaceholder(/Subscribe to newsletter/i)
  await emailInput.fill('test+newsletter@example.com')
  await page.getByRole('button', { name: /Subscribe/i }).click()
  await expect(page.getByText(/Thank you|Subscribed|Teşekkürler/i)).toBeVisible({ timeout: 5000 })
})
