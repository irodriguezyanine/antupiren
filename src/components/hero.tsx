import { CalendarClock, MapPin, Sparkles } from "lucide-react";
import Link from "next/link";

type HeroProps = {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  badge?: string;
  gradientFrom?: string;
  gradientVia?: string;
  gradientTo?: string;
  backgroundImageUrl?: string;
  overlayOpacity?: number;
};

export function Hero({
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  badge,
  gradientFrom = "#2f5a3f",
  gradientVia = "#5a3515",
  gradientTo = "#2b1a0f",
  backgroundImageUrl,
  overlayOpacity = 0.55,
}: HeroProps) {
  const gradientLayer = `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientVia} 48%, ${gradientTo} 100%)`;
  const backgroundLayers = backgroundImageUrl
    ? `${gradientLayer}, url(${backgroundImageUrl})`
    : gradientLayer;

  return (
    <section
      className="soft-shadow relative overflow-hidden rounded-3xl px-6 py-12 text-white sm:px-10 sm:py-14"
      style={{
        backgroundImage: backgroundLayers,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {backgroundImageUrl ? (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: `rgba(0,0,0,${Math.min(Math.max(overlayOpacity, 0), 1)})` }}
        />
      ) : null}
      <div className="absolute -left-14 top-10 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -right-16 bottom-5 h-40 w-40 rounded-full bg-green-200/20 blur-2xl" />
      <div className="relative z-10">
        {badge ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs uppercase tracking-widest">
            <Sparkles size={12} />
            {badge}
          </span>
        ) : null}
        <h1 className="headline mt-4 max-w-3xl text-3xl font-semibold leading-tight sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-sm text-amber-50 sm:text-base">{subtitle}</p>

        <div className="mt-5 flex flex-wrap gap-3 text-xs text-amber-50/90">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
            <MapPin size={12} />
            Peñalolén, Santiago
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
            <CalendarClock size={12} />
            Agenda tu visita hoy
          </span>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={ctaHref}
            target="_blank"
            className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-amber-900 transition hover:bg-amber-100"
          >
            {ctaLabel}
          </Link>
          <Link
            href="/galeria"
            className="inline-flex rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            Ver galería
          </Link>
        </div>
      </div>
    </section>
  );
}
