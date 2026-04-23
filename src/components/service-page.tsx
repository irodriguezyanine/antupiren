import { CtaBanner } from "@/components/cta-banner";
import { GalleryGrid } from "@/components/gallery-grid";
import { Hero } from "@/components/hero";
import { SectionTitle } from "@/components/section-title";
import { SiteContainer } from "@/components/site-container";
import { Testimonials } from "@/components/testimonials";
import { buildWhatsappLink } from "@/lib/site-utils";
import type { EventCategory, GalleryItem, PageSectionConfig, Testimonial } from "@/types/content";

type ServicePageProps = {
  badge: string;
  page: PageSectionConfig;
  whatsappNumber: string;
  testimonials: Testimonial[];
  gallery: GalleryItem[];
  galleryFilter: EventCategory | "all";
};

export function ServicePage({
  badge,
  page,
  whatsappNumber,
  testimonials,
  gallery,
  galleryFilter,
}: ServicePageProps) {
  const ctaLink = buildWhatsappLink(whatsappNumber, page.ctaMessage);

  return (
    <SiteContainer>
      <div className="space-y-12">
        <Hero
          title={page.heroTitle}
          subtitle={page.heroSubtitle}
          ctaLabel={page.ctaLabel}
          ctaHref={ctaLink}
          badge={badge}
        />
        <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-2xl border border-amber-100 bg-white p-6">
            <SectionTitle eyebrow="Descripción" title="Servicio a tu medida" subtitle={page.intro} />
            <p className="text-sm leading-relaxed text-zinc-700">{page.intro}</p>
          </article>
          <article className="rounded-2xl border border-amber-100 bg-white p-6">
            <p className="text-xs uppercase tracking-widest text-amber-700">Incluye</p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-700">
              <li>• Asesoría previa y coordinación de montaje.</li>
              <li>• Espacios interiores y exteriores flexibles.</li>
              <li>• Soporte operativo durante todo el evento.</li>
              <li>• Atención personalizada por WhatsApp.</li>
            </ul>
          </article>
        </section>
        <section>
          <SectionTitle
            eyebrow="Inspiración"
            title="Galería relacionada"
            subtitle="Imágenes reales para ayudarte a proyectar tu evento."
          />
          <GalleryGrid items={gallery} filter={galleryFilter} />
        </section>
        <section>
          <SectionTitle
            eyebrow="Respaldo"
            title="Testimonios"
            subtitle="La experiencia de nuestros clientes es nuestra mejor carta de presentación."
          />
          <Testimonials items={testimonials} />
        </section>
        <CtaBanner
          title="Conoce el espacio en terreno"
          description="Te acompañamos en todo el proceso para que tu evento resulte tal como lo imaginas."
          href={ctaLink}
          label={page.ctaLabel}
        />
      </div>
    </SiteContainer>
  );
}
