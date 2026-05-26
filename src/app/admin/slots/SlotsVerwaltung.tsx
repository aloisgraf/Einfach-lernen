"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Pencil, Trash2, Eye, EyeOff, X, Check, Loader2,
  CalendarClock,
} from "lucide-react";
import { Zeitslot } from "@/types/buchung";
import { cn } from "@/lib/utils";

interface SlotMitPlaetzen extends Zeitslot {
  freie_plaetze: number;
}

interface Props {
  initialSlots: SlotMitPlaetzen[];
}

const leerFormular = {
  titel: "",
  beschreibung: "",
  datum: "",
  uhrzeit_von: "",
  uhrzeit_bis: "",
  max_teilnehmer: "1",
  freigegeben: false,
};

export default function SlotsVerwaltung({ initialSlots }: Props) {
  const router = useRouter();
  const [slots, setSlots] = useState(initialSlots);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState(leerFormular);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  function openNeu() {
    setEditId(null);
    setFormData(leerFormular);
    setFormOpen(true);
  }

  function openEdit(slot: SlotMitPlaetzen) {
    setEditId(slot.id);
    setFormData({
      titel: slot.titel,
      beschreibung: slot.beschreibung ?? "",
      datum: slot.datum,
      uhrzeit_von: slot.uhrzeit_von,
      uhrzeit_bis: slot.uhrzeit_bis,
      max_teilnehmer: String(slot.max_teilnehmer),
      freigegeben: slot.freigegeben,
    });
    setFormOpen(true);
  }

  async function handleSpeichern() {
    setLoading(true);
    try {
      const body = {
        ...formData,
        max_teilnehmer: Number(formData.max_teilnehmer),
        ...(editId ? { id: editId } : {}),
      };
      const res = await fetch("/api/admin/slots", {
        method: editId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      router.refresh();
      // Optimistisches Update
      const saved = await res.json();
      if (editId) {
        setSlots((prev) =>
          prev.map((s) =>
            s.id === editId ? { ...saved, freie_plaetze: s.freie_plaetze } : s
          )
        );
      } else {
        setSlots((prev) => [
          ...prev,
          { ...saved, freie_plaetze: Number(formData.max_teilnehmer) },
        ]);
      }
      setFormOpen(false);
    } catch {
      alert("Fehler beim Speichern.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLoeschen(id: string) {
    if (!confirm("Zeitslot wirklich löschen?")) return;
    setDeletingId(id);
    try {
      await fetch("/api/admin/slots", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setSlots((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert("Fehler beim Löschen.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleToggle(slot: SlotMitPlaetzen) {
    setTogglingId(slot.id);
    try {
      const res = await fetch("/api/admin/slots", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: slot.id, freigegeben: !slot.freigegeben }),
      });
      const updated = await res.json();
      setSlots((prev) =>
        prev.map((s) =>
          s.id === slot.id ? { ...updated, freie_plaetze: s.freie_plaetze } : s
        )
      );
    } catch {
      alert("Fehler.");
    } finally {
      setTogglingId(null);
    }
  }

  function formatDatum(datum: string) {
    return new Date(datum + "T12:00:00").toLocaleDateString("de-AT", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1a1a2e]">Zeitslots</h1>
          <p className="text-gray-400 text-sm">{slots.length} Slots gesamt</p>
        </div>
        <button
          onClick={openNeu}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#2d6a4f] text-white font-semibold text-sm rounded-xl hover:bg-[#1b4332] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Neuer Slot
        </button>
      </div>

      {/* Tabelle */}
      {slots.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <CalendarClock className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400">Noch keine Zeitslots angelegt.</p>
          <button
            onClick={openNeu}
            className="mt-4 px-5 py-2 bg-[#2d6a4f] text-white text-sm font-semibold rounded-xl hover:bg-[#1b4332] transition-colors"
          >
            Ersten Slot erstellen
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                    Titel
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                    Datum
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                    Zeit
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                    Plätze
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-right px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody>
                {slots.map((slot) => (
                  <tr key={slot.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-[#1a1a2e]">{slot.titel}</p>
                      {slot.beschreibung && (
                        <p className="text-xs text-gray-400 mt-0.5">{slot.beschreibung}</p>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-gray-600">{formatDatum(slot.datum)}</td>
                    <td className="px-4 py-3.5 text-gray-600">
                      {slot.uhrzeit_von}–{slot.uhrzeit_bis}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={cn(
                        "text-xs font-semibold px-2.5 py-1 rounded-full",
                        slot.freie_plaetze === 0
                          ? "bg-red-50 text-red-600"
                          : "bg-[#d8f3e3] text-[#1b4332]"
                      )}>
                        {slot.freie_plaetze}/{slot.max_teilnehmer}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => handleToggle(slot)}
                        disabled={togglingId === slot.id}
                        className={cn(
                          "inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all",
                          slot.freigegeben
                            ? "bg-[#d8f3e3] text-[#1b4332] hover:bg-red-50 hover:text-red-600"
                            : "bg-gray-100 text-gray-500 hover:bg-[#d8f3e3] hover:text-[#1b4332]"
                        )}
                        title={slot.freigegeben ? "Klicken zum Sperren" : "Klicken zum Freigeben"}
                      >
                        {togglingId === slot.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : slot.freigegeben ? (
                          <Eye className="w-3 h-3" />
                        ) : (
                          <EyeOff className="w-3 h-3" />
                        )}
                        {slot.freigegeben ? "Freigegeben" : "Gesperrt"}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(slot)}
                          className="p-2 rounded-lg text-gray-400 hover:text-[#2d6a4f] hover:bg-[#f0faf4] transition-colors"
                          title="Bearbeiten"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleLoeschen(slot.id)}
                          disabled={deletingId === slot.id}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Löschen"
                        >
                          {deletingId === slot.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Neu / Bearbeiten */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setFormOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-[#1a1a2e]">
                {editId ? "Slot bearbeiten" : "Neuer Zeitslot"}
              </h2>
              <button onClick={() => setFormOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Titel *</label>
                <input
                  type="text"
                  value={formData.titel}
                  onChange={(e) => setFormData((d) => ({ ...d, titel: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788]"
                  placeholder="z.B. Nachhilfe Mathematik"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Beschreibung (optional)
                </label>
                <input
                  type="text"
                  value={formData.beschreibung}
                  onChange={(e) => setFormData((d) => ({ ...d, beschreibung: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788]"
                  placeholder="Kurze Zusatzinfo"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Datum *</label>
                <input
                  type="date"
                  value={formData.datum}
                  onChange={(e) => setFormData((d) => ({ ...d, datum: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Von *</label>
                  <input
                    type="time"
                    value={formData.uhrzeit_von}
                    onChange={(e) => setFormData((d) => ({ ...d, uhrzeit_von: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Bis *</label>
                  <input
                    type="time"
                    value={formData.uhrzeit_bis}
                    onChange={(e) => setFormData((d) => ({ ...d, uhrzeit_bis: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Max. Teilnehmer *
                </label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={formData.max_teilnehmer}
                  onChange={(e) => setFormData((d) => ({ ...d, max_teilnehmer: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788]"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-gray-200 hover:border-[#52b788] hover:bg-[#f9fafb] transition-colors">
                <input
                  type="checkbox"
                  checked={formData.freigegeben}
                  onChange={(e) => setFormData((d) => ({ ...d, freigegeben: e.target.checked }))}
                  className="w-4 h-4 accent-[#2d6a4f]"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-700">Sofort freigeben</p>
                  <p className="text-xs text-gray-400">
                    Der Slot ist sofort im Kalender buchbar
                  </p>
                </div>
              </label>
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => setFormOpen(false)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={handleSpeichern}
                disabled={loading || !formData.titel || !formData.datum || !formData.uhrzeit_von || !formData.uhrzeit_bis}
                className="flex-1 py-2.5 bg-[#2d6a4f] text-white text-sm font-semibold rounded-xl hover:bg-[#1b4332] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                {editId ? "Speichern" : "Erstellen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
