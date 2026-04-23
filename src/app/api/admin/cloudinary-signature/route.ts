import crypto from "node:crypto";

import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/auth";
import {
  cloudinaryConfig,
  cloudinaryConfigError,
  cloudinaryConfigSource,
  cloudinaryEnabled,
} from "@/lib/cloudinary-config";

export async function POST(request: Request) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  if (!cloudinaryEnabled || !cloudinaryConfig) {
    return NextResponse.json(
      {
        ok: false,
        error: cloudinaryConfigError || "Cloudinary no está configurado.",
      },
      { status: 500 },
    );
  }

  const body = (await request.json().catch(() => ({}))) as { folder?: string };
  const folder = (body.folder || "antupiren/gallery").trim();
  const timestamp = Math.floor(Date.now() / 1000);
  const stringToSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = crypto
    .createHash("sha1")
    .update(stringToSign + cloudinaryConfig.apiSecret)
    .digest("hex");

  return NextResponse.json({
    ok: true,
    cloudName: cloudinaryConfig.cloudName,
    apiKey: cloudinaryConfig.apiKey,
    timestamp,
    signature,
    folder,
    source: cloudinaryConfigSource,
  });
}
