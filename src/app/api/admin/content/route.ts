import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/auth";
import { getSiteContent, saveSiteContent } from "@/lib/content-store";
import type { SiteContent } from "@/types/content";

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  const content = await getSiteContent();
  return NextResponse.json(content);
}

export async function PUT(request: Request) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  const body = (await request.json()) as SiteContent;
  await saveSiteContent({
    ...body,
    updatedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
