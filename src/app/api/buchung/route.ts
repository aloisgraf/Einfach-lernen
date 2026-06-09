import { NextRequest, NextResponse } from "next/server";
import { createBuchung, getSlot } from "@/lib/slots-store";
import { sendBuchungEmail } from "@/lib/email";
import { z } from "zod";

const schema = z.object({
  zeitslot_id: z.string().min(1),
  vorname: z.string().min(2),
  nachname: z.string().min(2),
  email: z.string().email(),
  telefon: z.string().min(7),
  name_kind: z.string().min(2),
  schulstufe: z.string().min(1),
  kind_lernen: z.string().min(3),
  kind_staerken: z.string().optional().default(""),
  kurs_name: z.string().optional().default("Unbekannter Kurs"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    const result = await createBuchung({ ...data, batch_id: crypto.randomUUID() });

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }
    const slot = await getSlot(data.zeitslot_id).catch(() => null);
    sendBuchungEmail(result, slot);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Ungültige Eingabe." }, { status: 400 });
    }
    return NextResponse.json({ error: "Serverfehler." }, { status: 500 });
  }
}
