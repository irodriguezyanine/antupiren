import type { Metadata } from "next";

import { CtaBanner } from "@/components/cta-banner";
import { Hero } from "@/components/hero";
import { SiteContainer } from "@/components/site-container";
import { StatsGrid } from "@/components/stats-grid";
import { Testimonials } from "@/components/testimonials";
import { getSiteContent } from "@/lib/content-store";
import { buildWhatsappLink, titleWithBrand } from "@/lib/site-utils";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: titleWithBrand(content.seo.nosotros.title),
    description: content.seo.nosotros.description,
    keywords: content.seo.nosotros.keywords,
  };
}

export default async function NosotrosPage() {
  const content = await getSiteContent();
  const ctaLink = buildWhatsappLink(
    content.contact.whatsappNumber,
    content.pages.nosotros.ctaMessage,
  );

  return (
    <SiteContainer>
      <div className="space-y-10">
        <Hero
          title={content.pages.nosotros.heroTitle}
          subtitle={content.pages.nosotros.heroSubtitle}
          ctaLabel={content.pages.nosotros.ctaLabel}
          ctaHref={ctaLink}
          badge="Historia y equipo"
        />
        <section className="rounded-xl border border-amber-100 bg-white p-6">
          <p className="text-sm leading-relaxed text-zinc-700">{content.pages.nosotros.intro}</p>
          <p className="mt-4 text-sm leading-relaxed text-zinc-700">
            Somos un equipo local que mezcla experiencia, cercanía y gestión profesional para que
            cada evento fluya con tranquilidad.
          </p>
        </section>
        <StatsGrid stats={content.stats} />
        <Testimonials items={content.testimonials} />
        <CtaBanner
          title="Conecta con un equipo que cuida los detalles"
          description="Te asesoramos desde la primera conversación hasta el cierre de tu evento."
          href={ctaLink}
          label="Hablar con Antupirén"
        />
      </div>
    </SiteContainer>
  );
}
