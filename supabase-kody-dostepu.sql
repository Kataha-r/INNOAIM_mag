-- Uruchom ten mały plik w Supabase:
-- SQL Editor -> New query -> wklej całość -> Run
-- To dodaje dostęp klienta przez kod, bez maili i bez logowania.

alter table public.products
add column if not exists visible_to_codes text[] not null default '{}'::text[];

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
    from unnest(p.visible_to_codes) as allowed_code(code)
    where lower(trim(allowed_code.code)) = lower(trim(access_code))
  )
  order by p.name;
$$;

revoke all on function public.get_client_products_by_code(text) from public;
grant execute on function public.get_client_products_by_code(text) to anon, authenticated;
