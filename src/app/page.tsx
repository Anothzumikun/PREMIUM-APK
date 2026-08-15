import { createClient } from "@/lib/supabase/server";
import ApkGrid from "@/components/site/ApkGrid";
import Footer from "@/components/site/Footer";
import Image from "next/image";
import type { Apk } from "@/lib/types";

export const revalidate = 30;

export default async function HomePage() {
  const supabase = createClient();

  const [{ data: apks }, { data: settings }] = await Promise.all([
    supabase
      .from("apks")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false }),
    supabase.from("settings").select("site_name, banner_url").single(),
  ]);

  const list = (apks || []) as Apk[];
  const bannerUrl = settings?.banner_url as string | null | undefined;

  return (
    <>
      <section className="relative overflow-hidden border-b border-base-800/60">
        {bannerUrl ? (
          <div className="relative h-48 w-full sm:h-64 lg:h-80">
            <Image
              src={bannerUrl}
              alt="Banner"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-base-950 to-transparent" />
          </div>
        ) : (
          <>
            <div className="pointer-events-none absolute inset-0 bg-glow-radial" />
            <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
              <p className="label-eyebrow mb-4">Katalog Aplikasi Original</p>
              <h1 className="max-w-2xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink-100 sm:text-5xl">
                Kumpulan aplikasi buatan sendiri,{" "}
                <span className="bg-accent-gradient bg-clip-text text-transparent">
                  siap dipakai
                </span>
                .
              </h1>
              <p className="mt-5 max-w-lg font-body text-base leading-relaxed text-ink-300">
                Setiap aplikasi di sini dikembangkan, diuji, dan dirawat langsung.
                Lihat detail, cek preview, lalu download — tanpa basa-basi.
              </p>
            </div>
          </>
        )}

        <div className="relative mx-auto max-w-6xl px-5 py-6 sm:px-8">
          <div className="flex items-center gap-6 font-mono text-sm text-ink-500">
            <div>
              <span className="text-xl font-medium text-ink-100">{list.length}</span>
              <span className="ml-1.5">aplikasi</span>
            </div>
            <div className="h-8 w-px bg-base-800" />
            <div>
              <span className="text-xl font-medium text-ink-100">
                {new Set(list.map((a) => a.category || "Umum")).size}
              </span>
              <span className="ml-1.5">kategori</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <ApkGrid apks={list} />
      </section>

      <Footer siteName={settings?.site_name || "PREMIUM APK"} />
    </>
  );
}
