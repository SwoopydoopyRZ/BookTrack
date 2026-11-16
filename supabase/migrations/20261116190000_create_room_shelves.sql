create table if not exists public.room_shelves (
  id boolean primary key default true check (id),
  locations jsonb not null default '[]'::jsonb
    check (jsonb_typeof(locations) = 'array'),
  updated_at timestamptz not null default now()
);

alter table public.room_shelves enable row level security;

revoke all on table public.room_shelves from anon;
grant select, insert, update, delete on table public.room_shelves to authenticated;

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

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'room_shelves'
  ) then
    alter publication supabase_realtime add table public.room_shelves;
  end if;
end
$$;
