import type { Metadata } from "next";

import { ServicePage } from "@/components/service-page";
import { getSiteContent } from "@/lib/content-store";
import { titleWithBrand } from "@/lib/site-utils";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: titleWithBrand(content.seo.matrimonios.title),
    description: content.seo.matrimonios.description,
    keywords: content.seo.matrimonios.keywords,
  };
}

export default async function MatrimoniosPage() {
  const content = await getSiteContent();

  return (
    <ServicePage
      badge="Matrimonios"
      page={content.pages.matrimonios}
      whatsappNumber={content.contact.whatsappNumber}
      testimonials={content.testimonials}
      gallery={content.gallery}
      galleryFilter="matrimonios"
    />
  );
}
