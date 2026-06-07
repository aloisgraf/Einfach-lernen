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

interface Termin {
  datum: string;
  uhrzeit_von: string;
  uhrzeit_bis: string;
}

export async function POST(req: NextRequest) {
  const err = await guard();
  if (err) return err;

  const body = await req.json();
  const { titel, kurs, notizen, beschreibung, max_teilnehmer, freigegeben, preis, preis_2er, preis_5er, preis_10er, termine, alsGruppe } = body;

  const zuZahl = (v: unknown): number | null =>
    v === "" || v === null || v === undefined ? null : Number(v);

  if (!titel) {
    return NextResponse.json({ error: "Pflichtfelder fehlen." }, { status: 400 });
  }
  if (!Array.isArray(termine) || termine.length === 0) {
    return NextResponse.json({ error: "Mindestens ein Termin (Datum + Uhrzeit) erforderlich." }, { status: 400 });
  }
  const gueltigeTermine: Termin[] = termine.filter(
    (t: unknown): t is Termin =>
      !!t && typeof t === "object" &&
      typeof (t as Termin).datum === "string" && (t as Termin).datum !== "" &&
      typeof (t as Termin).uhrzeit_von === "string" && (t as Termin).uhrzeit_von !== "" &&
      typeof (t as Termin).uhrzeit_bis === "string" && (t as Termin).uhrzeit_bis !== ""
  );
  if (gueltigeTermine.length !== termine.length) {
    return NextResponse.json({ error: "Bitte bei jedem Termin Datum, Von- und Bis-Uhrzeit angeben." }, { status: 400 });
  }

  const gruppeId = alsGruppe && gueltigeTermine.length > 1 ? crypto.randomUUID() : null;

  const basisDaten = {
    titel,
    kurs: kurs || "Einzelstunde",
    notizen,
    beschreibung,
    max_teilnehmer: Number(max_teilnehmer) || 1,
    freigegeben: Boolean(freigegeben),
    preis: zuZahl(preis),
    preis_2er: zuZahl(preis_2er),
    preis_5er: zuZahl(preis_5er),
    preis_10er: zuZahl(preis_10er),
  };

  try {
    const erstellt = [];
    for (const termin of gueltigeTermine) {
      erstellt.push(
        await createSlot({
          ...basisDaten,
          datum: termin.datum,
          uhrzeit_von: termin.uhrzeit_von,
          uhrzeit_bis: termin.uhrzeit_bis,
          gruppe_id: gruppeId,
        })
      );
    }
    return NextResponse.json(erstellt, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const stack = e instanceof Error ? e.stack : "";
    console.error("createSlot error:", msg, stack);
    return NextResponse.json({
      error: "Datenbankfehler beim Speichern.",
      details: msg
    }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const err = await guard();
  if (err) return err;

  const body = await req.json();
  const { id, ...patch } = body;
  if (!id) return NextResponse.json({ error: "ID fehlt." }, { status: 400 });

  const zuZahl = (v: unknown): number | null =>
    v === "" || v === null || v === undefined ? null : Number(v);
  if ("preis" in patch) patch.preis = zuZahl(patch.preis);
  if ("preis_2er" in patch) patch.preis_2er = zuZahl(patch.preis_2er);
  if ("preis_5er" in patch) patch.preis_5er = zuZahl(patch.preis_5er);
  if ("preis_10er" in patch) patch.preis_10er = zuZahl(patch.preis_10er);

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
