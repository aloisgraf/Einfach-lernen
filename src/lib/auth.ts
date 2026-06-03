import { cookies } from "next/headers";

const COOKIE_NAME = "el_admin_token";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseAuthConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

// Supabase Auth: Email + Passwort → access_token
export async function supabaseSignIn(
  email: string,
  password: string
): Promise<{ access_token: string } | { error: string }> {
  if (!isSupabaseAuthConfigured()) {
    return { error: "Supabase Auth nicht konfiguriert." };
  }
  const res = await fetch(
    `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
    {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }
  );
  if (!res.ok) {
    return { error: "Ungültige E-Mail oder Passwort." };
  }
  const data = await res.json();
  return { access_token: data.access_token };
}

// Token gegen Supabase prüfen
async function verifySupabaseToken(token: string): Promise<boolean> {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      apikey: SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${token}`,
    },
  });
  return res.ok;
}

export async function isAdminLoggedIn(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;

  if (isSupabaseAuthConfigured()) {
    return verifySupabaseToken(token);
  }
  return false;
}

export { COOKIE_NAME };
