import AdminLayout from "@/components/AdminLayout";
import { getAlleBuchungen, getAlleSlots } from "@/lib/slots-store";
import { Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BuchungenPage() {
  const [buchungen, slots] = await Promise.all([getAlleBuchungen(), getAlleSlots()]);
  const slotsById = new Map(slots.map((s) => [s.id, s]));

  const buchungenMitSlot = buchungen.map((b) => ({
    ...b,
    slot: slotsById.get(b.zeitslot_id) ?? null,
  }));

  function formatDatum(datum: string) {
    return new Date(datum + "T12:00:00").toLocaleDateString("de-AT", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-[#1a1a2e]">Buchungen</h1>
          <p className="text-gray-400 text-sm">{buchungenMitSlot.length} Buchungen gesamt</p>
        </div>

        {buchungenMitSlot.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400">Noch keine Buchungen vorhanden.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {buchungenMitSlot.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    {b.slot ? (
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#d8f3e3] text-[#1b4332] text-xs font-semibold rounded-full mb-2">
                        {b.slot.titel} · {formatDatum(b.slot.datum)} · {b.slot.uhrzeit_von}–{b.slot.uhrzeit_bis} Uhr
                      </div>
                    ) : (
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-400 text-xs rounded-full mb-2">
                        Slot gelöscht
                      </span>
                    )}
                    <p className="text-xs text-gray-400">
                      Angemeldet am{" "}
                      {new Date(b.erstellt_am).toLocaleDateString("de-AT", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Elternteil
                    </p>
                    <p className="font-semibold text-[#1a1a2e]">
                      {b.vorname} {b.nachname}
                    </p>
                    <p className="text-sm text-gray-600 mt-0.5">{b.email}</p>
                    <p className="text-sm text-gray-600">{b.telefon}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Kind
                    </p>
                    <p className="font-semibold text-[#1a1a2e]">{b.name_kind}</p>
                    <p className="text-sm text-gray-600 mt-0.5">{b.schulstufe}</p>
                  </div>

                  <div className="bg-[#f0faf4] rounded-xl p-4 sm:col-span-2 lg:col-span-1">
                    <p className="text-xs font-semibold text-[#1b4332] uppercase tracking-wide mb-2">
                      Stärken & Lernbedarf
                    </p>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-500">Kann gut:</p>
                        <p className="text-sm text-gray-700">{b.kind_staerken}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Noch lernen:</p>
                        <p className="text-sm text-gray-700">{b.kind_lernen}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
