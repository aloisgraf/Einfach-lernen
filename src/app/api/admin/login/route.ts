import { NextRequest, NextResponse } from "next/server";
import { supabaseSignIn, COOKIE_NAME, REFRESH_COOKIE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "E-Mail und Passwort erforderlich." }, { status: 400 });
  }

  const result = await supabaseSignIn(email, password);

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }

  const cookieOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };

  const res = NextResponse.json({ success: true });
  res.cookies.set(COOKIE_NAME, result.access_token, { ...cookieOpts, maxAge: 60 * 60 * 8 });
  res.cookies.set(REFRESH_COOKIE, result.refresh_token, { ...cookieOpts, maxAge: 60 * 60 * 24 * 30 });
  return res;
}
