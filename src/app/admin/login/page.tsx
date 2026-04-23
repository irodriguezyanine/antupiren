import { redirect } from "next/navigation";

import { isAdminAuthenticated } from "@/lib/auth";

export default async function AdminLoginPage() {
  const authenticated = await isAdminAuthenticated();
  if (authenticated) {
    redirect("/admin");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
      <section className="w-full rounded-xl border border-amber-100 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-amber-900">Panel Antupirén</h1>
        <p className="mt-2 text-sm text-zinc-600">Ingresa con tus credenciales de administrador.</p>
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
            className="w-full rounded-full bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800"
          >
            Ingresar
          </button>
        </form>
      </section>
    </main>
  );
}
