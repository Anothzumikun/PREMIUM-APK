import { z } from "zod";

export const apkSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(100),
  slug: z
    .string()
    .min(2, "Slug minimal 2 karakter")
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda -"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  version: z.string().min(1, "Versi wajib diisi"),
  size_label: z.string().min(1, "Ukuran file wajib diisi"),
  category: z.string().min(1, "Kategori wajib diisi"),
  thumbnail_url: z.string().url("Thumbnail wajib diupload").or(z.literal("")),
  screenshots: z.array(z.string().url()).default([]),
  download_url: z.string().url("Link download tidak valid"),
  status: z.enum(["published", "draft"]),
});

export type ApkFormValues = z.infer<typeof apkSchema>;

export const settingsSchema = z.object({
  site_name: z.string().min(2, "Nama situs minimal 2 karakter"),
  site_description: z.string().min(5, "Deskripsi minimal 5 karakter"),
  whatsapp_link: z
    .string()
    .refine(
      (val) => val === "" || /^https:\/\/wa\.me\/\d{8,15}$/.test(val),
      "Format harus https://wa.me/62xxxxxxxxxx"
    ),
  music_enabled: z.boolean(),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
