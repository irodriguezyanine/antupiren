import { CtaBanner } from "@/components/cta-banner";
import { GalleryGrid } from "@/components/gallery-grid";
import { Hero } from "@/components/hero";
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
      <div className="space-y-10">
        <Hero
          title={page.heroTitle}
          subtitle={page.heroSubtitle}
          ctaLabel={page.ctaLabel}
          ctaHref={ctaLink}
          badge={badge}
        />
        <section>
          <p className="max-w-3xl text-sm leading-relaxed text-zinc-700">{page.intro}</p>
        </section>
        <section>
          <h2 className="mb-4 text-2xl font-semibold text-amber-900">Galería relacionada</h2>
          <GalleryGrid items={gallery} filter={galleryFilter} />
        </section>
        <section>
          <h2 className="mb-4 text-2xl font-semibold text-amber-900">Testimonios</h2>
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
