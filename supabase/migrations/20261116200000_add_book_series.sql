alter table public.books
  add column if not exists series text not null default '';
