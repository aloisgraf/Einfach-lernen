import { NextResponse } from "next/server";
import { isAdminLoggedIn } from "@/lib/auth";
import { getAlleBuchungen, getSlot } from "@/lib/slots-store";

export async function GET() {
  if (!(await isAdminLoggedIn())) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }

  const buchungen = getAlleBuchungen().map((b) => ({
    ...b,
    slot: getSlot(b.zeitslot_id),
  }));
  return NextResponse.json(buchungen);
}
