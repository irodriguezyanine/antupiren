"use client";

import { Menu, MessageCircleMore, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-amber-100/70 bg-white/90 backdrop-blur-md">
      <div className="border-b border-amber-100 bg-amber-50/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 text-[11px] text-amber-900 sm:px-6">
          <p className="font-medium">Antupirén 9501, Peñalolén · Fechas limitadas 2026</p>
          <p className="hidden sm:block">Respuesta rápida por WhatsApp</p>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <Image
            src="/logo-antupiren.png"
            alt="Logo Eventos Antupirén"
            width={34}
            height={34}
            className="h-8 w-8 rounded-sm object-contain transition-transform group-hover:scale-105"
            priority
          />
          <span className="text-sm font-semibold tracking-wide text-amber-900">
            Eventos Antupirén
          </span>
        </Link>
        <nav className="hidden items-center gap-4 md:flex">
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
          <Link
            href="https://wa.me/56965914497"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-green-700"
          >
            <MessageCircleMore size={14} />
            WhatsApp
          </Link>
        </nav>
        <button
          type="button"
          className="inline-flex rounded-lg border border-amber-200 p-2 text-amber-900 md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Abrir menú"
          aria-expanded={open}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {open ? (
        <nav className="border-t border-amber-100 bg-white px-4 py-3 md:hidden">
          <div className="grid gap-2">
            {links.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-2 text-sm ${
                    active ? "bg-amber-100 text-amber-900" : "text-zinc-700 hover:bg-amber-50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
