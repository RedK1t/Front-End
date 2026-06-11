# Supabase migrations

SQL changes for the hosted Supabase project (`zxcmlsafspvebelqymhe`). These live in
the database, not the app, so they must be applied manually.

## How to apply

1. Open the Supabase dashboard → your project → **SQL Editor**.
2. Paste the contents of the migration file and **Run**. Each migration is written to
   be safe to run more than once.

## Migrations

### `migrations/0001_targets_per_user_unique.sql`
Fixes: a domain tested by one user not appearing for another user.

The `targets` table was unique on `domain` alone, so the second user to add a given
domain hit a duplicate-key error and their row was never saved. This migration makes
uniqueness per `(user_id, domain)` instead.

> After running it, verify Row Level Security on `targets` allows each user to
> `select`/`insert`/`update`/`delete` **their own** rows (policy `user_id = auth.uid()`).
> If other per-target tables (e.g. `subdomains`) are also globally unique by domain,
> they need the same `(user_id, …)` treatment.
