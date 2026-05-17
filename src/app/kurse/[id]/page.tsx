import { notFound } from "next/navigation";
import { getKurs } from "@/lib/supabase";
import { Metadata } from "next";
import KursDetailClient from "./KursDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const kurs = await getKurs(id);
  if (!kurs) return { title: "Kurs nicht gefunden" };
  return {
    title: `${kurs.titel} | Einfach Lernen Pongau`,
    description: kurs.beschreibung,
  };
}

export default async function KursDetailPage({ params }: Props) {
  const { id } = await params;
  const kurs = await getKurs(id);
  if (!kurs) notFound();
  return <KursDetailClient kurs={kurs} />;
}
