import AdminLayout from "@/components/AdminLayout";
import { getAlleSlots, getAlleBuchungen, countBuchungenFuerSlot } from "@/lib/slots-store";
import { CalendarClock, Users, CheckCircle2, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [slots, buchungen] = await Promise.all([getAlleSlots(), getAlleBuchungen()]);

  const freigegeben = slots.filter((s) => s.freigegeben).length;
  const gesamt = slots.length;
  const heuteStr = new Date().toISOString().split("T")[0];
  const heuteSlots = slots.filter((s) => s.datum === heuteStr && s.freigegeben).length;
  const belegtePlaetze = buchungen.length;

  const naechsteSlots = slots
    .filter((s) => s.freigegeben && s.datum >= heuteStr)
    .slice(0, 5);

  const freibePlaetzeMap = new Map<string, number>();
  await Promise.all(
    naechsteSlots.map(async (s) => {
      const belegt = await countBuchungenFuerSlot(s.id);
      freibePlaetzeMap.set(s.id, s.max_teilnehmer - belegt);
    })
  );

  const neueBuchungen = buchungen.slice(0, 5);

  const stats = [
    { icon: CalendarClock, label: "Gesamt-Slots", value: gesamt, sub: `${freigegeben} freigegeben`, farbe: "bg-blue-50 text-blue-600" },
    { icon: CheckCircle2, label: "Freigegeben", value: freigegeben, sub: `${gesamt - freigegeben} gesperrt`, farbe: "bg-[#f0faf4] text-[#2d6a4f]" },
    { icon: Users, label: "Buchungen", value: belegtePlaetze, sub: "gesamt", farbe: "bg-amber-50 text-amber-600" },
    { icon: Clock, label: "Heute", value: heuteSlots, sub: "freie Slots", farbe: "bg-purple-50 text-purple-600" },
  ];

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-2xl font-extrabold text-[#1a1a2e] mb-1">Dashboard</h1>
        <p className="text-gray-400 text-sm mb-8">Willkommen zurück!</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map(({ icon: Icon, label, value, sub, farbe }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${farbe}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-3xl font-extrabold text-[#1a1a2e]">{value}</p>
              <p className="font-semibold text-sm text-gray-700 mt-0.5">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-[#1a1a2e] mb-4">Nächste Termine</h2>
            {naechsteSlots.length === 0 ? (
              <p className="text-gray-400 text-sm">Keine bevorstehenden Termine.</p>
            ) : (
              <div className="space-y-3">
                {naechsteSlots.map((slot) => {
                  const frei = freibePlaetzeMap.get(slot.id) ?? 0;
                  return (
                    <div key={slot.id} className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-sm text-[#1a1a2e]">{slot.titel}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(slot.datum + "T12:00:00").toLocaleDateString("de-AT", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}{" "}
                          · {slot.uhrzeit_von}–{slot.uhrzeit_bis}
                        </p>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        frei === 0 ? "bg-red-50 text-red-600" : "bg-[#d8f3e3] text-[#1b4332]"
                      }`}>
                        {frei === 0 ? "Ausgebucht" : `${frei} frei`}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-[#1a1a2e] mb-4">Letzte Buchungen</h2>
            {neueBuchungen.length === 0 ? (
              <p className="text-gray-400 text-sm">Noch keine Buchungen vorhanden.</p>
            ) : (
              <div className="space-y-3">
                {neueBuchungen.map((b) => (
                  <div key={b.id} className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-sm text-[#1a1a2e]">{b.name_kind}</p>
                      <p className="text-xs text-gray-400">{b.schulstufe} · {b.email}</p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {new Date(b.erstellt_am).toLocaleDateString("de-AT", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
