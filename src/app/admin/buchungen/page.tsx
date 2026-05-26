import AdminLayout from "@/components/AdminLayout";
import { getAlleBuchungen, getSlot } from "@/lib/slots-store";
import { Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default function BuchungenPage() {
  const buchungen = getAlleBuchungen().map((b) => ({
    ...b,
    slot: getSlot(b.zeitslot_id),
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
          <p className="text-gray-400 text-sm">{buchungen.length} Buchungen gesamt</p>
        </div>

        {buchungen.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400">Noch keine Buchungen vorhanden.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {["Name", "Alter", "Schulstufe", "Kontakt", "Gebuchter Slot", "Angemeldet am"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide whitespace-nowrap"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {buchungen.map((b) => (
                    <tr
                      key={b.id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-[#1a1a2e]">
                          {b.vorname} {b.nachname}
                        </p>
                      </td>
                      <td className="px-5 py-3.5 text-gray-600">{b.alter} Jahre</td>
                      <td className="px-5 py-3.5 text-gray-600 max-w-[180px]">
                        <span className="block truncate">{b.schulstufe}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-gray-700">{b.telefon}</p>
                        <p className="text-gray-400 text-xs">{b.email}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        {b.slot ? (
                          <div>
                            <p className="font-semibold text-[#1a1a2e] text-xs">{b.slot.titel}</p>
                            <p className="text-gray-400 text-xs">
                              {formatDatum(b.slot.datum)} ·{" "}
                              {b.slot.uhrzeit_von}–{b.slot.uhrzeit_bis}
                            </p>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">Slot gelöscht</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                        {new Date(b.erstellt_am).toLocaleDateString("de-AT", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
