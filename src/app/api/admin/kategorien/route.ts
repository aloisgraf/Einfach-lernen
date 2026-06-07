import { NextRequest, NextResponse } from "next/server";
import { isAdminLoggedIn } from "@/lib/auth";
import { getKurskategorien, setKurskategorien } from "@/lib/einstellungen-store";
import { Kurskategorie } from "@/types/kategorie";

async function guard() {
  if (!(await isAdminLoggedIn())) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }
  return null;
}

function istGueltig(eintrag: unknown): eintrag is Kurskategorie {
  if (!eintrag || typeof eintrag !== "object") return false;
  const k = eintrag as Record<string, unknown>;
  return typeof k.id === "string" && k.id.trim().length > 0
    && typeof k.label === "string" && k.label.trim().length > 0
    && typeof k.emoji === "string" && k.emoji.trim().length > 0;
}

export async function GET() {
  const err = await guard();
  if (err) return err;

  const kategorien = await getKurskategorien();
  return NextResponse.json(kategorien);
}

export async function PUT(req: NextRequest) {
  const err = await guard();
  if (err) return err;

  const body = await req.json();
  if (!Array.isArray(body) || !body.every(istGueltig)) {
    return NextResponse.json({ error: "Ungültige Kategorienliste." }, { status: 400 });
  }

  const kategorien: Kurskategorie[] = body.map((k) => ({
    id: k.id.trim(),
    label: k.label.trim(),
    emoji: k.emoji.trim(),
  }));

  const ids = new Set(kategorien.map((k) => k.id));
  if (ids.size !== kategorien.length) {
    return NextResponse.json({ error: "Kategorie-IDs müssen eindeutig sein." }, { status: 400 });
  }

  try {
    await setKurskategorien(kategorien);
    return NextResponse.json(kategorien);
  } catch (e) {
    console.error("setKurskategorien error:", e);
    return NextResponse.json({ error: "Speichern fehlgeschlagen." }, { status: 500 });
  }
}
