import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/auth/login", "/auth/register", "/auth/forgot-password", "/_next", "/favicon.ico", "/api/auth/login", "/api/auth/register", "/api/auth/forgot-password"];

// this is middleware file 
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  const session = req.cookies.get("session");

  if (!isPublic && !session) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api/auth/login|api/auth/register|api/auth/forgot-password).*)"],
};
