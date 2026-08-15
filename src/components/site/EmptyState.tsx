import { PackageOpen } from "lucide-react";

export default function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl2 border border-dashed border-base-800 py-20 text-center">
      <PackageOpen className="mb-4 h-10 w-10 text-base-600" />
      <h3 className="font-display text-lg font-medium text-ink-100">{title}</h3>
      <p className="mt-1 max-w-sm font-body text-sm text-ink-500">{description}</p>
    </div>
  );
}
