import { NextResponse } from "next/server";

import { createAdminSession, validateAdminCredentials } from "@/lib/auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!validateAdminCredentials(email, password)) {
    return NextResponse.redirect(new URL("/admin/login?error=1", request.url), 303);
  }

  await createAdminSession(email);
  return NextResponse.redirect(new URL("/admin", request.url), 303);
}
