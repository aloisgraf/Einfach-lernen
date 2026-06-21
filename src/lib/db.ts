import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL;

declare global {
  // eslint-disable-next-line no-var
  var __db: ReturnType<typeof postgres> | undefined;
}

function createDb() {
  return postgres(DATABASE_URL!, {
    ssl: "require",
    max: 5,
    idle_timeout: 30,
    connect_timeout: 10,
    connection: { statement_timeout: 8000 },
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
      numeric: {
        from: [1700],
        to: 1700,
        parse: (x: string) => (x === null ? null : parseFloat(x)),
        serialize: (x: number) => String(x),
      },
    },
  });
}

export function getDb() {
  if (!DATABASE_URL) return null;
  if (!global.__db) global.__db = createDb();
  return global.__db;
}

/**
 * Verwirft den globalen Connection-Pool und erzeugt beim nächsten getDb()-Aufruf
 * einen neuen. Wird nach Timeouts aufgerufen, damit hängende Verbindungen nicht
 * den Pool dauerhaft blockieren.
 */
export function resetDb() {
  if (global.__db) {
    global.__db.end({ timeout: 1 }).catch(() => {});
    global.__db = undefined;
  }
}

export function isDbConfigured(): boolean {
  return Boolean(DATABASE_URL);
}

export function mitTimeout<T>(promise: Promise<T>, ms = 12000): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`DB-Timeout nach ${ms}ms`)), ms);
    promise.then(
      (value) => { clearTimeout(timer); resolve(value); },
      (err) => { clearTimeout(timer); reject(err); }
    );
  });
}
