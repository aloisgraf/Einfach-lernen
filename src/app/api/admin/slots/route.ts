import { NextRequest, NextResponse } from "next/server";
import { isAdminLoggedIn } from "@/lib/auth";
import {
  getAlleSlots,
  createSlot,
  updateSlot,
  deleteSlot,
  getFreiePlaetze,
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

  const slots = getAlleSlots().map((s) => ({
    ...s,
    freie_plaetze: getFreiePlaetze(s.id),
  }));
  return NextResponse.json(slots);
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

  const slot = createSlot({
    titel,
    beschreibung,
    datum,
    uhrzeit_von,
    uhrzeit_bis,
    max_teilnehmer: Number(max_teilnehmer) || 1,
    freigegeben: Boolean(freigegeben),
  });
  return NextResponse.json(slot, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const err = await guard();
  if (err) return err;

  const body = await req.json();
  const { id, ...patch } = body;
  if (!id) return NextResponse.json({ error: "ID fehlt." }, { status: 400 });

  const updated = updateSlot(id, patch);
  if (!updated) return NextResponse.json({ error: "Slot nicht gefunden." }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const err = await guard();
  if (err) return err;

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "ID fehlt." }, { status: 400 });

  const ok = deleteSlot(id);
  if (!ok) return NextResponse.json({ error: "Slot nicht gefunden." }, { status: 404 });
  return NextResponse.json({ success: true });
}
