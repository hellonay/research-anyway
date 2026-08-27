import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { SESSION_COOKIE, isValidToken } from "@/lib/auth/session";

// Next.js 16부터 middleware.ts는 deprecated, proxy.ts로 이름이 바뀌었다
// (node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md).
// 공유 비밀번호 쿠키가 없거나 유효하지 않으면 /login으로 보낸다.

const PUBLIC_PATHS = ["/login"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!isValidToken(token)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
