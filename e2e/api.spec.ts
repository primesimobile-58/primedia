import { test, expect, request } from '@playwright/test'

test('POST /api/demo-request returns success', async ({}) => {
  const ctx = await request.newContext({ baseURL: 'http://localhost:3000' })
  const res = await ctx.post('/api/demo-request', {
    data: {
      name: 'QA User',
      email: 'qa+demo@example.com',
      company: 'Alya QA',
      phone: '+1-555-0000',
      use_case: 'predictive_analytics',
      team_size: 10,
      timeline: '3_months'
    },
  })
  expect(res.status()).toBeGreaterThanOrEqual(200)
  expect(res.status()).toBeLessThan(400)
  const json = await res.json().catch(() => ({}))
  expect(typeof json).toBe('object')
})

test('POST /api/newsletter-subscribe returns success', async ({}) => {
  const ctx = await request.newContext({ baseURL: 'http://localhost:3000' })
  const res = await ctx.post('/api/newsletter-subscribe', {
    data: { email: 'qa+newsletter@example.com', source: 'e2e' },
  })
  expect(res.status()).toBeGreaterThanOrEqual(200)
  expect(res.status()).toBeLessThan(400)
  const json = await res.json().catch(() => ({}))
  expect(typeof json).toBe('object')
})
