import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Download, Calendar, Tag, HardDrive } from "lucide-react";
import Screenshots from "@/components/site/Screenshots";
import Footer from "@/components/site/Footer";
import { formatDate } from "@/lib/utils";

export const revalidate = 30;

async function getApk(slug: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("apks")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const apk = await getApk(params.slug);
  if (!apk) return { title: "Aplikasi tidak ditemukan" };

  return {
    title: apk.name,
    description: apk.description.slice(0, 155),
    openGraph: {
      title: apk.name,
      description: apk.description.slice(0, 155),
      images: apk.thumbnail_url ? [apk.thumbnail_url] : [],
    },
  };
}

export default async function ApkDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const apk = await getApk(params.slug);
  if (!apk) notFound();

  return (
    <>
      <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-12">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 font-body text-sm text-ink-500 transition-colors hover:text-ink-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke katalog
        </Link>

        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-xl2 border border-base-800 bg-base-900 sm:h-44 sm:w-44">
            {apk.thumbnail_url && (
              <Image
                src={apk.thumbnail_url}
                alt={apk.name}
                fill
                sizes="176px"
                className="object-cover"
              />
            )}
          </div>

          <div className="flex flex-1 flex-col justify-center">
            {apk.category && <p className="label-eyebrow mb-2">{apk.category}</p>}
            <h1 className="font-display text-2xl font-semibold text-ink-100 sm:text-3xl">
              {apk.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs text-ink-500">
              <span className="flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" /> v{apk.version}
              </span>
              <span className="flex items-center gap-1.5">
                <HardDrive className="h-3.5 w-3.5" /> {apk.size_label}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> {formatDate(apk.updated_at)}
              </span>
            </div>

            <a
              href={apk.download_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-6 w-full sm:w-fit"
            >
              <Download className="h-5 w-5" />
              Download Sekarang
            </a>
          </div>
        </div>

        {apk.screenshots?.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-4 font-display text-lg font-semibold text-ink-100">
              Preview
            </h2>
            <Screenshots images={apk.screenshots} name={apk.name} />
          </div>
        )}

        <div className="mt-10">
          <h2 className="mb-3 font-display text-lg font-semibold text-ink-100">
            Deskripsi
          </h2>
          <p className="whitespace-pre-line font-body text-sm leading-relaxed text-ink-300">
            {apk.description}
          </p>
        </div>
      </div>

      <Footer siteName="PREMIUM APK" />
    </>
  );
}
