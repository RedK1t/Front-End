-- AI Vulnerability Scanner — per-user scan history.
--
-- Why: AI scan results previously lived only in the browser's react-query memory, so
-- starting a new scan wiped the previous one and a reload lost everything. This table
-- stores each completed scan per user so history survives reloads and is queryable.
--
-- Run once in the Supabase SQL editor. Safe to re-run (idempotent guards).

-- 1) Table.
create table if not exists public.scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  domain text,
  target_url text,
  scan_id text,
  summary jsonb,
  vulnerabilities jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- 2) Index for the per-user, newest-first history list.
create index if not exists scans_user_created_idx
  on public.scans (user_id, created_at desc);

-- 3) Row Level Security: a user can only see/insert/delete their own scans.
alter table public.scans enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'scans'
      and policyname = 'scans_select_own'
  ) then
    create policy scans_select_own on public.scans
      for select using (user_id = auth.uid());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'scans'
      and policyname = 'scans_insert_own'
  ) then
    create policy scans_insert_own on public.scans
      for insert with check (user_id = auth.uid());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'scans'
      and policyname = 'scans_delete_own'
  ) then
    create policy scans_delete_own on public.scans
      for delete using (user_id = auth.uid());
  end if;
end $$;
