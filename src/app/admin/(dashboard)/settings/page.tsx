"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { settingsSchema } from "@/lib/validations";
import { z } from "zod";
import FileUpload from "@/components/admin/FileUpload";

const formSchema = settingsSchema.pick({ site_name: true, site_description: true });
type FormValues = z.infer<typeof formSchema>;

export default function AdminSettingsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("settings").select("*").single();
      if (data) {
        reset({
          site_name: data.site_name,
          site_description: data.site_description,
        });
        setBannerUrl(data.banner_url || null);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function saveBanner(url: string | null) {
    setBannerUrl(url);
    const { error } = await supabase
      .from("settings")
      .update({ banner_url: url })
      .eq("id", 1);

    if (error) {
      toast.error(`Gagal menyimpan banner: ${error.message}`);
      return;
    }
    toast.success(url ? "Banner diperbarui" : "Banner dihapus, kembali ke judul teks");
  }

  async function onSubmit(values: FormValues) {
    setSaving(true);
    const { error } = await supabase.from("settings").update(values).eq("id", 1);
    setSaving(false);

    if (error) {
      toast.error(`Gagal menyimpan: ${error.message}`);
      return;
    }
    toast.success("Pengaturan disimpan");
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 font-body text-sm text-ink-500">
        <Loader2 className="h-4 w-4 animate-spin" /> Memuat...
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <h1 className="mb-1 font-display text-2xl font-semibold text-ink-100">
        Pengaturan Website
      </h1>
      <p className="mb-6 font-body text-sm text-ink-500">
        Nama dan deskripsi ini dipakai untuk judul tab browser dan SEO
      </p>

      <div className="card-surface mb-5 flex flex-col gap-2 rounded-xl2 p-6">
        <FileUpload
          label="Banner Beranda"
          accept="image/*"
          preview="image"
          value={bannerUrl}
          onChange={saveBanner}
          folder="banner"
        />
        <p className="font-body text-xs text-ink-500">
          Kalau diisi, banner ini menggantikan judul teks di halaman utama.
          Rekomendasi ukuran lebar, misal 1600×500px. Hapus gambar untuk kembali
          ke tampilan judul teks.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card-surface flex flex-col gap-4 rounded-xl2 p-6"
      >
        <div>
          <label className="mb-1.5 block font-body text-sm text-ink-300">
            Nama Website
          </label>
          <input
            {...register("site_name")}
            className="w-full rounded-lg border border-base-700 bg-base-900 px-3.5 py-2.5 font-body text-sm text-ink-100 outline-none focus:border-accent-indigo"
          />
          {errors.site_name && (
            <p className="mt-1 font-body text-xs text-red-400">
              {errors.site_name.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block font-body text-sm text-ink-300">
            Deskripsi Singkat
          </label>
          <textarea
            {...register("site_description")}
            rows={3}
            className="w-full rounded-lg border border-base-700 bg-base-900 px-3.5 py-2.5 font-body text-sm text-ink-100 outline-none focus:border-accent-indigo"
          />
          {errors.site_description && (
            <p className="mt-1 font-body text-xs text-red-400">
              {errors.site_description.message}
            </p>
          )}
        </div>

        <button type="submit" disabled={saving} className="btn-primary w-fit">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Simpan
        </button>
      </form>
    </div>
  );
}
