"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseSignIn, COOKIE_NAME, REFRESH_COOKIE } from "@/lib/auth";

export type LoginState = { error?: string } | null;

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = (formData.get("email") as string) ?? "";
  const password = (formData.get("password") as string) ?? "";
  const rawFrom = (formData.get("from") as string) ?? "";

  const from =
    rawFrom.startsWith("/admin/") && !rawFrom.startsWith("/admin/login")
      ? rawFrom
      : "/admin/dashboard";

  if (!email || !password) {
    return { error: "E-Mail und Passwort erforderlich." };
  }

  const result = await supabaseSignIn(email, password);

  if ("error" in result) {
    return { error: result.error };
  }

  const cookieStore = await cookies();
  const cookieOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };

  cookieStore.set(COOKIE_NAME, result.access_token, {
    ...cookieOpts,
    maxAge: 60 * 60 * 8,
  });
  cookieStore.set(REFRESH_COOKIE, result.refresh_token, {
    ...cookieOpts,
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect(from);
}
