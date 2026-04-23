import { LockKeyhole, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { isAdminAuthenticated } from "@/lib/auth";

type AdminLoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const authenticated = await isAdminAuthenticated();
  const params = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
      <section className="soft-shadow w-full rounded-2xl border border-amber-100 bg-white p-7">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-amber-900">
          <ShieldCheck size={18} />
        </div>
        <h1 className="mt-4 text-xl font-semibold text-amber-900">Panel Antupirén</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Ingresa con tus credenciales de administrador.
        </p>
        {authenticated ? (
          <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
            <p className="text-xs text-emerald-700">Ya tienes una sesión activa.</p>
            <Link
              href="/admin"
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 underline"
            >
              Ir al panel desde aquí
            </Link>
          </div>
        ) : null}
        {params.error ? (
          <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            Credenciales inválidas. Revisa email y contraseña.
          </p>
        ) : null}
        <form action="/api/admin/login" method="post" className="mt-4 space-y-3">
          <input
            name="email"
            type="email"
            required
            placeholder="Email administrador"
            className="w-full rounded-lg border border-amber-200 px-3 py-2 text-sm"
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Contraseña"
            className="w-full rounded-lg border border-amber-200 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-800"
          >
            <LockKeyhole size={14} />
            Ingresar
          </button>
        </form>
      </section>
    </main>
  );
}
