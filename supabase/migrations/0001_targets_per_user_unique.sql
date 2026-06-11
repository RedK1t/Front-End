-- Fix: a target must be unique PER USER, not globally.
--
-- Symptom this fixes: user A tests "google.com" and sees it in their overview, but
-- when user B tests "google.com" it never appears for B. Cause: the `targets` table
-- has a UNIQUE constraint on `domain` alone, so B's INSERT of a domain another user
-- already added fails with a duplicate-key error and the row is never stored.
--
-- This migration removes any domain-only uniqueness and enforces uniqueness on the
-- pair (user_id, domain) instead. Run it once in the Supabase SQL editor.

-- 1) Drop any UNIQUE CONSTRAINT that is on (domain) alone.
do $$
declare
  c record;
begin
  for c in
    select con.conname
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_namespace nsp on nsp.oid = rel.relnamespace
    where nsp.nspname = 'public'
      and rel.relname = 'targets'
      and con.contype = 'u'
      and (
        select array_agg(att.attname order by att.attnum)
        from unnest(con.conkey) as k(attnum)
        join pg_attribute att
          on att.attrelid = con.conrelid and att.attnum = k.attnum
      ) = array['domain']
  loop
    execute format('alter table public.targets drop constraint %I', c.conname);
  end loop;
end $$;

-- 2) Drop any UNIQUE INDEX on (domain) alone (in case it was made as an index).
do $$
declare
  i record;
begin
  for i in
    select indexrelid::regclass as idxname
    from pg_index x
    join pg_class rel on rel.oid = x.indrelid
    join pg_namespace nsp on nsp.oid = rel.relnamespace
    where nsp.nspname = 'public'
      and rel.relname = 'targets'
      and x.indisunique
      and (
        select array_agg(att.attname order by att.attnum)
        from unnest(x.indkey) as k(attnum)
        join pg_attribute att
          on att.attrelid = x.indrelid and att.attnum = k.attnum
      ) = array['domain']
  loop
    execute format('drop index %s', i.idxname);
  end loop;
end $$;

-- 3) Enforce the correct uniqueness: one row per (user_id, domain).
--    Guarded so re-running the migration is safe.
do $$
begin
  if not exists (
    select 1
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_namespace nsp on nsp.oid = rel.relnamespace
    where nsp.nspname = 'public'
      and rel.relname = 'targets'
      and con.conname = 'targets_user_id_domain_key'
  ) then
    alter table public.targets
      add constraint targets_user_id_domain_key unique (user_id, domain);
  end if;
end $$;
