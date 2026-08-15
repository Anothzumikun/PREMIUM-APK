import Link from "next/link";
import { PackageX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70dvh] flex-col items-center justify-center px-5 text-center">
      <PackageX className="mb-4 h-12 w-12 text-base-600" />
      <h1 className="font-display text-xl font-semibold text-ink-100">
        Aplikasi tidak ditemukan
      </h1>
      <p className="mt-2 max-w-sm font-body text-sm text-ink-500">
        Aplikasi ini mungkin sudah dihapus atau belum dipublikasikan.
      </p>
      <Link href="/" className="btn-secondary mt-6">
        Kembali ke Katalog
      </Link>
    </div>
  );
}
