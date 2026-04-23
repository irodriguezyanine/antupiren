import type { Metadata } from "next";
import { CircleCheckBig, Clock3, MapPin } from "lucide-react";
import Link from "next/link";

import { Hero } from "@/components/hero";
import { SectionTitle } from "@/components/section-title";
import { SiteContainer } from "@/components/site-container";
import { getSiteContent } from "@/lib/content-store";
import { buildWhatsappLink, titleWithBrand } from "@/lib/site-utils";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: titleWithBrand(content.seo.contacto.title),
    description: content.seo.contacto.description,
    keywords: content.seo.contacto.keywords,
  };
}

type ContactoPageProps = {
  searchParams: Promise<{
    enviado?: string;
  }>;
};

export default async function ContactoPage({ searchParams }: ContactoPageProps) {
  const content = await getSiteContent();
  const params = await searchParams;
  const ctaLink = buildWhatsappLink(
    content.contact.whatsappNumber,
    content.pages.contacto.ctaMessage,
  );

  return (
    <SiteContainer>
      <div className="space-y-10">
        <Hero
          title={content.pages.contacto.heroTitle}
          subtitle={content.pages.contacto.heroSubtitle}
          ctaLabel={content.pages.contacto.ctaLabel}
          ctaHref={ctaLink}
          badge="Contacto y reservas"
        />

        <section className="grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-amber-100 bg-white p-4">
            <MapPin className="text-amber-700" size={18} />
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">Ubicación</p>
            <p className="mt-1 text-sm text-zinc-700">{content.contact.address}</p>
          </article>
          <article className="rounded-2xl border border-amber-100 bg-white p-4">
            <Clock3 className="text-amber-700" size={18} />
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">Atención</p>
            <p className="mt-1 text-sm text-zinc-700">Lunes a sábado · 09:00 a 20:00</p>
          </article>
          <article className="rounded-2xl border border-amber-100 bg-white p-4">
            <CircleCheckBig className="text-amber-700" size={18} />
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">Respuesta</p>
            <p className="mt-1 text-sm text-zinc-700">WhatsApp prioritario en minutos</p>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-xl border border-amber-100 bg-white p-6">
            <SectionTitle title="Datos de contacto" subtitle="También puedes escribirnos por redes sociales." />
            <ul className="mt-4 space-y-2 text-sm text-zinc-700">
              <li>Dirección: {content.contact.address}</li>
              <li>WhatsApp: {content.contact.phoneLabel}</li>
              <li>Email: {content.contact.email}</li>
            </ul>
            <div className="mt-4 flex gap-3 text-sm">
              <Link href={content.contact.instagramUrl} target="_blank" className="text-amber-800">
                Instagram
              </Link>
              <Link href={content.contact.facebookUrl} target="_blank" className="text-amber-800">
                Facebook
              </Link>
            </div>
          </article>

          <form
            action="/api/contact"
            method="post"
            className="space-y-3 rounded-xl border border-amber-100 bg-white p-6"
          >
            <SectionTitle
              title="Formulario de contacto"
              subtitle="Cuéntanos tu idea y te responderemos a la brevedad."
            />
            <input
              name="name"
              required
              placeholder="Nombre"
              className="w-full rounded-lg border border-amber-200 px-3 py-2 text-sm"
            />
            <input
              name="email"
              type="email"
              required
              placeholder="Email"
              className="w-full rounded-lg border border-amber-200 px-3 py-2 text-sm"
            />
            <input
              name="eventType"
              required
              placeholder="Tipo de evento"
              className="w-full rounded-lg border border-amber-200 px-3 py-2 text-sm"
            />
            <input
              name="eventDate"
              placeholder="Fecha tentativa"
              className="w-full rounded-lg border border-amber-200 px-3 py-2 text-sm"
            />
            <textarea
              name="message"
              required
              rows={4}
              placeholder="Cuéntanos lo que necesitas"
              className="w-full rounded-lg border border-amber-200 px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="rounded-full bg-amber-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-amber-800"
            >
              Enviar consulta
            </button>
            {params.enviado ? (
              <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">
                ¡Mensaje enviado! Te contactaremos pronto.
              </p>
            ) : null}
          </form>
        </section>

        <section className="overflow-hidden rounded-xl border border-amber-100">
          <iframe
            src={content.contact.mapEmbedUrl}
            title="Mapa de ubicación de Antupirén"
            className="h-[360px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </section>
      </div>
    </SiteContainer>
  );
}
