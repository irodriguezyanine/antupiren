import type { Metadata } from "next";
import Link from "next/link";

import { CtaBanner } from "@/components/cta-banner";
import { GalleryGrid } from "@/components/gallery-grid";
import { Hero } from "@/components/hero";
import { SiteContainer } from "@/components/site-container";
import { getSiteContent } from "@/lib/content-store";
import { buildWhatsappLink, titleWithBrand } from "@/lib/site-utils";
import type { EventCategory } from "@/types/content";

type GalleryPageProps = {
  searchParams: Promise<{
    categoria?: string;
  }>;
};

const categories: { key: EventCategory | "all"; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "matrimonios", label: "Matrimonios" },
  { key: "corporativos", label: "Corporativos" },
  { key: "sociales", label: "Sociales" },
  { key: "activaciones", label: "Activaciones" },
  { key: "espacio", label: "Espacio" },
];

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: titleWithBrand(content.seo.galeria.title),
    description: content.seo.galeria.description,
    keywords: content.seo.galeria.keywords,
  };
}

export default async function GaleriaPage({ searchParams }: GalleryPageProps) {
  const content = await getSiteContent();
  const params = await searchParams;
  const selected = categories.some((c) => c.key === params.categoria)
    ? (params.categoria as EventCategory | "all")
    : "all";
  const ctaLink = buildWhatsappLink(
    content.contact.whatsappNumber,
    content.pages.galeria.ctaMessage,
  );

  return (
    <SiteContainer>
      <div className="space-y-10">
        <Hero
          title={content.pages.galeria.heroTitle}
          subtitle={content.pages.galeria.heroSubtitle}
          ctaLabel={content.pages.galeria.ctaLabel}
          ctaHref={ctaLink}
          badge="Galería por categoría"
        />
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category.key}
              href={category.key === "all" ? "/galeria" : `/galeria?categoria=${category.key}`}
              className={`rounded-full px-3 py-1 text-xs ${
                selected === category.key
                  ? "bg-amber-700 text-white"
                  : "bg-amber-100 text-amber-900 hover:bg-amber-200"
              }`}
            >
              {category.label}
            </Link>
          ))}
        </div>
        <GalleryGrid items={content.gallery} filter={selected} />
        <CtaBanner
          title="¿Te gustó lo que viste?"
          description="Escríbenos y agenda una visita para conocer el espacio en persona."
          href={ctaLink}
          label="Agenda tu visita"
        />
      </div>
    </SiteContainer>
  );
}
