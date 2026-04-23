import type { ReactNode } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsappFloat } from "@/components/whatsapp-float";
import { getSiteContent } from "@/lib/content-store";
import { buildWhatsappLink } from "@/lib/site-utils";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const content = await getSiteContent();
  const whatsappLink = buildWhatsappLink(
    content.contact.whatsappNumber,
    content.brand.defaultWhatsappMessage,
  );

  return (
    <>
      <SiteHeader />
      <main className="flex-1 py-6">{children}</main>
      <SiteFooter
        address={content.contact.address}
        instagramUrl={content.contact.instagramUrl}
        facebookUrl={content.contact.facebookUrl}
      />
      <WhatsappFloat href={whatsappLink} />
    </>
  );
}
