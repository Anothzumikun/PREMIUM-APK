export default function Footer({ siteName }: { siteName: string }) {
  return (
    <footer className="border-t border-base-800/80 py-10">
      <div className="mx-auto max-w-6xl px-5 text-center font-mono text-xs text-ink-500 sm:px-8">
        © {new Date().getFullYear()} {siteName}. Dibuat & dirawat secara independen.
      </div>
    </footer>
  );
}
