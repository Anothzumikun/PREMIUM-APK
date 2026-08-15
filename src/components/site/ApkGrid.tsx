"use client";

import { useMemo, useState } from "react";
import ApkCard from "./ApkCard";
import EmptyState from "./EmptyState";
import type { Apk } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function ApkGrid({ apks }: { apks: Apk[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("Semua");

  const categories = useMemo(() => {
    const set = new Set(apks.map((a) => a.category || "Umum"));
    return ["Semua", ...Array.from(set)];
  }, [apks]);

  const filtered = useMemo(() => {
    if (activeCategory === "Semua") return apks;
    return apks.filter((a) => (a.category || "Umum") === activeCategory);
  }, [apks, activeCategory]);

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
      <div className="mb-8 flex flex-wrap gap-2">
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

      {filtered.length === 0 ? (
        <EmptyState
          title="Tidak ada di kategori ini"
          description="Coba pilih kategori lain."
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
