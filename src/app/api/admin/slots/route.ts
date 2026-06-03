import { NextRequest, NextResponse } from "next/server";
import { isAdminLoggedIn } from "@/lib/auth";
import {
  getAlleSlots,
  createSlot,
  updateSlot,
  deleteSlot,
  countBuchungenFuerSlot,
} from "@/lib/slots-store";

async function guard() {
  if (!(await isAdminLoggedIn())) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const err = await guard();
  if (err) return err;

  const slots = await getAlleSlots();
  const slotsWithPlaetze = await Promise.all(
    slots.map(async (s) => ({
      ...s,
      freie_plaetze: s.max_teilnehmer - (await countBuchungenFuerSlot(s.id)),
    }))
  );
  return NextResponse.json(slotsWithPlaetze);
}

export async function POST(req: NextRequest) {
  const err = await guard();
  if (err) return err;

  const body = await req.json();
  const { titel, beschreibung, datum, uhrzeit_von, uhrzeit_bis, max_teilnehmer, freigegeben } =
    body;

  if (!titel || !datum || !uhrzeit_von || !uhrzeit_bis) {
    return NextResponse.json({ error: "Pflichtfelder fehlen." }, { status: 400 });
  }

  try {
    const slot = await createSlot({
      titel,
      beschreibung,
      datum,
      uhrzeit_von,
      uhrzeit_bis,
      max_teilnehmer: Number(max_teilnehmer) || 1,
      freigegeben: Boolean(freigegeben),
    });
    return NextResponse.json(slot, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("createSlot error:", msg);
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
    const updated = await updateSlot(id, patch);
    if (!updated) return NextResponse.json({ error: "Slot nicht gefunden." }, { status: 404 });
    return NextResponse.json(updated);
  } catch (e) {
    console.error("updateSlot:", e);
    return NextResponse.json({ error: "Datenbankfehler. SQL-Tabellen prüfen." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const err = await guard();
  if (err) return err;

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "ID fehlt." }, { status: 400 });

  try {
    const ok = await deleteSlot(id);
    if (!ok) return NextResponse.json({ error: "Slot nicht gefunden." }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("deleteSlot:", e);
    return NextResponse.json({ error: "Datenbankfehler. SQL-Tabellen prüfen." }, { status: 500 });
  }
}
