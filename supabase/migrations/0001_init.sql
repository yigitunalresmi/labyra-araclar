-- Labyra Araçlar — başlangıç şeması
-- profiles, tool_usage, menus + RLS + kota motoru + yeni-kullanıcı trigger

-- ============================================================
-- profiles  (auth.users ile 1-1)
-- ============================================================
create table if not exists public.profiles (
  id              uuid primary key references auth.users (id) on delete cascade,
  email           text,
  full_name       text,
  phone           text,
  locale          text not null default 'tr',
  marketing_opt_in boolean not null default false,
  created_at      timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using ((select auth.uid()) = id);

create policy "profiles_update_own"
  on public.profiles for update
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- ============================================================
-- tool_usage  (kota / kullanım sayacı)
-- ============================================================
create table if not exists public.tool_usage (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  tool_key     text not null,
  count        integer not null default 0,
  last_used_at timestamptz,
  unique (user_id, tool_key)
);

alter table public.tool_usage enable row level security;

-- Kullanıcı kendi kullanımını görebilir (yazma yalnız consume_quota RPC üzerinden).
create policy "tool_usage_select_own"
  on public.tool_usage for select
  using ((select auth.uid()) = user_id);

-- ============================================================
-- menus  (QR menü kayıtları — yayın sayfası slug ile public okunur)
-- ============================================================
create table if not exists public.menus (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  slug         text not null unique,
  data         jsonb not null default '{}'::jsonb,
  pdf_path     text,
  watermarked  boolean not null default true,
  created_at   timestamptz not null default now()
);

alter table public.menus enable row level security;

-- Yayınlanan menü herkese (anon) okunabilir — /m/{slug} sayfası için.
create policy "menus_select_public"
  on public.menus for select
  using (true);

create policy "menus_insert_own"
  on public.menus for insert
  with check ((select auth.uid()) = user_id);

create policy "menus_update_own"
  on public.menus for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "menus_delete_own"
  on public.menus for delete
  using ((select auth.uid()) = user_id);

-- ============================================================
-- consume_quota  — atomik kota tüketimi
-- Sınır aşılmadıysa sayacı +1 artırır ve true döner; aşıldıysa false.
-- ============================================================
create or replace function public.consume_quota(p_tool text, p_limit integer)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user  uuid := (select auth.uid());
  v_count integer;
begin
  if v_user is null then
    raise exception 'Giriş gerekli';
  end if;

  -- Satırı garanti et (yoksa oluştur), sonra kilitle.
  insert into public.tool_usage (user_id, tool_key, count)
  values (v_user, p_tool, 0)
  on conflict (user_id, tool_key) do nothing;

  select count into v_count
  from public.tool_usage
  where user_id = v_user and tool_key = p_tool
  for update;

  if v_count >= p_limit then
    return false;
  end if;

  update public.tool_usage
  set count = count + 1, last_used_at = now()
  where user_id = v_user and tool_key = p_tool;

  return true;
end;
$$;

-- ============================================================
-- handle_new_user — yeni auth kullanıcısı için profiles satırı
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
