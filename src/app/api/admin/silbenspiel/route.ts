import { NextRequest, NextResponse } from "next/server";
import { isAdminLoggedIn } from "@/lib/auth";
import {
  getAlleSilbenWoerter,
  createSilbenWort,
  updateSilbenWort,
  deleteSilbenWort,
} from "@/lib/silbenspiel-store";

async function guard() {
  if (!(await isAdminLoggedIn())) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const err = await guard();
  if (err) return err;

  try {
    const woerter = await getAlleSilbenWoerter();
    return NextResponse.json(woerter);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: `DB-Fehler: ${msg}` }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const err = await guard();
  if (err) return err;

  const body = await req.json();
  const { wort, silben } = body;

  if (!wort || !Array.isArray(silben) || silben.length === 0) {
    return NextResponse.json({ error: "Pflichtfelder fehlen." }, { status: 400 });
  }

  try {
    const created = await createSilbenWort({
      wort: String(wort).trim(),
      silben: silben.map((s: string) => String(s).trim()).filter(Boolean),
      aktiv: true,
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("createSilbenWort error:", msg);
    return NextResponse.json({ error: `DB-Fehler: ${msg}` }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const err = await guard();
  if (err) return err;

  const body = await req.json();
  const { id, ...patch } = body;
  if (!id) return NextResponse.json({ error: "ID fehlt." }, { status: 400 });

  try {
    const updated = await updateSilbenWort(id, patch);
    if (!updated) return NextResponse.json({ error: "Wort nicht gefunden." }, { status: 404 });
    return NextResponse.json(updated);
  } catch (e) {
    console.error("updateSilbenWort:", e);
    return NextResponse.json({ error: "Datenbankfehler. SQL-Tabellen prüfen." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const err = await guard();
  if (err) return err;

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "ID fehlt." }, { status: 400 });

  try {
    const ok = await deleteSilbenWort(id);
    if (!ok) return NextResponse.json({ error: "Wort nicht gefunden." }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("deleteSilbenWort:", e);
    return NextResponse.json({ error: "Datenbankfehler. SQL-Tabellen prüfen." }, { status: 500 });
  }
}
