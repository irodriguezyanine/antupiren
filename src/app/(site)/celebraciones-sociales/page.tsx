import type { Metadata } from "next";

import { ServicePage } from "@/components/service-page";
import { getSiteContent } from "@/lib/content-store";
import { titleWithBrand } from "@/lib/site-utils";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: titleWithBrand(content.seo.sociales.title),
    description: content.seo.sociales.description,
    keywords: content.seo.sociales.keywords,
  };
}

export default async function SocialesPage() {
  const content = await getSiteContent();

  return (
    <ServicePage
      badge="Celebraciones Sociales"
      page={content.pages.sociales}
      whatsappNumber={content.contact.whatsappNumber}
      testimonials={content.testimonials}
      gallery={content.gallery}
      galleryFilter="sociales"
    />
  );
}
