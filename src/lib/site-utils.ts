export function buildWhatsappLink(number: string, message: string): string {
  const clean = number.replace(/[^\d]/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://eventosantupiren.cl";
}

export function titleWithBrand(pageTitle: string): string {
  return `${pageTitle} | Centro de Eventos Antupirén`;
}
