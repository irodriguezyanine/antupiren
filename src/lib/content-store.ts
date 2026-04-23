import { seedContent } from "@/lib/seed-content";
import type { SiteContent } from "@/types/content";

const CLOUDINARY_CONTENT_PUBLIC_ID = "antupiren/site-content";
const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

const hasCloudinaryConfig =
  !!cloudName && !!apiKey && !!apiSecret;

function getRawUrl(publicId: string): string {
  return `https://res.cloudinary.com/${cloudName}/raw/upload/${publicId}.json`;
}

async function fetchCloudinaryContent(): Promise<SiteContent | null> {
  if (!hasCloudinaryConfig) {
    return null;
  }

  const rawUrl = getRawUrl(CLOUDINARY_CONTENT_PUBLIC_ID);
  const response = await fetch(rawUrl, { cache: "no-store" });

  if (!response.ok) {
    return null;
  }

  const json = (await response.json()) as SiteContent;
  return json;
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const stored = await fetchCloudinaryContent();
    if (stored) {
      return stored;
    }
  } catch {
    // Fallback silencioso a seed local.
  }

  return seedContent;
}

export async function saveSiteContent(nextContent: SiteContent): Promise<void> {
  if (!hasCloudinaryConfig) {
    throw new Error(
      "Faltan variables de Cloudinary para guardar contenido administrable.",
    );
  }

  const form = new FormData();
  form.append(
    "file",
    new Blob([JSON.stringify(nextContent, null, 2)], {
      type: "application/json",
    }),
  );
  form.append("resource_type", "raw");
  form.append("public_id", CLOUDINARY_CONTENT_PUBLIC_ID);
  form.append("overwrite", "true");
  form.append("invalidate", "true");

  const timestamp = Math.floor(Date.now() / 1000).toString();
  form.append("timestamp", timestamp);
  form.append("api_key", apiKey as string);

  const params = `invalidate=true&overwrite=true&public_id=${CLOUDINARY_CONTENT_PUBLIC_ID}&resource_type=raw&timestamp=${timestamp}${apiSecret}`;
  const signature = await crypto.subtle.digest(
    "SHA-1",
    new TextEncoder().encode(params),
  );
  const signatureHex = Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  form.append("signature", signatureHex);

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`;
  const response = await fetch(url, {
    method: "POST",
    body: form,
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`No se pudo guardar contenido en Cloudinary: ${details}`);
  }
}
