-- BookTrack shared household collection.
-- Applied automatically by the Supabase GitHub integration when this migration
-- is deployed. Access is limited to authenticated household accounts.

create table if not exists public.books (
  book_id text primary key check (length(trim(book_id)) between 1 and 40),
  title text not null check (length(trim(title)) between 1 and 100),
  room text not null default '',
  shelf text not null default '',
  member text not null default '',
  destination text not null default '',
  details text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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
end
$$;
