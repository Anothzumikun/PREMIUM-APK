import ApkForm from "@/components/admin/ApkForm";

export default function NewApkPage() {
  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-semibold text-ink-100">
        Tambah Aplikasi
      </h1>
      <p className="mb-6 font-body text-sm text-ink-500">
        Isi detail aplikasi yang akan ditampilkan di katalog
      </p>
      <ApkForm />
    </div>
  );
}
