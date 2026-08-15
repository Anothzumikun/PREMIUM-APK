import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import { Toaster } from "react-hot-toast";
import Header from "@/components/site/Header";
import FloatingDock from "@/components/site/FloatingDock";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createClient();
  const { data: settings } = await supabase
    .from("settings")
    .select("site_name, site_description")
    .single();

  const siteName = settings?.site_name || "PREMIUM APK";
  const description =
    settings?.site_description ||
    "Katalog aplikasi original — jelajahi, lihat detail, dan download langsung.";

  return {
    title: {
      default: siteName,
      template: `%s · ${siteName}`,
    },
    description,
    openGraph: {
      title: siteName,
      description,
      type: "website",
      locale: "id_ID",
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: settings } = await supabase
    .from("settings")
    .select("*")
    .single();

  return (
    <html lang="id" className="dark">
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} font-body`}
      >
        <Header siteName={settings?.site_name || "PREMIUM APK"} />
        <main className="min-h-dvh">{children}</main>
        <FloatingDock
          whatsappLink={settings?.whatsapp_link || ""}
          musicUrl={settings?.music_enabled ? settings?.music_url : null}
        />
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#1c1c24",
              color: "#f4f4f6",
              border: "1px solid #2a2a35",
              fontSize: "14px",
            },
          }}
        />
      </body>
    </html>
  );
}
