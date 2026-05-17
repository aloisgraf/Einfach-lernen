import { NextRequest, NextResponse } from "next/server";
import { createAnmeldung } from "@/lib/supabase";
import { Anmeldung } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { kurs_id, einheit_id, vorname, nachname, email, telefon, geburtsdatum, nachricht } =
      body as Partial<Anmeldung>;

    if (!kurs_id || !einheit_id || !vorname || !nachname || !email || !telefon) {
      return NextResponse.json(
        { error: "Pflichtfelder fehlen." },
        { status: 400 }
      );
    }

    const anmeldung: Anmeldung = {
      kurs_id,
      einheit_id,
      vorname,
      nachname,
      email,
      telefon,
      geburtsdatum,
      nachricht,
      status: "ausstehend",
      erstellt_am: new Date().toISOString(),
    };

    await createAnmeldung(anmeldung);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Anmeldungs-Fehler:", err);
    return NextResponse.json(
      { error: "Interne Server-Fehler. Bitte später erneut versuchen." },
      { status: 500 }
    );
  }
}
