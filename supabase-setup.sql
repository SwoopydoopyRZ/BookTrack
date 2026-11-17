-- BookTrack shared household database
-- Run this entire file in Supabase Dashboard -> SQL Editor -> New query.
-- Access is restricted to authenticated Supabase users. Turn off public sign-ups
-- and invite only the household members you trust (see SUPABASE_SETUP.md).

create table if not exists public.books (
  book_id text primary key check (length(trim(book_id)) between 1 and 40),
  title text not null check (length(trim(title)) between 1 and 100),
  author text not null default '',
  series text not null default '',
  isbn text not null default '',
  room text not null default '',
  shelf text not null default '',
  member text not null default '',
  destination text not null default '',
  details text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.books
  add column if not exists author text not null default '',
  add column if not exists series text not null default '',
  add column if not exists isbn text not null default '';

alter table public.books enable row level security;

revoke all on table public.books from anon;
grant select, insert, update, delete on table public.books to authenticated;

drop policy if exists "Household members can read books" on public.books;
create policy "Household members can read books"
  on public.books for select to authenticated
  using (true);

drop policy if exists "Household members can add books" on public.books;
create policy "Household members can add books"
  on public.books for insert to authenticated
  with check (true);

drop policy if exists "Household members can edit books" on public.books;
create policy "Household members can edit books"
  on public.books for update to authenticated
  using (true)
  with check (true);

drop policy if exists "Household members can delete books" on public.books;
create policy "Household members can delete books"
  on public.books for delete to authenticated
  using (true);

create table if not exists public.room_shelves (
  id boolean primary key default true check (id),
  locations jsonb not null default '[]'::jsonb
    check (jsonb_typeof(locations) = 'array'),
  updated_at timestamptz not null default now()
);

create table if not exists public.library_loans (
  loan_id text primary key check (length(trim(loan_id)) between 1 and 60),
  title text not null check (length(trim(title)) between 1 and 200),
  author text not null default '',
  barcode text not null default '',
  borrowed_on date not null default current_date,
  due_on date not null,
  returned_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.library_loans enable row level security;

revoke all on table public.library_loans from anon;
grant select, insert, update, delete on table public.library_loans to authenticated;

drop policy if exists "Household members can read library loans" on public.library_loans;
create policy "Household members can read library loans"
  on public.library_loans for select to authenticated
  using (true);

drop policy if exists "Household members can add library loans" on public.library_loans;
create policy "Household members can add library loans"
  on public.library_loans for insert to authenticated
  with check (true);

drop policy if exists "Household members can edit library loans" on public.library_loans;
create policy "Household members can edit library loans"
  on public.library_loans for update to authenticated
  using (true)
  with check (true);

drop policy if exists "Household members can delete library loans" on public.library_loans;
create policy "Household members can delete library loans"
  on public.library_loans for delete to authenticated
  using (true);

alter table public.room_shelves enable row level security;

revoke all on table public.room_shelves from anon;
grant select, insert, update, delete on public.room_shelves to authenticated;

drop policy if exists "Household members can read room shelves" on public.room_shelves;
create policy "Household members can read room shelves"
  on public.room_shelves for select to authenticated
  using (true);

drop policy if exists "Household members can add room shelves" on public.room_shelves;
create policy "Household members can add room shelves"
  on public.room_shelves for insert to authenticated
  with check (true);

drop policy if exists "Household members can edit room shelves" on public.room_shelves;
create policy "Household members can edit room shelves"
  on public.room_shelves for update to authenticated
  using (true)
  with check (true);

drop policy if exists "Household members can delete room shelves" on public.room_shelves;
create policy "Household members can delete room shelves"
  on public.room_shelves for delete to authenticated
  using (true);

-- Enable Supabase Realtime for shared tables, without failing if already enabled.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'books'
  ) then
    alter publication supabase_realtime add table public.books;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'room_shelves'
  ) then
    alter publication supabase_realtime add table public.room_shelves;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'library_loans'
  ) then
    alter publication supabase_realtime add table public.library_loans;
  end if;
end
$$;
