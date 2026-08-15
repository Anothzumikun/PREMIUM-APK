"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import FileUpload from "@/components/admin/FileUpload";
import type { SiteSettings } from "@/lib/types";

export default function AdminMusicPage() {
  const supabase = createClient();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("settings").select("*").single();
      setSettings(data);
      setLoading(false);
    }
    load();
  }, []);

  async function save(updates: Partial<SiteSettings>) {
    if (!settings) return;
    setSaving(true);
    const merged = { ...settings, ...updates };
    setSettings(merged);

    const { error } = await supabase
      .from("settings")
      .update(updates)
      .eq("id", 1);

    setSaving(false);
    if (error) {
      toast.error(`Gagal menyimpan: ${error.message}`);
      return;
    }
    toast.success("Pengaturan musik disimpan");
  }

  if (loading || !settings) {
    return (
      <div className="flex items-center gap-2 font-body text-sm text-ink-500">
        <Loader2 className="h-4 w-4 animate-spin" /> Memuat...
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <h1 className="mb-1 font-display text-2xl font-semibold text-ink-100">Musik</h1>
      <p className="mb-6 font-body text-sm text-ink-500">
        Musik latar akan diputar otomatis di seluruh halaman website (volume rendah,
        pengunjung bisa jeda kapan saja)
      </p>

      <div className="card-surface flex flex-col gap-5 rounded-xl2 p-6">
        <FileUpload
          label="File Musik (MP3)"
          accept="audio/mp3,audio/mpeg"
          preview="audio"
          value={settings.music_url}
          onChange={(url) => save({ music_url: url })}
          folder="music"
        />

        <label className="flex cursor-pointer items-center justify-between rounded-lg border border-base-700 px-4 py-3">
          <span className="font-body text-sm text-ink-100">Aktifkan musik latar</span>
          <input
            type="checkbox"
            checked={settings.music_enabled}
            disabled={saving || !settings.music_url}
            onChange={(e) => save({ music_enabled: e.target.checked })}
            className="h-4 w-4 accent-accent-indigo"
          />
        </label>
        {!settings.music_url && (
          <p className="-mt-3 font-body text-xs text-ink-500">
            Upload file musik terlebih dahulu untuk mengaktifkan.
          </p>
        )}
      </div>
    </div>
  );
}
