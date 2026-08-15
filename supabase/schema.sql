-- =========================================================
-- PREMIUM APK — Supabase Schema
-- Jalankan file ini di Supabase Dashboard > SQL Editor > New query
-- =========================================================

-- Ekstensi untuk uuid
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------
-- Table: apks
-- ---------------------------------------------------------
create table if not exists public.apks (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null default '',
  version text not null default '1.0.0',
  size_label text not null default '',        -- contoh: "85 MB"
  category text default 'Umum',
  thumbnail_url text,
  screenshots text[] default '{}',             -- array URL gambar
  download_url text not null,
  status text not null default 'draft' check (status in ('published', 'draft')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists apks_status_idx on public.apks (status);
create index if not exists apks_created_idx on public.apks (created_at desc);

-- ---------------------------------------------------------
-- Table: settings
-- Satu baris konfigurasi global (musik, whatsapp, info situs)
-- ---------------------------------------------------------
create table if not exists public.settings (
  id int primary key default 1,
  site_name text not null default 'PREMIUM APK',
  site_description text not null default 'Katalog aplikasi original buatan sendiri.',
  whatsapp_link text not null default '',
  music_url text,
  music_enabled boolean not null default false,
  social_links jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint settings_singleton check (id = 1)
);

insert into public.settings (id) values (1)
on conflict (id) do nothing;

-- ---------------------------------------------------------
-- Trigger: auto-update updated_at
-- ---------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists apks_set_updated_at on public.apks;
create trigger apks_set_updated_at
  before update on public.apks
  for each row execute function public.set_updated_at();

drop trigger if exists settings_set_updated_at on public.settings;
create trigger settings_set_updated_at
  before update on public.settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------
alter table public.apks enable row level security;
alter table public.settings enable row level security;

-- Publik hanya boleh SELECT apk yang published
drop policy if exists "public_read_published_apks" on public.apks;
create policy "public_read_published_apks"
  on public.apks for select
  to anon
  using (status = 'published');

-- User yang sudah login (admin) boleh lihat semua apk termasuk draft
drop policy if exists "authenticated_read_all_apks" on public.apks;
create policy "authenticated_read_all_apks"
  on public.apks for select
  to authenticated
  using (true);

-- Hanya user login yang boleh insert/update/delete
drop policy if exists "authenticated_insert_apks" on public.apks;
create policy "authenticated_insert_apks"
  on public.apks for insert
  to authenticated
  with check (true);

drop policy if exists "authenticated_update_apks" on public.apks;
create policy "authenticated_update_apks"
  on public.apks for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "authenticated_delete_apks" on public.apks;
create policy "authenticated_delete_apks"
  on public.apks for delete
  to authenticated
  using (true);

-- Settings: publik boleh baca (perlu untuk menampilkan musik & link WA di frontend)
drop policy if exists "public_read_settings" on public.settings;
create policy "public_read_settings"
  on public.settings for select
  to anon
  using (true);

drop policy if exists "authenticated_read_settings" on public.settings;
create policy "authenticated_read_settings"
  on public.settings for select
  to authenticated
  using (true);

-- Hanya user login yang boleh update settings (tidak ada insert/delete karena singleton)
drop policy if exists "authenticated_update_settings" on public.settings;
create policy "authenticated_update_settings"
  on public.settings for update
  to authenticated
  using (true)
  with check (true);

-- =========================================================
-- Storage buckets
-- Jalankan bagian ini juga di SQL Editor, atau buat manual
-- lewat Dashboard > Storage jika lebih nyaman.
-- =========================================================
insert into storage.buckets (id, name, public)
values ('apk-media', 'apk-media', true)
on conflict (id) do nothing;

-- Publik boleh melihat/mendownload file di bucket (thumbnail, screenshot, musik)
drop policy if exists "public_read_apk_media" on storage.objects;
create policy "public_read_apk_media"
  on storage.objects for select
  to anon
  using (bucket_id = 'apk-media');

drop policy if exists "authenticated_read_apk_media" on storage.objects;
create policy "authenticated_read_apk_media"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'apk-media');

-- Hanya user login yang boleh upload/update/hapus file
drop policy if exists "authenticated_upload_apk_media" on storage.objects;
create policy "authenticated_upload_apk_media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'apk-media');

drop policy if exists "authenticated_update_apk_media" on storage.objects;
create policy "authenticated_update_apk_media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'apk-media');

drop policy if exists "authenticated_delete_apk_media" on storage.objects;
create policy "authenticated_delete_apk_media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'apk-media');
