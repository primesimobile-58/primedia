import { test, expect } from '@playwright/test'

test('Command menu opens and no accessibility console error', async ({ page }) => {
  const errors: string[] = []
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
  await page.goto('/dashboard', { waitUntil: 'domcontentloaded' })
  await page.keyboard.down('Meta')
  await page.keyboard.press('KeyK')
  await page.keyboard.up('Meta')
  await expect(page.getByPlaceholder(/Type a command or search/i)).toBeVisible()
  expect(errors.join('\n')).not.toMatch(/DialogContent requires a DialogTitle/i)
})
