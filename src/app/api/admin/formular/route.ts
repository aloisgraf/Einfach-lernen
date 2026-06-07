import { NextRequest, NextResponse } from "next/server";
import { isAdminLoggedIn } from "@/lib/auth";
import { getBuchungsformularTexte, setBuchungsformularTexte } from "@/lib/einstellungen-store";
import { STANDARD_FORMULAR_TEXTE, BuchungsformularTexte } from "@/types/formular";

async function guard() {
  if (!(await isAdminLoggedIn())) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const err = await guard();
  if (err) return err;
  const texte = await getBuchungsformularTexte();
  return NextResponse.json(texte);
}

export async function PUT(req: NextRequest) {
  const err = await guard();
  if (err) return err;

  const body = await req.json();
  const texte = { ...STANDARD_FORMULAR_TEXTE };
  for (const key of Object.keys(STANDARD_FORMULAR_TEXTE) as (keyof BuchungsformularTexte)[]) {
    if (typeof body[key] === "string" && body[key].trim()) texte[key] = body[key].trim();
  }

  try {
    await setBuchungsformularTexte(texte);
    return NextResponse.json(texte);
  } catch (e) {
    console.error("setBuchungsformularTexte:", e);
    return NextResponse.json({ error: "Speichern fehlgeschlagen." }, { status: 500 });
  }
}
