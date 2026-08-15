# PREMIUM APK

Katalog aplikasi original — Next.js 14 (App Router) + TypeScript + Tailwind CSS + Supabase.

Pengunjung bisa melihat, membaca detail, dan mendownload aplikasi. Semua konten
(aplikasi, screenshot, musik latar, link WhatsApp, pengaturan situs) dikelola lewat
Admin Panel.

## Tech Stack

- **Frontend:** Next.js 14 App Router, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Supabase (Auth + Postgres + Storage)
- **Form:** React Hook Form + Zod
- **Deploy:** Vercel

## Struktur Proyek

```
src/
  app/
    page.tsx                    -> Home (katalog)
    apk/[slug]/page.tsx         -> Detail APK
    admin/(auth)/login/         -> Login admin
    admin/(dashboard)/          -> Dashboard, CRUD APK, musik, WhatsApp, settings
  components/
    site/                       -> Header, ApkCard, ApkGrid, FloatingDock, dll
    admin/                      -> Sidebar, ApkForm, FileUpload
  lib/
    supabase/                   -> client.ts (browser), server.ts (server)
    types.ts, utils.ts, validations.ts
  middleware.ts                 -> proteksi route /admin
supabase/
  schema.sql                    -> jalankan ini di Supabase SQL Editor
```

---

## 1. Setup Supabase

1. Buka [supabase.com](https://supabase.com) → buat akun/login → **New Project**.
2. Tunggu project selesai dibuat (±2 menit).
3. Buka menu **SQL Editor** di sidebar kiri → **New query**.
4. Copy seluruh isi file `supabase/schema.sql` dari proyek ini, paste, lalu klik **Run**.
   Ini akan otomatis membuat:
   - Tabel `apks` dan `settings`
   - Storage bucket `apk-media` (untuk thumbnail, screenshot, musik)
   - Semua Row Level Security (RLS) policy yang aman (publik hanya bisa lihat APK
     berstatus `published`, hanya user login yang bisa tambah/edit/hapus)
5. Buat akun admin: buka menu **Authentication → Users → Add user**, isi email dan
   password. Akun inilah yang dipakai login ke `/admin`.
6. Ambil kredensial API: buka **Project Settings → API**. Catat:
   - `Project URL`
   - `anon public` key
   - `service_role` key (rahasia, jangan disebar)

## 2. Environment Variables

Copy `.env.example` menjadi `.env.local`, lalu isi dengan kredensial dari langkah di atas:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=isi-anon-key
SUPABASE_SERVICE_ROLE_KEY=isi-service-role-key
NEXT_PUBLIC_SITE_NAME="PREMIUM APK"
NEXT_PUBLIC_SITE_URL=https://premium-apk.vercel.app
```

## 3. Upload ke GitHub (dari HP)

Karena kamu kerja dari HP, cara paling praktis adalah lewat **GitHub Codespaces**:

1. Extract file zip proyek ini di HP.
2. Buka [github.com](https://github.com) → buat repo baru, misal `premium-apk` (kosong,
   jangan centang "Add README").
3. Di aplikasi GitHub (mobile browser, desktop mode lebih enak) buka repo tersebut →
   klik **Code → Codespaces → Create codespace on main**.
   Codespace ini adalah VS Code penuh yang jalan di browser, bisa diakses dari HP.
4. Di dalam Codespace, upload semua file proyek (drag & drop lewat file explorer, atau
   pakai terminal `git clone`/`unzip` kalau kamu upload zip ke Codespace dulu).
5. Di terminal Codespace, jalankan:
   ```bash
   npm install
   ```
6. Commit & push:
   ```bash
   git add .
   git commit -m "Initial commit: PREMIUM APK"
   git push origin main
   ```

## 4. Deploy ke Vercel

1. Buka [vercel.com](https://vercel.com) → login pakai akun GitHub.
2. **Add New → Project** → pilih repo `premium-apk`.
3. Saat konfigurasi, buka bagian **Environment Variables**, tambahkan 5 variable yang
   sama seperti di `.env.local` (copy dari file itu).
4. Klik **Deploy**. Tunggu 1-2 menit sampai selesai.
5. Vercel akan kasih URL seperti `premium-apk.vercel.app` — website sudah live.

Setiap kali kamu `git push` perubahan baru, Vercel otomatis build & deploy ulang.

## 5. Pakai Admin Panel

1. Buka `https://domain-kamu.vercel.app/admin/login`
2. Login pakai email & password yang dibuat di langkah Supabase Authentication.
3. Dari dashboard:
   - **Aplikasi** → tambah/edit/hapus APK, upload thumbnail & screenshot, atur status
     Published/Draft (draft tidak tampil di publik)
   - **Musik** → upload MP3 dan aktifkan/nonaktifkan musik latar global
   - **WhatsApp** → atur link `https://wa.me/62xxxxxxxxxx` untuk tombol Customer Service
   - **Pengaturan** → nama & deskripsi website (untuk SEO)

Semua perubahan langsung aktif di halaman publik (revalidate tiap 30 detik, atau
langsung saat halaman di-refresh).

## Development Lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Catatan Keamanan

- `SUPABASE_SERVICE_ROLE_KEY` tidak dipakai di kode saat ini (semua write lewat
  client dengan RLS + auth session), tapi tetap disiapkan di `.env.example` untuk
  kebutuhan server action di masa depan. Jangan pernah expose key ini ke browser.
- RLS memastikan publik (belum login) hanya bisa membaca APK berstatus `published`
  dan tidak bisa insert/update/delete apa pun.
