import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const payload = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    eventType: String(formData.get("eventType") ?? ""),
    eventDate: String(formData.get("eventDate") ?? ""),
    message: String(formData.get("message") ?? ""),
    createdAt: new Date().toISOString(),
  };

  if (!payload.name || !payload.email || !payload.eventType || !payload.message) {
    return NextResponse.json(
      { ok: false, error: "Faltan campos obligatorios." },
      { status: 400 },
    );
  }

  if (process.env.CONTACT_WEBHOOK_URL) {
    await fetch(process.env.CONTACT_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  }

  return NextResponse.redirect(new URL("/contacto?enviado=1", request.url), 303);
}
