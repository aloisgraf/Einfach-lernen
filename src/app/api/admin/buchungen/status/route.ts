import { NextRequest, NextResponse } from "next/server";
import { updateBuchungStatus, deleteBuchung } from "@/lib/slots-store";
import { z } from "zod";

const schema = z.object({
  buchungId: z.string().min(1),
  status: z.enum(["pending", "confirmed", "rejected"]),
});

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { buchungId, status } = schema.parse(body);

    const result = await updateBuchungStatus(buchungId, status);
    if (!result) {
      return NextResponse.json({ error: "Buchung nicht gefunden" }, { status: 404 });
    }

    // Bei Ablehnung: Buchung löschen, damit der Platz wieder freigegeben wird
    if (status === "rejected") {
      await deleteBuchung(buchungId);
    }

    return NextResponse.json({ success: true, buchung: result });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Ungültige Eingabe" }, { status: 400 });
    }
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}
