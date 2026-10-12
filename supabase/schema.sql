-- ============================================================================
-- USD → IQD Exchange Rate Tracker — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Rates table
-- ---------------------------------------------------------------------------
create table if not exists public.rates (
  id          uuid primary key default gen_random_uuid(),
  region      text not null unique check (region in ('baghdad', 'north', 'south')),
  region_ar   text not null,
  buy_price   integer not null check (buy_price > 0),   -- سعر الشراء من المواطن (shop buys USD from citizen)
  sell_price  integer not null check (sell_price > 0),  -- سعر البيع للمواطن (shop sells USD to citizen)
  updated_at  timestamptz not null default now(),
  updated_by  uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now()
);

-- Helpful indexes
create index if not exists rates_region_idx on public.rates (region);
create index if not exists rates_updated_at_idx on public.rates (updated_at desc);

-- ---------------------------------------------------------------------------
-- 2. History table (audit trail of every rate change)
-- ---------------------------------------------------------------------------
create table if not exists public.rate_history (
  id          bigserial primary key,
  region      text not null,
  buy_price   integer not null,
  sell_price  integer not null,
  changed_at  timestamptz not null default now(),
  changed_by  uuid references auth.users(id) on delete set null
);

create index if not exists rate_history_region_idx on public.rate_history (region, changed_at desc);

-- ---------------------------------------------------------------------------
-- 3. Realtime: enable replication for the tables we subscribe to
-- ---------------------------------------------------------------------------
alter publication supabase_realtime add table public.rates;
-- (Ignore the error if it says the table is already in the publication.)

-- ---------------------------------------------------------------------------
-- 4. Row Level Security
--    - Everyone (anon) can READ current rates + history (public board).
--    - Only authenticated admins (confirmed by Supabase Auth) can WRITE.
-- ---------------------------------------------------------------------------
alter table public.rates        enable row level security;
alter table public.rate_history enable row level security;

-- Public read access
drop policy if exists "Public can read rates" on public.rates;
create policy "Public can read rates"
  on public.rates for select
  to anon, authenticated
  using (true);

drop policy if exists "Public can read rate history" on public.rate_history;
create policy "Public can read rate history"
  on public.rate_history for select
  to anon, authenticated
  using (true);

-- Admin write access (any authenticated user = admin in this simple setup.
-- For stricter control, restrict by email: using_clause below.)
drop policy if exists "Admins can insert rates" on public.rates;
create policy "Admins can insert rates"
  on public.rates for insert
  to authenticated
  with check (auth.uid() is not null);

drop policy if exists "Admins can update rates" on public.rates;
create policy "Admins can update rates"
  on public.rates for update
  to authenticated
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

drop policy if exists "Admins can delete rates" on public.rates;
create policy "Admins can delete rates"
  on public.rates for delete
  to authenticated
  using (auth.uid() is not null);

-- Admin can insert history rows (trigger does this automatically too)
drop policy if exists "Admins can insert history" on public.rate_history;
create policy "Admins can insert history"
  on public.rate_history for insert
  to authenticated
  with check (auth.uid() is not null);

-- ---------------------------------------------------------------------------
-- 5. Trigger: auto-record history on every rate update
-- ---------------------------------------------------------------------------
create or replace function public.handle_rate_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.rate_history (region, buy_price, sell_price, changed_by)
  values (new.region, new.buy_price, new.sell_price, new.updated_by);
  return new;
end;
$$;

drop trigger if exists on_rate_change on public.rates;
create trigger on_rate_change
  after update on public.rates
  for each row
  when (old.buy_price is distinct from new.buy_price or old.sell_price is distinct from new.sell_price)
  execute function public.handle_rate_change();

-- ---------------------------------------------------------------------------
-- 6. Auto-update updated_at on change
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists rates_set_updated_at on public.rates;
create trigger rates_set_updated_at
  before update on public.rates
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 7. Seed the three regions (idempotent)
-- ---------------------------------------------------------------------------
insert into public.rates (region, region_ar, buy_price, sell_price)
values
  ('baghdad', 'بغداد', 131000, 131500),
  ('north',   'أربيل', 131250, 131750),
  ('south',   'البصرة', 130750, 131250)
on conflict (region) do nothing;
