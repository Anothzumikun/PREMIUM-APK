"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

export default function MultiImageUpload({
  values,
  onChange,
}: {
  values: string[];
  onChange: (urls: string[]) => void;
}) {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  async function handleFiles(files: FileList) {
    setLoading(true);
    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `screenshots/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage
        .from("apk-media")
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (error) {
        toast.error(`Gagal upload salah satu gambar: ${error.message}`);
        continue;
      }
      const { data } = supabase.storage.from("apk-media").getPublicUrl(path);
      uploaded.push(data.publicUrl);
    }

    onChange([...values, ...uploaded]);
    setLoading(false);
    if (uploaded.length) toast.success(`${uploaded.length} gambar diupload`);
  }

  function removeAt(index: number) {
    onChange(values.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label className="mb-1.5 block font-body text-sm text-ink-300">
        Screenshots (bisa lebih dari satu)
      </label>

      {values.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {values.map((url, i) => (
            <div
              key={url}
              className="relative h-24 w-24 overflow-hidden rounded-lg border border-base-700"
            >
              <Image src={url} alt={`screenshot ${i + 1}`} fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute right-1 top-1 rounded-full bg-base-950/80 p-1 text-ink-100"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <button
        type="button"
        disabled={loading}
        onClick={() => inputRef.current?.click()}
        className="btn-secondary w-fit text-sm"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        Tambah screenshot
      </button>
    </div>
  );
}
