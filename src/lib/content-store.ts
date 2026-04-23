import { seedContent } from "@/lib/seed-content";
import { cloudinaryConfig, cloudinaryEnabled } from "@/lib/cloudinary-config";
import { uploadRawJsonContent } from "@/lib/cloudinary";
import type { SiteContent } from "@/types/content";

const CLOUDINARY_CONTENT_PUBLIC_ID = "antupiren/site-content";
const hasCloudinaryConfig = cloudinaryEnabled;

function getRawUrl(publicId: string): string {
  return `https://res.cloudinary.com/${cloudinaryConfig?.cloudName}/raw/upload/${publicId}.json`;
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
  await uploadRawJsonContent(
    JSON.stringify(nextContent, null, 2),
    CLOUDINARY_CONTENT_PUBLIC_ID,
  );
}
