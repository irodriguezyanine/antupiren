import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/auth";
import { uploadEventImage } from "@/lib/cloudinary";
import type { EventCategory } from "@/types/content";

export async function POST(request: Request) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const title = String(formData.get("title") ?? "");
    const description = String(formData.get("description") ?? "");
    const category = String(formData.get("category") ?? "espacio") as EventCategory;
    const mode = String(formData.get("mode") ?? "gallery");
    const folder = mode === "card-background" ? "antupiren/cards" : "antupiren/gallery";

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "Archivo inválido" }, { status: 400 });
    }

    if (file.size <= 0) {
      return NextResponse.json(
        { ok: false, error: "El archivo está vacío." },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploaded = await uploadEventImage(buffer, folder);

    return NextResponse.json({
      ok: true,
      secureUrl: uploaded.secureUrl,
      publicId: uploaded.publicId,
      title,
      description,
      category,
      mode,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error inesperado subiendo a Cloudinary.";

    console.error("[api/admin/upload] upload failed:", message);

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 },
    );
  }
}
