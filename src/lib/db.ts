import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL;

declare global {
  // eslint-disable-next-line no-var
  var __db: ReturnType<typeof postgres> | undefined;
}

export function getDb() {
  if (!DATABASE_URL) return null;
  if (!global.__db) {
    global.__db = postgres(DATABASE_URL, {
      ssl: { rejectUnauthorized: false },
      max: 3,
      idle_timeout: 20,
      connect_timeout: 10,
      // Bounds query execution so a slow/sleeping database fails fast and the
      // in-memory fallback in den *-store Modulen sofort greift, statt die
      // Seite minutenlang hängen zu lassen.
      connection: { statement_timeout: 8000 },
      // Verhindert die interne "fetch array types"-Abfrage von postgres.js beim
      // Verbindungsaufbau – deren Promise wird von der Bibliothek nicht
      // abgefangen, wodurch ein Statement-Timeout als unhandledRejection
      // durchschlägt. Wir definieren Typ-Parser ohnehin selbst (siehe unten).
      fetch_types: false,
      prepare: false,
      types: {
        date: {
          from: [1082],
          to: 1082,
          parse: (x: string) => x,
          serialize: (x: string) => x,
        },
        timestamptz: {
          from: [1184],
          to: 1184,
          parse: (x: string) => x,
          serialize: (x: string) => x,
        },
        timestamp: {
          from: [1114],
          to: 1114,
          parse: (x: string) => x,
          serialize: (x: string) => x,
        },
      },
    });
  }
  return global.__db;
}

export function isDbConfigured(): boolean {
  return Boolean(DATABASE_URL);
}
