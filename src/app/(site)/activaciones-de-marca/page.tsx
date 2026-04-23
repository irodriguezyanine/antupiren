import type { Metadata } from "next";

import { ServicePage } from "@/components/service-page";
import { getSiteContent } from "@/lib/content-store";
import { titleWithBrand } from "@/lib/site-utils";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: titleWithBrand(content.seo.activaciones.title),
    description: content.seo.activaciones.description,
    keywords: content.seo.activaciones.keywords,
  };
}

export default async function ActivacionesPage() {
  const content = await getSiteContent();

  return (
    <ServicePage
      badge="Activaciones de Marca"
      page={content.pages.activaciones}
      whatsappNumber={content.contact.whatsappNumber}
      testimonials={content.testimonials}
      gallery={content.gallery}
      galleryFilter="activaciones"
    />
  );
}
