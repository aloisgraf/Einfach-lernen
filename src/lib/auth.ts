import { cookies } from "next/headers";

const COOKIE_NAME = "el_admin_token";
const REFRESH_COOKIE = "el_admin_refresh";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseAuthConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

export async function supabaseSignIn(
  email: string,
  password: string
): Promise<{ access_token: string; refresh_token: string } | { error: string }> {
  if (!isSupabaseAuthConfigured()) {
    return { error: "Supabase Auth nicht konfiguriert." };
  }
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { apikey: SUPABASE_ANON_KEY!, "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      const code = body?.error_code ?? body?.code;
      if (code === "email_not_confirmed") {
        return { error: "Bitte bestätige zuerst deine E-Mail-Adresse über den Link, den Supabase dir zugeschickt hat." };
      }
      if (code === "user_banned") {
        return { error: "Dieser Account ist gesperrt." };
      }
      return { error: "Ungültige E-Mail oder Passwort." };
    }
    const data = await res.json();
    return { access_token: data.access_token, refresh_token: data.refresh_token };
  } catch {
    return { error: "Verbindungsfehler." };
  }
}

async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
      method: "POST",
      headers: { apikey: SUPABASE_ANON_KEY!, "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.access_token ?? null;
  } catch {
    return null;
  }
}

async function verifyToken(token: string): Promise<boolean> {
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: SUPABASE_ANON_KEY!, Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function isAdminLoggedIn(): Promise<boolean> {
  try {
    if (!isSupabaseAuthConfigured()) return false;
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return false;

    if (await verifyToken(token)) return true;

    // Token abgelaufen → mit Refresh Token erneuern
    const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;
    if (!refreshToken) return false;

    const newToken = await refreshAccessToken(refreshToken);
    return newToken !== null;
  } catch {
    return false;
  }
}

export { COOKIE_NAME, REFRESH_COOKIE };
