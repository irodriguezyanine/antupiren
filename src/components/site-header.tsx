"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/matrimonios", label: "Matrimonios" },
  { href: "/eventos-corporativos", label: "Corporativos" },
  { href: "/celebraciones-sociales", label: "Sociales" },
  { href: "/activaciones-de-marca", label: "Activaciones" },
  { href: "/galeria", label: "Galería" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-amber-100/70 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-sm font-semibold tracking-wide text-amber-900">
          Eventos Antupirén
        </Link>
        <nav className="hidden gap-4 md:flex">
          {links.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm transition ${
                  active ? "font-semibold text-amber-900" : "text-zinc-600 hover:text-amber-800"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
