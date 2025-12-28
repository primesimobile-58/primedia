# Deploy Guide

## GitHub → Vercel

1. Push this repository to GitHub.
2. In Vercel Dashboard: New Project → Import from GitHub → select repository.
3. Configure Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Cron Jobs: `vercel.json` is included (daily schedules). Ensure Hobby plan or upgrade for hourly.
5. Connect Domain (optional).

## GitHub Actions (CI)

- `.github/workflows/ci.yml` builds, starts Next.js, checks `/api/health`, and runs Playwright tests.

## GitHub Actions (Vercel Deploy via Token)

- `.github/workflows/vercel.yml` uses `amondnet/vercel-action`.
- Set repo secrets:
  - `VERCEL_TOKEN`
  - `VERCEL_ORG_ID`
  - `VERCEL_PROJECT_ID`

## Post-Deploy Health Check

- Visit `https://<your-domain>/api/health` and confirm:
  - `env.supabaseUrl`, `env.supabaseAnon`, `env.supabaseService` → true
  - `providers.googleEnabled`, `providers.appleEnabled` → according to your setup

## OAuth Providers

- In Supabase Dashboard → Auth → Providers enable Google/Apple and set Redirect URL:
  - `https://<your-domain>/auth/callback`
  - Local dev: `http://localhost:3000/auth/callback`
