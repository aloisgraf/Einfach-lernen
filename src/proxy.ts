import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "el_admin_session";
const ADMIN_SECRET = process.env.ADMIN_SECRET ?? "einfachlernen_secret_2024";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const session = req.cookies.get(COOKIE_NAME)?.value;
    if (session !== ADMIN_SECRET) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
