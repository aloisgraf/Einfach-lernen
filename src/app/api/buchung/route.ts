import { NextRequest, NextResponse } from "next/server";
import { createBuchung } from "@/lib/slots-store";
import { z } from "zod";

const schema = z.object({
  zeitslot_id: z.string().min(1),
  vorname: z.string().min(2),
  nachname: z.string().min(2),
  alter: z.number().int().min(5).max(99),
  schulstufe: z.string().min(1),
  telefon: z.string().min(7),
  email: z.string().email(),
  nachricht: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    const result = createBuchung(data);

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Ungültige Eingabe." }, { status: 400 });
    }
    return NextResponse.json({ error: "Serverfehler." }, { status: 500 });
  }
}
