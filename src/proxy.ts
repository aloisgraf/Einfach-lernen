import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "el_admin_token";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Clone the request headers to potentially modify them for Render.com compatibility
  const requestHeaders = new Headers(req.headers);

  // If X-Forwarded-Host is set (from a reverse proxy like Render), use it
  const forwardedHost = requestHeaders.get("x-forwarded-host");
  if (forwardedHost && !requestHeaders.get("x-original-host")) {
    requestHeaders.set("x-original-host", requestHeaders.get("host") || "");
    requestHeaders.set("host", forwardedHost);
  }

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next();
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
