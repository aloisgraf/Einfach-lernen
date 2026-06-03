import { NextRequest, NextResponse } from "next/server";
import { supabaseSignIn, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "E-Mail und Passwort erforderlich." }, { status: 400 });
  }

  const result = await supabaseSignIn(email, password);

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set(COOKIE_NAME, result.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
    path: "/",
  });
  return res;
}
