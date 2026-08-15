import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Package } from "lucide-react";
import type { Apk } from "@/lib/types";

export default function ApkCard({ apk, index }: { apk: Apk; index: number }) {
  return (
    <Link
      href={`/apk/${apk.slug}`}
      style={{ animationDelay: `${index * 60}ms` }}
      className="group card-surface animate-fade-up opacity-0 relative flex flex-col overflow-hidden rounded-xl2 transition-all duration-300 hover:-translate-y-1 hover:border-accent-indigo/50 hover:shadow-glow"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-base-800">
        {apk.thumbnail_url ? (
          <Image
            src={apk.thumbnail_url}
            alt={apk.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-base-600">
            <Package className="h-10 w-10" />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-base-950/80 to-transparent" />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-semibold text-ink-100 line-clamp-1">
            {apk.name}
          </h3>
          <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-ink-500 transition-colors group-hover:text-accent-sky" />
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-ink-500">
          <span className="rounded-md border border-base-700 px-1.5 py-0.5">
            v{apk.version}
          </span>
          <span>{apk.size_label}</span>
        </div>
      </div>
    </Link>
  );
}
