"use client";

import { useMemo, useState } from "react";
import ApkCard from "./ApkCard";
import EmptyState from "./EmptyState";
import type { Apk } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";

export default function ApkGrid({ apks }: { apks: Apk[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [query, setQuery] = useState("");

  const categories = useMemo(() => {
    const set = new Set(apks.map((a) => a.category || "Umum"));
    return ["Semua", ...Array.from(set)];
  }, [apks]);

  const filtered = useMemo(() => {
    let result = apks;

    if (activeCategory !== "Semua") {
      result = result.filter((a) => (a.category || "Umum") === activeCategory);
    }

    const q = query.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          (a.category || "").toLowerCase().includes(q)
      );
    }

    return result;
  }, [apks, activeCategory, query]);

  if (apks.length === 0) {
    return (
      <EmptyState
        title="Belum ada aplikasi"
        description="Katalog masih kosong. Tambahkan aplikasi pertama lewat admin panel."
      />
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari aplikasi..."
            className="w-full rounded-full border border-base-800 bg-base-900/70 py-2.5 pl-10 pr-9 font-body text-sm text-ink-100 outline-none transition-colors focus:border-accent-indigo/60"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-100"
              aria-label="Hapus pencarian"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "rounded-full border px-4 py-1.5 font-body text-sm transition-colors",
                activeCategory === cat
                  ? "border-accent-indigo/60 bg-accent-indigo/10 text-ink-100"
                  : "border-base-800 text-ink-500 hover:border-base-600 hover:text-ink-300"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="Tidak ditemukan"
          description={
            query
              ? `Tidak ada aplikasi yang cocok dengan "${query}".`
              : "Coba pilih kategori lain."
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {filtered.map((apk, i) => (
            <ApkCard key={apk.id} apk={apk} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
