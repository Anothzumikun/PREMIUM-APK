import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ApkForm from "@/components/admin/ApkForm";

export const dynamic = "force-dynamic";

export default async function EditApkPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: apk } = await supabase.from("apks").select("*").eq("id", params.id).single();

  if (!apk) notFound();

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-semibold text-ink-100">
        Edit Aplikasi
      </h1>
      <p className="mb-6 font-body text-sm text-ink-500">{apk.name}</p>
      <ApkForm initialData={apk} />
    </div>
  );
}
