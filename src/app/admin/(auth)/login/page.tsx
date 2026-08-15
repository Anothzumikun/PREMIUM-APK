"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { loginSchema, type LoginFormValues } from "@/lib/validations";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginFormValues) {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    setLoading(false);

    if (error) {
      toast.error("Email atau password salah");
      return;
    }

    toast.success("Berhasil masuk");
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-5">
      <div className="card-surface w-full max-w-sm rounded-xl2 p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-accent-gradient shadow-glow">
            <Lock className="h-5 w-5 text-white" />
          </span>
          <h1 className="font-display text-lg font-semibold text-ink-100">
            Masuk Admin
          </h1>
          <p className="mt-1 font-body text-sm text-ink-500">
            Kelola katalog PREMIUM APK
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block font-body text-sm text-ink-300">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full rounded-lg border border-base-700 bg-base-900 px-3.5 py-2.5 font-body text-sm text-ink-100 outline-none transition-colors focus:border-accent-indigo"
              placeholder="admin@email.com"
            />
            {errors.email && (
              <p className="mt-1 font-body text-xs text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block font-body text-sm text-ink-300">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              className="w-full rounded-lg border border-base-700 bg-base-900 px-3.5 py-2.5 font-body text-sm text-ink-100 outline-none transition-colors focus:border-accent-indigo"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 font-body text-xs text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          <button type="submit" disabled={loading} className="btn-primary mt-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}
