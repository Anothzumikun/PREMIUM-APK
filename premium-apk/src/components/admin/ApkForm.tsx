"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Loader2, Trash2 } from "lucide-react";
import { apkSchema, type ApkFormValues } from "@/lib/validations";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import FileUpload from "./FileUpload";
import MultiImageUpload from "./MultiImageUpload";
import type { Apk } from "@/lib/types";

const categories = [
  "Produktivitas",
  "Hiburan",
  "Utilitas",
  "Edukasi",
  "Game",
  "Lainnya",
];

export default function ApkForm({ initialData }: { initialData?: Apk }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const isEdit = Boolean(initialData);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ApkFormValues>({
    resolver: zodResolver(apkSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          slug: initialData.slug,
          description: initialData.description,
          version: initialData.version,
          size_label: initialData.size_label,
          category: initialData.category || "Lainnya",
          thumbnail_url: initialData.thumbnail_url || "",
          screenshots: initialData.screenshots || [],
          download_url: initialData.download_url,
          status: initialData.status,
        }
      : {
          name: "",
          slug: "",
          description: "",
          version: "1.0.0",
          size_label: "",
          category: "Lainnya",
          thumbnail_url: "",
          screenshots: [],
          download_url: "",
          status: "draft",
        },
  });

  const nameValue = watch("name");

  function handleNameBlur() {
    if (!isEdit && nameValue) {
      setValue("slug", slugify(nameValue));
    }
  }

  async function onSubmit(values: ApkFormValues) {
    setLoading(true);

    if (isEdit && initialData) {
      const { error } = await supabase
        .from("apks")
        .update(values)
        .eq("id", initialData.id);

      setLoading(false);
      if (error) {
        toast.error(`Gagal menyimpan: ${error.message}`);
        return;
      }
      toast.success("Perubahan disimpan");
    } else {
      const { error } = await supabase.from("apks").insert(values);
      setLoading(false);
      if (error) {
        toast.error(`Gagal menambah: ${error.message}`);
        return;
      }
      toast.success("Aplikasi ditambahkan");
    }

    router.push("/admin/apks");
    router.refresh();
  }

  async function handleDelete() {
    if (!initialData) return;
    if (!confirm(`Hapus "${initialData.name}"? Tindakan ini tidak bisa dibatalkan.`)) return;

    setDeleting(true);
    const { error } = await supabase.from("apks").delete().eq("id", initialData.id);
    setDeleting(false);

    if (error) {
      toast.error(`Gagal menghapus: ${error.message}`);
      return;
    }
    toast.success("Aplikasi dihapus");
    router.push("/admin/apks");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block font-body text-sm text-ink-300">
            Nama Aplikasi
          </label>
          <input
            {...register("name")}
            onBlur={handleNameBlur}
            className="w-full rounded-lg border border-base-700 bg-base-900 px-3.5 py-2.5 font-body text-sm text-ink-100 outline-none focus:border-accent-indigo"
            placeholder="Contoh: Catatan Kilat"
          />
          {errors.name && (
            <p className="mt-1 font-body text-xs text-red-400">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block font-body text-sm text-ink-300">
            Slug (URL)
          </label>
          <input
            {...register("slug")}
            className="w-full rounded-lg border border-base-700 bg-base-900 px-3.5 py-2.5 font-mono text-sm text-ink-100 outline-none focus:border-accent-indigo"
            placeholder="catatan-kilat"
          />
          {errors.slug && (
            <p className="mt-1 font-body text-xs text-red-400">{errors.slug.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block font-body text-sm text-ink-300">Deskripsi</label>
        <textarea
          {...register("description")}
          rows={5}
          className="w-full rounded-lg border border-base-700 bg-base-900 px-3.5 py-2.5 font-body text-sm text-ink-100 outline-none focus:border-accent-indigo"
          placeholder="Jelaskan fitur dan kegunaan aplikasi ini..."
        />
        {errors.description && (
          <p className="mt-1 font-body text-xs text-red-400">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block font-body text-sm text-ink-300">Versi</label>
          <input
            {...register("version")}
            className="w-full rounded-lg border border-base-700 bg-base-900 px-3.5 py-2.5 font-mono text-sm text-ink-100 outline-none focus:border-accent-indigo"
            placeholder="1.0.0"
          />
          {errors.version && (
            <p className="mt-1 font-body text-xs text-red-400">{errors.version.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block font-body text-sm text-ink-300">
            Ukuran File
          </label>
          <input
            {...register("size_label")}
            className="w-full rounded-lg border border-base-700 bg-base-900 px-3.5 py-2.5 font-mono text-sm text-ink-100 outline-none focus:border-accent-indigo"
            placeholder="85 MB"
          />
          {errors.size_label && (
            <p className="mt-1 font-body text-xs text-red-400">
              {errors.size_label.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block font-body text-sm text-ink-300">
            Kategori
          </label>
          <select
            {...register("category")}
            className="w-full rounded-lg border border-base-700 bg-base-900 px-3.5 py-2.5 font-body text-sm text-ink-100 outline-none focus:border-accent-indigo"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block font-body text-sm text-ink-300">
          Link Download
        </label>
        <input
          {...register("download_url")}
          className="w-full rounded-lg border border-base-700 bg-base-900 px-3.5 py-2.5 font-body text-sm text-ink-100 outline-none focus:border-accent-indigo"
          placeholder="https://..."
        />
        {errors.download_url && (
          <p className="mt-1 font-body text-xs text-red-400">
            {errors.download_url.message}
          </p>
        )}
      </div>

      <Controller
        control={control}
        name="thumbnail_url"
        render={({ field }) => (
          <FileUpload
            label="Thumbnail"
            accept="image/*"
            preview="image"
            value={field.value || null}
            onChange={(url) => field.onChange(url || "")}
            folder="thumbnails"
          />
        )}
      />
      {errors.thumbnail_url && (
        <p className="-mt-4 font-body text-xs text-red-400">
          {errors.thumbnail_url.message}
        </p>
      )}

      <Controller
        control={control}
        name="screenshots"
        render={({ field }) => (
          <MultiImageUpload values={field.value} onChange={field.onChange} />
        )}
      />

      <div>
        <label className="mb-1.5 block font-body text-sm text-ink-300">Status</label>
        <div className="flex gap-3">
          {(["draft", "published"] as const).map((s) => (
            <label
              key={s}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-base-700 px-3.5 py-2 has-[:checked]:border-accent-indigo has-[:checked]:bg-accent-indigo/10"
            >
              <input type="radio" value={s} {...register("status")} className="accent-accent-indigo" />
              <span className="font-body text-sm capitalize text-ink-100">
                {s === "published" ? "Published" : "Draft"}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-base-800 pt-5">
        {isEdit ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-1.5 font-body text-sm text-red-400 hover:text-red-300"
          >
            {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Hapus aplikasi
          </button>
        ) : (
          <span />
        )}

        <button type="submit" disabled={loading} className="btn-primary">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isEdit ? "Simpan Perubahan" : "Tambah Aplikasi"}
        </button>
      </div>
    </form>
  );
}
