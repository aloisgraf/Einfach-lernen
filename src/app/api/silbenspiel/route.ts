import { NextResponse } from "next/server";
import { getAktiveSilbenWoerter } from "@/lib/silbenspiel-store";

export async function GET() {
  try {
    const woerter = await getAktiveSilbenWoerter();
    return NextResponse.json(woerter);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: `DB-Fehler: ${msg}` }, { status: 500 });
  }
}
