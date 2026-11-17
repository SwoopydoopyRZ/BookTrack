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

do $$
begin
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
