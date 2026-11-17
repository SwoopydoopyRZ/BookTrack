alter table public.books
  add column if not exists language text not null default '';
