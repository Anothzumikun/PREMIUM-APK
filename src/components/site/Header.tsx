import Link from "next/link";

export default function Header({ siteName }: { siteName: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-base-800/80 bg-base-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-gradient font-display text-sm font-bold text-white shadow-glow">
            P
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-ink-100">
            {siteName}
          </span>
        </Link>

        <nav className="flex items-center gap-6 font-body text-sm text-ink-300">
          <Link href="/" className="transition-colors hover:text-ink-100">
            Katalog
          </Link>
        </nav>
      </div>
    </header>
  );
}
