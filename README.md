# 💵 أسعار الدولار في العراق — USD → IQD Live Rate Tracker

Ultra-fast Nuxt 3 app tracking USD→IQD exchange rates across **Baghdad (بغداد)**, **North/Erbil (الشمال/أربيل)**, and **South/Basra (الجنوب/البصرة)** — with live Supabase Realtime updates, an interactive buy/sell calculator, a protected admin dashboard, and a fully configured PWA with aggressive cache-busting.

## 📁 Project Structure

```
├── nuxt.config.ts          # Nuxt + Tailwind + PWA (Vite PWA) config
├── tailwind.config.ts      # Dark-mode financial theme
├── assets/css/main.css     # Base styles, flash animations, live pulse
├── supabase/schema.sql     # Full SQL schema: rates table, RLS, triggers, seed
├── composables/
│   ├── useSupabase.ts      # Singleton Supabase client
│   └── useRates.ts         # Realtime rates store (fetch + channel subscription)
├── components/
│   ├── LiveBadge.vue       # "مباشر" connection indicator (pulse dot)
│   ├── RateCard.vue        # Region card: buy/sell prices + change flash
│   └── RateCalculator.vue  # Interactive USD↔IQD calculator w/ breakdown
├── layouts/default.vue     # Header (live badge + theme toggle) & footer
├── pages/
│   ├── index.vue           # Public board: 3 region cards + calculator
│   └── admin.vue           # Protected dashboard (Supabase Auth)
└── public/                 # Icons, manifest, favicon
```

## 🚀 Setup

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → **New project**.
2. In **SQL Editor**, paste the entire contents of [`supabase/schema.sql`](supabase/schema.sql) and **Run** it.
   This creates the `rates` + `rate_history` tables, RLS policies, realtime publication, history trigger, and seeds the 3 regions.

### 2. Configure environment variables

```bash
cp .env.example .env
```

Then fill in from **Supabase Dashboard → Project Settings → API**:

```ini
NUXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
NUXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY
```

> The anon key is safe in the browser — RLS ensures only authenticated users (admins) can write; everyone can read.

### 3. Create the admin user

Supabase Dashboard → **Authentication → Users → Add user** → enter email + password (auto-confirm). Log in at `/admin`.

### 4. Run

```bash
npm install
npm run dev      # → http://localhost:3000
npm run build    # production build (verified passing)
node .output/server/index.mjs
```

## ⚡ How Realtime works

- Home page fetches `/rest/v1/rates` on load and subscribes to `postgres_changes` on the `rates` table via Supabase Realtime.
- When the admin saves in `/admin`, the upsert **broadcasts to every connected visitor instantly** — prices flash green/red on change, "آخر تحديث" updates, no refresh needed.
- A 60s polling fallback covers silent Realtime drops.

## 🗂 PWA & cache-busting strategy

Configured via `@vite-pwa/nuxt` (`generateSW` strategy):

| Setting | Effect |
|---|---|
| `registerType: 'autoUpdate'` | New SW activates on reload without user prompt |
| `skipWaiting: true` | New SW takes over immediately, no waiting for old one |
| `clientsClaim: true` | Claims all open tabs the moment it activates |
| `cleanupOutdatedCaches: true` | Old versioned caches are **deleted** on activation |
| `_nuxt/*` assets | Content-hashed filenames — stale JS/CSS impossible to serve |
| Supabase REST | `NetworkFirst` (5s timeout, 5-min freshness) — never stale data |
| Realtime + Auth endpoints | `NetworkOnly` — never cached (WebSockets/sessions) |
| Navigate fallback | App shell served offline; `/admin` excluded |

Deploying new code produces a different `sw.js` (new precache manifest hash) → every client downloads the new SW on next visit, purges old caches, and serves only fresh assets. Rate data is always guaranteed ≤ 5 min old, and normally a few seconds via Realtime.

## 🔒 Security model

- `rates` / `rate_history`: `SELECT` allowed for `anon` (public board), `INSERT`/`UPDATE`/`DELETE` restricted to `authenticated` via RLS.
- Every rate change is recorded in `rate_history` by a trigger (audit trail) with the admin's `user_id`.
- `/admin` requires a Supabase Auth session (`signInWithPassword`), and writes use auth.uid() for `updated_by`.
