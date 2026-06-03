import { NextResponse } from "next/server";
import { isAdminLoggedIn } from "@/lib/auth";
import { getAlleBuchungen, getAlleSlots } from "@/lib/slots-store";

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
