import { NextRequest, NextResponse } from "next/server";
import { isAdminLoggedIn } from "@/lib/auth";
import { getWebsiteTexte, setWebsiteTexte } from "@/lib/einstellungen-store";
import { STANDARD_WEBSITE_TEXTE, WebsiteTexte } from "@/types/website-texte";

async function guard() {
  if (!(await isAdminLoggedIn())) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const err = await guard();
  if (err) return err;
  const texte = await getWebsiteTexte();
  return NextResponse.json(texte);
}

export async function PUT(req: NextRequest) {
  const err = await guard();
  if (err) return err;

  const body = await req.json();
  const texte = { ...STANDARD_WEBSITE_TEXTE } as WebsiteTexte;

  for (const modul of Object.keys(STANDARD_WEBSITE_TEXTE) as (keyof WebsiteTexte)[]) {
    const eingabe = body?.[modul];
    if (!eingabe || typeof eingabe !== "object") continue;
    const standard = STANDARD_WEBSITE_TEXTE[modul];
    const ergebnis = { ...standard };
    for (const feld of Object.keys(standard) as (keyof typeof standard)[]) {
      if (typeof eingabe[feld] === "string" && eingabe[feld].trim()) {
        (ergebnis as Record<string, string>)[feld as string] = eingabe[feld];
      }
    }
    (texte as unknown as Record<string, unknown>)[modul] = ergebnis;
  }

  try {
    await setWebsiteTexte(texte);
    return NextResponse.json(texte);
  } catch (e) {
    console.error("setWebsiteTexte:", e);
    return NextResponse.json({ error: "Speichern fehlgeschlagen." }, { status: 500 });
  }
}
