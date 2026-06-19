-- Uruchom ten plik jeden raz:
-- Supabase -> SQL Editor -> New query -> wklej całość -> Run

create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  category text not null default '',
  machine_type text not null default '',
  location text not null default 'A/1/1',
  description text not null default '',
  stock integer not null default 0 check (stock >= 0),
  required integer not null default 0 check (required >= 0),
  ordered integer not null default 0 check (ordered >= 0),
  purchase_price numeric(12, 2) not null default 0 check (purchase_price >= 0),
  manufacturer text not null default '',
  image text not null default '',
  images jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Dodaje kolumnę również wtedy, gdy tabela została utworzona wcześniej.
alter table public.products
add column if not exists manufacturer text not null default '';

alter table public.products
add column if not exists machine_type text not null default '';

alter table public.products
add column if not exists images jsonb not null default '[]'::jsonb;

alter table public.products enable row level security;
grant select, insert, update, delete on public.products to authenticated;

drop policy if exists "Użytkownik odczytuje własne produkty" on public.products;
create policy "Użytkownik odczytuje własne produkty"
on public.products for select to authenticated
using ((select auth.uid()) = owner_id);

drop policy if exists "Użytkownik dodaje własne produkty" on public.products;
create policy "Użytkownik dodaje własne produkty"
on public.products for insert to authenticated
with check ((select auth.uid()) = owner_id);

drop policy if exists "Użytkownik edytuje własne produkty" on public.products;
create policy "Użytkownik edytuje własne produkty"
on public.products for update to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

drop policy if exists "Użytkownik usuwa własne produkty" on public.products;
create policy "Użytkownik usuwa własne produkty"
on public.products for delete to authenticated
using ((select auth.uid()) = owner_id);

create or replace function public.set_products_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at
before update on public.products
for each row execute function public.set_products_updated_at();

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'products'
  ) then
    alter publication supabase_realtime add table public.products;
  end if;
end $$;
