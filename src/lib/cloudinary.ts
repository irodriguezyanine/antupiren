import { v2 as cloudinary } from "cloudinary";
import { cloudinaryConfig, cloudinaryEnabled } from "@/lib/cloudinary-config";

if (cloudinaryEnabled) {
  cloudinary.config({
    cloud_name: cloudinaryConfig?.cloudName,
    api_key: cloudinaryConfig?.apiKey,
    api_secret: cloudinaryConfig?.apiSecret,
    secure: true,
  });
}

type UploadResult = {
  secureUrl: string;
  publicId: string;
};

export async function uploadEventImage(
  fileBuffer: Buffer,
  folder = "antupiren/gallery",
): Promise<UploadResult> {
  if (!cloudinaryEnabled) {
    throw new Error("Cloudinary no está configurado.");
  }

  const result = await new Promise<{
    secure_url: string;
    public_id: string;
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        overwrite: false,
      },
      (error, uploaded) => {
        if (error || !uploaded) {
          reject(error ?? new Error("Error desconocido subiendo imagen."));
          return;
        }

        resolve(uploaded as { secure_url: string; public_id: string });
      },
    );

    stream.end(fileBuffer);
  });

  return {
    secureUrl: result.secure_url,
    publicId: result.public_id,
  };
}
