import Link from "next/link";

type HeroProps = {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  badge?: string;
};

export function Hero({ title, subtitle, ctaLabel, ctaHref, badge }: HeroProps) {
  return (
    <section className="rounded-2xl bg-[linear-gradient(135deg,#422006,#78350f_45%,#14532d)] px-6 py-12 text-white shadow-xl sm:px-10">
      {badge ? (
        <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs uppercase tracking-widest">
          {badge}
        </span>
      ) : null}
      <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight sm:text-5xl">{title}</h1>
      <p className="mt-4 max-w-2xl text-sm text-amber-50 sm:text-base">{subtitle}</p>
      <Link
        href={ctaHref}
        target="_blank"
        className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-amber-900 transition hover:bg-amber-100"
      >
        {ctaLabel}
      </Link>
    </section>
  );
}
