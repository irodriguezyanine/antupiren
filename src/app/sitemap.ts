import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site-utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const routes = [
    "",
    "/matrimonios",
    "/eventos-corporativos",
    "/celebraciones-sociales",
    "/activaciones-de-marca",
    "/galeria",
    "/nosotros",
    "/contacto",
  ];

  return routes.map((route) => ({
    url: `${base}${route}`,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
    lastModified: new Date(),
  }));
}
