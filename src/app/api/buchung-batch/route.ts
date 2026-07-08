import { NextRequest, NextResponse } from "next/server";
import { createBuchung, getSlot } from "@/lib/slots-store";
import { sendBuchungEmailBatch } from "@/lib/email";
import { textMitBuchstabe } from "@/lib/validation";
import { z } from "zod";

const itemSchema = z.object({
  zeitslot_id: z.string().min(1),
  name_kind: textMitBuchstabe(2),
  schulstufe: textMitBuchstabe(1),
  kind_lernen: textMitBuchstabe(3),
  kind_staerken: z.string().optional().default(""),
  kurs_name: z.string().min(1),
});

const schema = z.object({
  vorname: textMitBuchstabe(2),
  nachname: textMitBuchstabe(2),
  email: z.string().email(),
  telefon: z.string().min(7),
  bookings: z.array(itemSchema).min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const results = [];
    const slots = [];
    const batchId = crypto.randomUUID();

    // Erstelle alle Buchungen
    for (const booking of data.bookings) {
      const result = await createBuchung({
        zeitslot_id: booking.zeitslot_id,
        vorname: data.vorname,
        nachname: data.nachname,
        email: data.email,
        telefon: data.telefon,
        name_kind: booking.name_kind,
        schulstufe: booking.schulstufe,
        kind_lernen: booking.kind_lernen,
        kind_staerken: booking.kind_staerken,
        kurs_name: booking.kurs_name,
        batch_id: batchId,
        status: "confirmed",
      });

      if ("error" in result) {
        return NextResponse.json({ error: result.error }, { status: 409 });
      }

      results.push(result);
      const slot = await getSlot(booking.zeitslot_id).catch(() => null);
      if (slot) slots.push(slot);
    }

    // Versende eine Sammelmail
    if (results.length > 0) {
      sendBuchungEmailBatch(results, slots, data.vorname, data.nachname);
    }

    return NextResponse.json({ bookings: results }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Ungültige Eingabe." }, { status: 400 });
    }
    return NextResponse.json({ error: "Serverfehler." }, { status: 500 });
  }
}
