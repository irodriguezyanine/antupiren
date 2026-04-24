import type { CSSProperties, ReactNode } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsappFloat } from "@/components/whatsapp-float";
import { getSiteContent } from "@/lib/content-store";
import { buildWhatsappLink } from "@/lib/site-utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const content = await getSiteContent();
  const whatsappLink = buildWhatsappLink(
    content.contact.whatsappNumber,
    content.brand.defaultWhatsappMessage,
  );
  const themeStyle = {
    "--site-primary": content.brand.sitePrimaryColor ?? "#4a2a0a",
    "--site-secondary": content.brand.siteSecondaryColor ?? "#8a4b1f",
    "--site-accent": content.brand.siteAccentColor ?? "#b66a2f",
    "--site-surface": content.brand.siteSurfaceColor ?? "#f7f5ef",
    "--site-text": content.brand.siteTextColor ?? "#1f2937",
  } as CSSProperties;

  return (
    <div className="theme-scope flex min-h-full flex-col" style={themeStyle}>
      <SiteHeader />
      <main className="flex-1 bg-[radial-gradient(circle_at_top,#fff6ea_0%,#f7f5ef_45%,#f7f5ef_100%)] py-6">
        {children}
      </main>
      <SiteFooter
        address={content.contact.address}
        instagramUrl={content.contact.instagramUrl}
        facebookUrl={content.contact.facebookUrl}
      />
      <WhatsappFloat href={whatsappLink} />
    </div>
  );
}
