import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { BenefitsGrid } from "@/components/benefits-grid";
import { CtaBanner } from "@/components/cta-banner";
import { EventCards } from "@/components/event-cards";
import { Faq } from "@/components/faq";
import { GalleryGrid } from "@/components/gallery-grid";
import { Hero } from "@/components/hero";
import { ProcessSteps } from "@/components/process-steps";
import { SectionTitle } from "@/components/section-title";
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
      <div className="space-y-14">
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
          gradientFrom={content.brand.heroGradientFrom}
          gradientVia={content.brand.heroGradientVia}
          gradientTo={content.brand.heroGradientTo}
          backgroundImageUrl={content.brand.heroBackgroundImageUrl}
          overlayOpacity={content.brand.heroOverlayOpacity}
        />

        <section className="rounded-3xl border border-amber-100 bg-white p-6">
          <SectionTitle
            eyebrow="Propuesta de valor"
            title="Nuestra propuesta"
            subtitle={content.brand.valueProposition}
          />
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
          <SectionTitle
            eyebrow="Trayectoria"
            title="Experiencia que respalda"
            subtitle="Números reales que reflejan años de trabajo y clientes felices."
          />
          <StatsGrid stats={content.stats} />
        </section>

        <section>
          <SectionTitle
            eyebrow="Tipos de eventos"
            title="¿Qué evento quieres realizar?"
            subtitle="Diseñamos experiencias personalizadas según tu objetivo y estilo."
          />
          <EventCards items={content.homeEventTypes} />
        </section>

        <section>
          <SectionTitle
            eyebrow="Cómo trabajamos"
            title="Un proceso claro y sin estrés"
            subtitle="Te acompañamos desde la primera conversación hasta el cierre del evento."
          />
          <ProcessSteps />
        </section>

        <section>
          <SectionTitle
            eyebrow="Servicios incluidos"
            title="Todo lo que necesitas en un solo lugar"
            subtitle="Combinamos entorno, producción y experiencia para lograr resultados memorables."
          />
          <BenefitsGrid />
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="headline text-2xl font-semibold text-amber-900">Galería destacada</h2>
            <Link
              href="/galeria"
              className="inline-flex items-center gap-1 text-sm text-amber-700 hover:text-amber-900"
            >
              Ver galería completa
              <ArrowRight size={14} />
            </Link>
          </div>
          <GalleryGrid items={content.gallery.slice(0, 6)} />
        </section>

        <section>
          <SectionTitle
            eyebrow="Confianza"
            title="Qué dicen de nosotros"
            subtitle="Historias reales de personas y empresas que celebraron con nosotros."
          />
          <Testimonials items={content.testimonials} />
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <div>
            <SectionTitle
              eyebrow="Preguntas frecuentes"
              title="Resolvemos tus dudas"
              subtitle="Si tienes una consulta específica, te respondemos por WhatsApp en minutos."
            />
            <Faq />
          </div>
          <CtaBanner
            title="Fechas disponibles limitadas"
            description="Agenda una visita y asegura tu fecha con anticipación. Nuestro equipo te responderá por WhatsApp."
            href={whatsappLink}
            label="Quiero agendar mi visita"
          />
        </section>

      </div>
    </SiteContainer>
  );
}
