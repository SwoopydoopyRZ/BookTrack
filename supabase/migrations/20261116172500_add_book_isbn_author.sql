alter table public.books
  add column if not exists author text not null default '',
  add column if not exists isbn text not null default '';
