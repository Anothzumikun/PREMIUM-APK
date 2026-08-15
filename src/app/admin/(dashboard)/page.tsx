import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Package, Eye, FileEdit, Plus } from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = createClient();
  const { data: apks } = await supabase.from("apks").select("status");

  const total = apks?.length || 0;
  const published = apks?.filter((a) => a.status === "published").length || 0;
  const draft = apks?.filter((a) => a.status === "draft").length || 0;

  const stats = [
    { label: "Total Aplikasi", value: total, icon: Package },
    { label: "Published", value: published, icon: Eye },
    { label: "Draft", value: draft, icon: FileEdit },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-100">
            Dashboard
          </h1>
          <p className="mt-1 font-body text-sm text-ink-500">
            Ringkasan katalog PREMIUM APK
          </p>
        </div>
        <Link href="/admin/apks/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          Tambah Aplikasi
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="card-surface rounded-xl2 p-5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-accent-indigo/10">
              <stat.icon className="h-[18px] w-[18px] text-accent-sky" />
            </div>
            <p className="font-display text-2xl font-semibold text-ink-100">
              {stat.value}
            </p>
            <p className="font-body text-sm text-ink-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
