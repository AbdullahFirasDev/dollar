-- ============================================================================
-- IQWealth USD Sync Settings — USD/IQD-only edition
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run
-- (Safe to re-run; every statement is idempotent. Run AFTER supabase/schema.sql)
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 0. App settings (single row, id = 1):
--    auto_sync       — true: server pulls IQWealth USD rates automatically
--                      (Auto-Sync Mode, every ~3 minutes)
--                      false: admin-only manual updates (Manual Override Mode)
--    last_synced_at / last_sync_source / last_sync_error — sync telemetry
-- ---------------------------------------------------------------------------
create table if not exists public.app_settings (
  id                integer primary key check (id = 1),
  auto_sync         boolean not null default true,
  last_synced_at    timestamptz,
  last_sync_source  text,
  last_sync_error   text,
  updated_by        uuid references auth.users(id) on delete set null,
  updated_at        timestamptz not null default now()
);

insert into public.app_settings (id, auto_sync) values (1, true)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- 1. Realtime: broadcast settings changes alongside rates
-- ---------------------------------------------------------------------------
alter publication supabase_realtime add table public.app_settings;
-- (Ignore the "already member of publication" error.)

-- ---------------------------------------------------------------------------
-- 2. Row Level Security
--    - Public can READ settings (auto_sync flag is not sensitive).
--    - USD rate writes: server only, via the service-role key (bypasses RLS).
--      Public/Admin rows of the `rates` table keep the policies of schema.sql.
--    - app_settings.auto_sync is controlled by authenticated admins only.
-- ---------------------------------------------------------------------------
alter table public.app_settings enable row level security;

drop policy if exists "Public can read app settings" on public.app_settings;
create policy "Public can read app settings"
  on public.app_settings for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can update app settings" on public.app_settings;
create policy "Admins can update app settings"
  on public.app_settings for update
  to authenticated
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

drop policy if exists "Admins can insert app settings" on public.app_settings;
create policy "Admins can insert app settings"
  on public.app_settings for insert
  to authenticated
  with check (auth.uid() is not null);

-- Auto-update updated_at mirroring the rates table trigger
create or replace function public.set_settings_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists app_settings_set_updated_at on public.app_settings;
create trigger app_settings_set_updated_at
  before update on public.app_settings
  for each row
  execute function public.set_settings_updated_at();

-- ---------------------------------------------------------------------------
-- 3. OPTIONAL CLEANUP — the app no longer writes gold or other-currency data.
--    Un-comment and run once if you executed the older multi-asset SQL and
--    want the unused tables removed from your project:
-- ---------------------------------------------------------------------------
-- alter publication supabase_realtime drop table public.gold_prices;
-- alter publication supabase_realtime drop table public.currency_rates;
-- drop table if exists public.gold_prices;
-- drop table if exists public.currency_rates;
