import type { Metadata } from "next";

import { ServicePage } from "@/components/service-page";
import { getSiteContent } from "@/lib/content-store";
import { titleWithBrand } from "@/lib/site-utils";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: titleWithBrand(content.seo.corporativos.title),
    description: content.seo.corporativos.description,
    keywords: content.seo.corporativos.keywords,
  };
}

export default async function CorporativosPage() {
  const content = await getSiteContent();

  return (
    <ServicePage
      badge="Eventos Corporativos"
      page={content.pages.corporativos}
      whatsappNumber={content.contact.whatsappNumber}
      testimonials={content.testimonials}
      gallery={content.gallery}
      galleryFilter="corporativos"
    />
  );
}
