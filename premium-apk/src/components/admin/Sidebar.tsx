"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Package,
  Music,
  MessageCircle,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/apks", label: "Aplikasi", icon: Package },
  { href: "/admin/music", label: "Musik", icon: Music },
  { href: "/admin/whatsapp", label: "WhatsApp", icon: MessageCircle },
  { href: "/admin/settings", label: "Pengaturan", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex h-dvh w-56 shrink-0 flex-col border-r border-base-800 bg-base-900/40 px-3 py-5">
      <div className="mb-6 flex items-center gap-2 px-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-gradient font-display text-xs font-bold text-white">
          P
        </span>
        <span className="font-display text-sm font-semibold text-ink-100">
          Admin Panel
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2.5 font-body text-sm transition-colors",
                isActive
                  ? "bg-accent-indigo/15 text-ink-100"
                  : "text-ink-500 hover:bg-base-800 hover:text-ink-300"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 font-body text-sm text-ink-500 transition-colors hover:bg-base-800 hover:text-red-400"
      >
        <LogOut className="h-4 w-4" />
        Keluar
      </button>
    </aside>
  );
}
