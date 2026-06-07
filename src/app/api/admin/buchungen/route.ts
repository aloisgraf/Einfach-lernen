import { NextRequest, NextResponse } from "next/server";
import { isAdminLoggedIn } from "@/lib/auth";
import { getAlleBuchungen, getAlleSlots, deleteBuchung } from "@/lib/slots-store";

export async function GET() {
  if (!(await isAdminLoggedIn())) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }

  const [buchungen, slots] = await Promise.all([getAlleBuchungen(), getAlleSlots()]);
  const slotsById = new Map(slots.map((s) => [s.id, s]));

  const result = buchungen.map((b) => ({
    ...b,
    slot: slotsById.get(b.zeitslot_id) ?? null,
  }));
  return NextResponse.json(result);
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdminLoggedIn())) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "ID fehlt." }, { status: 400 });

  try {
    const ok = await deleteBuchung(id);
    if (!ok) return NextResponse.json({ error: "Buchung nicht gefunden." }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("deleteBuchung:", e);
    return NextResponse.json({ error: "Fehler beim Löschen." }, { status: 500 });
  }
}
