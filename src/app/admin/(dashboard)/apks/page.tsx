import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { Plus, Package } from "lucide-react";
import type { Apk } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminApksPage() {
  const supabase = createClient();
  const { data: apks } = await supabase
    .from("apks")
    .select("*")
    .order("created_at", { ascending: false });

  const list = (apks || []) as Apk[];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-100">Aplikasi</h1>
          <p className="mt-1 font-body text-sm text-ink-500">
            Kelola semua aplikasi di katalog
          </p>
        </div>
        <Link href="/admin/apks/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          Tambah Aplikasi
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl2 border border-dashed border-base-800 py-20 text-center">
          <Package className="mb-3 h-9 w-9 text-base-600" />
          <p className="font-body text-sm text-ink-500">Belum ada aplikasi ditambahkan.</p>
        </div>
      ) : (
        <div className="card-surface overflow-hidden rounded-xl2">
          {list.map((apk, i) => (
            <Link
              key={apk.id}
              href={`/admin/apks/${apk.id}/edit`}
              className={`flex items-center gap-4 px-5 py-4 transition-colors hover:bg-base-800/50 ${
                i !== 0 ? "border-t border-base-800" : ""
              }`}
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-base-800 bg-base-900">
                {apk.thumbnail_url && (
                  <Image src={apk.thumbnail_url} alt={apk.name} fill className="object-cover" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-body text-sm font-medium text-ink-100">
                  {apk.name}
                </p>
                <p className="font-mono text-xs text-ink-500">
                  v{apk.version} · {apk.size_label}
                </p>
              </div>

              <span
                className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-xs ${
                  apk.status === "published"
                    ? "bg-green-500/10 text-green-400"
                    : "bg-base-700 text-ink-500"
                }`}
              >
                {apk.status}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
