"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

interface FileUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  folder: string;
  accept: string;
  label: string;
  preview?: "image" | "audio" | "none";
}

export default function FileUpload({
  value,
  onChange,
  folder,
  accept,
  label,
  preview = "image",
}: FileUploadProps) {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  async function handleFile(file: File) {
    setLoading(true);
    const ext = file.name.split(".").pop();
    const path = `${folder}/${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage
      .from("apk-media")
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (error) {
      toast.error(`Gagal upload: ${error.message}`);
      setLoading(false);
      return;
    }

    const { data } = supabase.storage.from("apk-media").getPublicUrl(path);
    onChange(data.publicUrl);
    setLoading(false);
    toast.success("File berhasil diupload");
  }

  return (
    <div>
      <label className="mb-1.5 block font-body text-sm text-ink-300">{label}</label>

      {value && preview === "image" && (
        <div className="relative mb-2 h-28 w-28 overflow-hidden rounded-lg border border-base-700">
          <Image src={value} alt="preview" fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute right-1 top-1 rounded-full bg-base-950/80 p-1 text-ink-100"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {value && preview === "audio" && (
        <div className="mb-2 flex items-center gap-3 rounded-lg border border-base-700 bg-base-900 p-2.5">
          <audio controls src={value} className="h-9 flex-1" />
          <button type="button" onClick={() => onChange(null)}>
            <X className="h-4 w-4 text-ink-500" />
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      <button
        type="button"
        disabled={loading}
        onClick={() => inputRef.current?.click()}
        className="btn-secondary w-fit text-sm"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Upload className="h-4 w-4" />
        )}
        {value ? "Ganti file" : "Upload file"}
      </button>
    </div>
  );
}
