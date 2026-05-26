import { cookies } from "next/headers";

const COOKIE_NAME = "el_admin_session";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";
const ADMIN_SECRET = process.env.ADMIN_SECRET ?? "einfachlernen_secret_2024";

export function checkPassword(pw: string): boolean {
  return pw === ADMIN_PASSWORD;
}

export function getSessionToken(): string {
  return ADMIN_SECRET;
}

export async function isAdminLoggedIn(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === ADMIN_SECRET;
}

export { COOKIE_NAME };
