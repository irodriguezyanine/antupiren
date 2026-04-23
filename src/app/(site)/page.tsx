import type { Metadata } from "next";
import Link from "next/link";

import { CtaBanner } from "@/components/cta-banner";
import { EventCards } from "@/components/event-cards";
import { GalleryGrid } from "@/components/gallery-grid";
import { Hero } from "@/components/hero";
import { SiteContainer } from "@/components/site-container";
import { StatsGrid } from "@/components/stats-grid";
import { Testimonials } from "@/components/testimonials";
import { getSiteContent } from "@/lib/content-store";
import { buildWhatsappLink, getSiteUrl, titleWithBrand } from "@/lib/site-utils";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: titleWithBrand(content.seo.home.title),
    description: content.seo.home.description,
    keywords: content.seo.home.keywords,
  };
}

export default async function HomePage() {
  const content = await getSiteContent();
  const whatsappLink = buildWhatsappLink(
    content.contact.whatsappNumber,
    content.brand.defaultWhatsappMessage,
  );
  const schema = {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    name: content.brand.siteName,
    description: content.brand.valueProposition,
    address: {
      "@type": "PostalAddress",
      streetAddress: content.contact.address,
      addressLocality: "Peñalolén",
      addressCountry: "CL",
    },
    telephone: content.contact.phoneLabel,
    url: getSiteUrl(),
    sameAs: [content.contact.instagramUrl, content.contact.facebookUrl],
  };

  return (
    <SiteContainer>
      <div className="space-y-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <Hero
          title={content.brand.heroTitle}
          subtitle={content.brand.heroSubtitle}
          badge="El centro de eventos de Peñalolén"
          ctaLabel="Cotiza por WhatsApp"
          ctaHref={whatsappLink}
        />

        <section>
          <h2 className="text-2xl font-semibold text-amber-900">Nuestra propuesta</h2>
          <p className="mt-3 max-w-3xl text-sm text-zinc-700">{content.brand.valueProposition}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {content.trustBadges.map((badge) => (
              <span
                key={badge}
                className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900"
              >
                {badge}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-amber-900">Experiencia que respalda</h2>
          <StatsGrid stats={content.stats} />
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-amber-900">¿Qué evento quieres realizar?</h2>
          <EventCards items={content.homeEventTypes} />
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-amber-900">Galería destacada</h2>
            <Link href="/galeria" className="text-sm text-amber-700 hover:text-amber-900">
              Ver galería completa
            </Link>
          </div>
          <GalleryGrid items={content.gallery.slice(0, 6)} />
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-amber-900">Qué dicen de nosotros</h2>
          <Testimonials items={content.testimonials} />
        </section>

        <CtaBanner
          title="Fechas disponibles limitadas"
          description="Agenda una visita y asegura tu fecha con anticipación. Nuestro equipo te responderá por WhatsApp."
          href={whatsappLink}
          label="Quiero agendar mi visita"
        />
      </div>
    </SiteContainer>
  );
}
