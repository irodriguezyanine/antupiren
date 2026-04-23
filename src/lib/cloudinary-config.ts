type CloudinaryResolvedConfig = {
  cloudName?: string;
  apiKey?: string;
  apiSecret?: string;
};

type CloudinaryConfigState = {
  config: Required<CloudinaryResolvedConfig> | null;
  source: "url" | "split-env" | "none";
  error?: string;
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
const cloudinaryUrlRaw = process.env.CLOUDINARY_URL?.trim();
const splitEnvConfig =
  process.env.CLOUDINARY_CLOUD_NAME?.trim() &&
  process.env.CLOUDINARY_API_KEY?.trim() &&
  process.env.CLOUDINARY_API_SECRET?.trim()
    ? {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME.trim(),
        apiKey: process.env.CLOUDINARY_API_KEY.trim(),
        apiSecret: process.env.CLOUDINARY_API_SECRET.trim(),
      }
    : null;

function resolveCloudinaryConfig(): CloudinaryConfigState {
  if (cloudinaryUrlRaw) {
    if (fromUrl.cloudName && fromUrl.apiKey && fromUrl.apiSecret) {
      return {
        config: {
          cloudName: fromUrl.cloudName,
          apiKey: fromUrl.apiKey,
          apiSecret: fromUrl.apiSecret,
        },
        source: "url",
      };
    }

    return {
      config: null,
      source: "none",
      error:
        "CLOUDINARY_URL está definido pero no tiene formato válido. Usa: cloudinary://<api_key>:<api_secret>@<cloud_name>",
    };
  }

  if (splitEnvConfig) {
    return {
      config: splitEnvConfig,
      source: "split-env",
    };
  }

  return {
    config: null,
    source: "none",
    error:
      "Faltan credenciales Cloudinary. Define CLOUDINARY_URL o las 3 variables separadas.",
  };
}

const resolved = resolveCloudinaryConfig();

export const cloudinaryConfig = resolved.config;
export const cloudinaryConfigSource = resolved.source;
export const cloudinaryConfigError = resolved.error;
export const cloudinaryEnabled = !!resolved.config;
