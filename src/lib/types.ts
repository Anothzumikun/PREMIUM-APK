export type ApkStatus = "published" | "draft";

export interface Apk {
  id: string;
  slug: string;
  name: string;
  description: string;
  version: string;
  size_label: string;
  category: string | null;
  thumbnail_url: string | null;
  screenshots: string[];
  download_url: string;
  status: ApkStatus;
  created_at: string;
  updated_at: string;
}

export type ApkInput = Omit<Apk, "id" | "created_at" | "updated_at">;

export interface SiteSettings {
  id: number;
  site_name: string;
  site_description: string;
  whatsapp_link: string;
  music_url: string | null;
  music_enabled: boolean;
  social_links: Record<string, string>;
  updated_at: string;
}
