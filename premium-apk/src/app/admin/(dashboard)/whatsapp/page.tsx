"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Loader2, MessageCircle } from "lucide-react";
import type { SiteSettings } from "@/lib/types";

export default function AdminWhatsAppPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, watch } = useForm<{ whatsapp_link: string }>();

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("settings").select("*").single();
      if (data) reset({ whatsapp_link: data.whatsapp_link || "" });
      setLoading(false);
    }
    load();
  }, []);

  async function onSubmit(values: { whatsapp_link: string }) {
    const isValid =
      values.whatsapp_link === "" || /^https:\/\/wa\.me\/\d{8,15}$/.test(values.whatsapp_link);

    if (!isValid) {
      toast.error("Format harus: https://wa.me/62xxxxxxxxxx");
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from("settings")
      .update({ whatsapp_link: values.whatsapp_link })
      .eq("id", 1);
    setSaving(false);

    if (error) {
      toast.error(`Gagal menyimpan: ${error.message}`);
      return;
    }
    toast.success("Link WhatsApp diperbarui");
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
      <h1 className="mb-1 font-display text-2xl font-semibold text-ink-100">WhatsApp</h1>
      <p className="mb-6 font-body text-sm text-ink-500">
        Tombol Customer Service akan muncul di semua halaman dan langsung membuka chat ini
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="card-surface flex flex-col gap-4 rounded-xl2 p-6">
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 font-body text-sm text-ink-300">
            <MessageCircle className="h-4 w-4" /> Link WhatsApp
          </label>
          <input
            {...register("whatsapp_link")}
            className="w-full rounded-lg border border-base-700 bg-base-900 px-3.5 py-2.5 font-mono text-sm text-ink-100 outline-none focus:border-accent-indigo"
            placeholder="https://wa.me/6281234567890"
          />
          <p className="mt-1.5 font-body text-xs text-ink-500">
            Format: https://wa.me/62 diikuti nomor tanpa spasi atau tanda +
          </p>
        </div>

        {watch("whatsapp_link") && (
          <a
            href={watch("whatsapp_link")}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-xs text-accent-sky hover:underline"
          >
            Tes link ini →
          </a>
        )}

        <button type="submit" disabled={saving} className="btn-primary w-fit">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Simpan
        </button>
      </form>
    </div>
  );
}
