import { cookies } from "next/headers";

const COOKIE_NAME = "el_admin_token";
const REFRESH_COOKIE = "el_admin_refresh";
// NEXT_PUBLIC_*-Variablen werden von Next.js beim Build fix in den Code eingesetzt –
// auf dem Server gelesene Werte können dadurch veraltet/undefined sein, wenn die
// Variable erst nach dem Build gesetzt wird. SUPABASE_URL/SUPABASE_ANON_KEY (ohne
// Präfix) werden zur Laufzeit aus process.env gelesen und sind für den Server zuverlässiger.
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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
      signal: AbortSignal.timeout(10_000),
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
  } catch (e) {
    if (e instanceof Error && e.name === "TimeoutError") {
      return { error: "Supabase antwortet nicht (Timeout). Prüfe, ob dein Supabase-Projekt aktiv/nicht pausiert ist." };
    }
    return { error: "Verbindungsfehler." };
  }
}

async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
      method: "POST",
      headers: { apikey: SUPABASE_ANON_KEY!, "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
      signal: AbortSignal.timeout(10_000),
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
      signal: AbortSignal.timeout(8_000),
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
    if (!newToken) return false;

    // Neuen Access Token speichern, damit nicht bei jedem Request neu erneuert wird.
    // In Server Components ist der Cookie-Store read-only – cookies().set() wirft dort
    // einen Fehler. Das darf den Login-Status nicht kippen, also separat abfangen.
    try {
      cookieStore.set(COOKIE_NAME, newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 8,
      });
    } catch { /* read-only Cookie-Store (Server Component) – Refresh bleibt trotzdem gültig */ }
    return true;
  } catch {
    return false;
  }
}

export { COOKIE_NAME, REFRESH_COOKIE };
