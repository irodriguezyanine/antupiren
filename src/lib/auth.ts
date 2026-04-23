import crypto from "node:crypto";

import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "antupiren_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

function base64url(input: string): string {
  return Buffer.from(input, "utf8").toString("base64url");
}

function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET ?? "dev-antupiren-session-secret";
}

function getExpectedCredentials() {
  return {
    email: process.env.ADMIN_EMAIL ?? "",
    password: process.env.ADMIN_PASSWORD ?? "",
  };
}

function sign(value: string): string {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
}

function makeToken(email: string): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS;
  const payload = `${base64url(email)}.${exp}`;
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token: string): boolean {
  const [encodedEmail, exp, providedSignature] = token.split(".");
  if (!encodedEmail || !exp || !providedSignature) {
    return false;
  }

  const payload = `${encodedEmail}.${exp}`;
  const expectedSignature = sign(payload);

  if (expectedSignature !== providedSignature) {
    return false;
  }

  return Number(exp) > Math.floor(Date.now() / 1000);
}

export function validateAdminCredentials(
  email: string,
  password: string,
): boolean {
  const expected = getExpectedCredentials();
  return expected.email === email && expected.password === password;
}

export async function createAdminSession(email: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, makeToken(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return false;
  }

  return verifyToken(token);
}
