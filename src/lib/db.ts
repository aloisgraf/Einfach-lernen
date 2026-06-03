import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL;

declare global {
  // eslint-disable-next-line no-var
  var __db: ReturnType<typeof postgres> | undefined;
}

export function getDb() {
  if (!DATABASE_URL) return null;
  if (!global.__db) {
    global.__db = postgres(DATABASE_URL, { ssl: "require" });
  }
  return global.__db;
}

export function isDbConfigured(): boolean {
  return Boolean(DATABASE_URL);
}
