import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// 공유 비밀번호 하나로 사이트 전체를 잠그는 세션. 계정·DB 없이 쿠키 하나로 끝낸다
// (docs/decisions/access-control.md 참고). 쿠키에는 비밀번호 자체가 아니라
// 비밀번호로부터 계산한 HMAC 토큰만 담는다.

export const SESSION_COOKIE = "trip_auth";

const TOKEN_SUBJECT = "trip-guest";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 180; // 180일

function sitePassword(): string {
  return process.env.SITE_PASSWORD ?? "";
}

function timingSafeStringEqual(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  return bufferA.length === bufferB.length && timingSafeEqual(bufferA, bufferB);
}

function expectedToken(): string {
  return createHmac("sha256", sitePassword()).update(TOKEN_SUBJECT).digest("hex");
}

export function isCorrectPassword(candidate: string): boolean {
  const password = sitePassword();
  if (!password) return false;
  return timingSafeStringEqual(candidate, password);
}

export function isValidToken(token: string | undefined): boolean {
  if (!token || !sitePassword()) return false;
  return timingSafeStringEqual(token, expectedToken());
}

export async function createSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, expectedToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
