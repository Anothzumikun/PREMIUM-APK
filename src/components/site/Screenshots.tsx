"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function Screenshots({ images, name }: { images: string[]; name: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  return (
    <div>
      <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:thin]">
        {images.map((src, i) => (
          <button
            key={src}
            onClick={() => setOpenIndex(i)}
            className="relative h-48 w-28 shrink-0 overflow-hidden rounded-lg border border-base-800 transition-colors hover:border-accent-indigo/50 sm:h-64 sm:w-36"
          >
            <Image
              src={src}
              alt={`${name} — screenshot ${i + 1}`}
              fill
              sizes="150px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-base-950/95 p-4 backdrop-blur-sm"
          onClick={() => setOpenIndex(null)}
        >
          <button
            className="absolute right-5 top-5 rounded-full border border-base-700 bg-base-900 p-2 text-ink-100"
            onClick={() => setOpenIndex(null)}
            aria-label="Tutup"
          >
            <X className="h-5 w-5" />
          </button>

          {openIndex > 0 && (
            <button
              className="absolute left-3 rounded-full border border-base-700 bg-base-900 p-2 text-ink-100 sm:left-8"
              onClick={(e) => {
                e.stopPropagation();
                setOpenIndex(openIndex - 1);
              }}
              aria-label="Sebelumnya"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          <div
            className="relative h-[70vh] w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[openIndex]}
              alt={`${name} — screenshot ${openIndex + 1}`}
              fill
              sizes="400px"
              className="object-contain"
            />
          </div>

          {openIndex < images.length - 1 && (
            <button
              className="absolute right-3 rounded-full border border-base-700 bg-base-900 p-2 text-ink-100 sm:right-8"
              onClick={(e) => {
                e.stopPropagation();
                setOpenIndex(openIndex + 1);
              }}
              aria-label="Selanjutnya"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
