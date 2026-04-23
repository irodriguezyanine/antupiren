type CloudinaryResolvedConfig = {
  cloudName?: string;
  apiKey?: string;
  apiSecret?: string;
};

function parseCloudinaryUrl(value: string): CloudinaryResolvedConfig {
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "cloudinary:") {
      return {};
    }

    const cloudName = parsed.hostname?.trim();
    const apiKey = decodeURIComponent(parsed.username || "").trim();
    const apiSecret = decodeURIComponent(parsed.password || "").trim();

    return { cloudName, apiKey, apiSecret };
  } catch {
    return {};
  }
}

const fromUrl = parseCloudinaryUrl(process.env.CLOUDINARY_URL?.trim() || "");

export const cloudinaryConfig: Required<CloudinaryResolvedConfig> | null =
  fromUrl.cloudName && fromUrl.apiKey && fromUrl.apiSecret
    ? {
        cloudName: fromUrl.cloudName,
        apiKey: fromUrl.apiKey,
        apiSecret: fromUrl.apiSecret,
      }
    : process.env.CLOUDINARY_CLOUD_NAME?.trim() &&
        process.env.CLOUDINARY_API_KEY?.trim() &&
        process.env.CLOUDINARY_API_SECRET?.trim()
      ? {
          cloudName: process.env.CLOUDINARY_CLOUD_NAME.trim(),
          apiKey: process.env.CLOUDINARY_API_KEY.trim(),
          apiSecret: process.env.CLOUDINARY_API_SECRET.trim(),
        }
      : null;

export const cloudinaryEnabled = !!cloudinaryConfig;
