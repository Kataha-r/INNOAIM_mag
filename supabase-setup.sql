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
  sent integer not null default 0 check (sent >= 0),
  purchase_price numeric(12, 2) not null default 0 check (purchase_price >= 0),
  manufacturer text not null default '',
  image text not null default '',
  images jsonb not null default '[]'::jsonb,
  shipments jsonb not null default '[]'::jsonb,
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

alter table public.products
add column if not exists sent integer not null default 0;

alter table public.products
add column if not exists shipments jsonb not null default '[]'::jsonb;

alter table public.products
add column if not exists visible_to_emails text[] not null default '{}'::text[];

-- Widok klienta używa tej funkcji zamiast bezpośredniego odczytu tabeli products.
-- Dzięki temu klient dostaje tylko bezpieczne kolumny, bez lokalizacji, ceny zakupu,
-- minimum, statystyk, historii wysyłek i pól administracyjnych.
create or replace function public.get_client_products()
returns table (
  id uuid,
  name text,
  category text,
  machine_type text,
  description text,
  manufacturer text,
  image text,
  images jsonb,
  availability text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    p.id,
    p.name,
    p.category,
    p.machine_type,
    p.description,
    p.manufacturer,
    p.image,
    p.images,
    case
      when p.stock > 0 then 'Dostępny'
      else 'Na zapytanie'
    end as availability
  from public.products p
  where exists (
    select 1
    from unnest(p.visible_to_emails) as allowed_email(email)
    where lower(allowed_email.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
  order by p.name;
$$;

revoke all on function public.get_client_products() from public;
grant execute on function public.get_client_products() to authenticated;

-- Lista adresów e-mail, które mogą wspólnie korzystać z jednego magazynu.
-- Po uruchomieniu tego pliku dodaj swoje adresy poleceniem:
-- insert into public.warehouse_members (email)
-- values ('pierwszy@email.pl'), ('drugi@email.pl')
-- on conflict (email) do nothing;
create table if not exists public.warehouse_members (
  email text primary key,
  created_at timestamptz not null default now()
);

revoke all on public.warehouse_members from anon, authenticated;

create or replace function public.is_warehouse_member()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.warehouse_members
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.is_warehouse_member() from public;
grant execute on function public.is_warehouse_member() to authenticated;

alter table public.products enable row level security;
grant select, insert, update, delete on public.products to authenticated;

drop policy if exists "Użytkownik odczytuje własne produkty" on public.products;
create policy "Użytkownik odczytuje własne produkty"
on public.products for select to authenticated
using ((select auth.uid()) = owner_id or public.is_warehouse_member());

drop policy if exists "Użytkownik dodaje własne produkty" on public.products;
create policy "Użytkownik dodaje własne produkty"
on public.products for insert to authenticated
with check ((select auth.uid()) = owner_id or public.is_warehouse_member());

drop policy if exists "Użytkownik edytuje własne produkty" on public.products;
create policy "Użytkownik edytuje własne produkty"
on public.products for update to authenticated
using ((select auth.uid()) = owner_id or public.is_warehouse_member())
with check ((select auth.uid()) = owner_id or public.is_warehouse_member());

drop policy if exists "Użytkownik usuwa własne produkty" on public.products;
create policy "Użytkownik usuwa własne produkty"
on public.products for delete to authenticated
using ((select auth.uid()) = owner_id or public.is_warehouse_member());

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
