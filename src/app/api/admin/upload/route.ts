import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/auth";
import { uploadEventImage } from "@/lib/cloudinary";
import type { EventCategory } from "@/types/content";

export async function POST(request: Request) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const title = String(formData.get("title") ?? "");
  const description = String(formData.get("description") ?? "");
  const category = String(formData.get("category") ?? "espacio") as EventCategory;

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "Archivo inválido" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const uploaded = await uploadEventImage(buffer);

  return NextResponse.json({
    secureUrl: uploaded.secureUrl,
    publicId: uploaded.publicId,
    title,
    description,
    category,
  });
}
