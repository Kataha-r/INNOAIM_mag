-- Supabase -> SQL Editor -> New query -> wklej całość -> Run
-- Zmień poniżej 'TEST' na kod, który ma działać u klienta.
-- Ten skrypt ustawia wpisany kod dla wszystkich produktów.

alter table public.products
add column if not exists visible_to_codes text[] not null default '{}'::text[];

update public.products
set visible_to_codes = array['TEST']::text[];

-- Kontrola po uruchomieniu.
-- Wynik powinien pokazać, ile produktów klient zobaczy dla kodu TEST.
select
  code,
  count(*) as liczba_produktow
from public.products p
cross join unnest(array['TEST']::text[]) as code
where exists (
  select 1
  from unnest(p.visible_to_codes) as saved_code
  where lower(trim(saved_code)) = lower(trim(code))
)
group by code
order by code;
