-- Supabase -> SQL Editor -> New query -> wklej całość -> Run
-- Ten plik naprawia typowe problemy synchronizacji:
-- brakujące kolumny, dostęp do tabeli products i funkcję panelu klienta.

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

alter table public.products
add column if not exists visible_to_codes text[] not null default '{}'::text[];

alter table public.products enable row level security;

grant select, insert, update, delete on public.products to authenticated;

create table if not exists public.warehouse_members (
  email text primary key,
  created_at timestamptz not null default now()
);

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

drop function if exists public.get_client_products_by_code(text);

create or replace function public.get_client_products_by_code(access_code text)
returns table (
  id uuid,
  name text,
  category text,
  machine_type text,
  description text,
  manufacturer text,
  image text,
  images jsonb,
  stock integer,
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
    p.stock,
    case
      when p.stock > 0 then 'Dostępny'
      else 'Na zapytanie'
    end as availability
  from public.products p
  where exists (
    select 1
    from unnest(p.visible_to_codes) as allowed_code(code)
    where lower(trim(allowed_code.code)) = lower(trim(access_code))
  )
  order by p.name;
$$;

revoke all on function public.get_client_products_by_code(text) from public;
grant execute on function public.get_client_products_by_code(text) to anon, authenticated;

-- Opcjonalnie: jeżeli korzystasz z kilku maili admina, odkomentuj i wpisz swoje maile:
-- insert into public.warehouse_members (email)
-- values ('twoj@email.pl')
-- on conflict (email) do nothing;
