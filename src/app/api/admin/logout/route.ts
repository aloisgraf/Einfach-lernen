import { NextResponse } from "next/server";
import { COOKIE_NAME, REFRESH_COOKIE } from "@/lib/auth";

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete(COOKIE_NAME);
  res.cookies.delete(REFRESH_COOKIE);
  return res;
}
