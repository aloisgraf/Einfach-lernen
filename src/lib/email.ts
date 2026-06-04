import { Resend } from "resend";
import { Buchung, Zeitslot } from "@/types/buchung";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "alois2024@gmx.at";
const FROM_EMAIL = process.env.FROM_EMAIL ?? "buchung@einfachlernen.at";

export async function sendBuchungEmail(buchung: Buchung, slot: Zeitslot | null) {
  if (!resend) return;

  const datum = slot
    ? new Date(slot.datum + "T12:00:00").toLocaleDateString("de-AT", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "–";
  const zeit = slot ? `${slot.uhrzeit_von}–${slot.uhrzeit_bis} Uhr` : "–";
  const slotTitel = slot?.titel ?? "–";

  const html = `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; background: #f4f6f5; margin: 0; padding: 24px;">
  <div style="max-width: 560px; margin: 0 auto; background: #fff; border-radius: 12px; border: 1px solid #e8eceb; overflow: hidden;">

    <div style="background: #1a5c4a; padding: 24px 28px;">
      <p style="color: #fff; font-size: 20px; font-weight: 800; margin: 0;">Neue Buchung</p>
      <p style="color: rgba(255,255,255,0.75); font-size: 13px; margin: 4px 0 0;">Einfach Lernen Pongau</p>
    </div>

    <div style="padding: 28px;">

      <div style="background: #eaf4ef; border-radius: 8px; padding: 14px 18px; margin-bottom: 20px;">
        <p style="font-size: 13px; font-weight: 700; color: #1a5c4a; margin: 0 0 4px;">${slotTitel}</p>
        <p style="font-size: 13px; color: #374151; margin: 0;">${datum} · ${zeit}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <tr><td colspan="2" style="padding: 10px 0 6px; font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em;">Elternteil</td></tr>
        <tr>
          <td style="padding: 4px 0; color: #6b7280; width: 140px;">Name</td>
          <td style="padding: 4px 0; color: #111827; font-weight: 600;">${buchung.vorname} ${buchung.nachname}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #6b7280;">E-Mail</td>
          <td style="padding: 4px 0; color: #111827;"><a href="mailto:${buchung.email}" style="color: #1a5c4a;">${buchung.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #6b7280;">Telefon</td>
          <td style="padding: 4px 0; color: #111827;">${buchung.telefon}</td>
        </tr>

        <tr><td colspan="2" style="padding: 16px 0 6px; font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em;">Kind</td></tr>
        <tr>
          <td style="padding: 4px 0; color: #6b7280;">Name</td>
          <td style="padding: 4px 0; color: #111827; font-weight: 600;">${buchung.name_kind}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #6b7280;">Schulstufe</td>
          <td style="padding: 4px 0; color: #111827;">${buchung.schulstufe}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #6b7280; vertical-align: top;">Stärken</td>
          <td style="padding: 4px 0; color: #111827;">${buchung.kind_staerken}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #6b7280; vertical-align: top;">Noch lernen</td>
          <td style="padding: 4px 0; color: #111827;">${buchung.kind_lernen}</td>
        </tr>
      </table>

    </div>

    <div style="padding: 16px 28px; border-top: 1px solid #e8eceb; text-align: center;">
      <p style="font-size: 11px; color: #9ca3af; margin: 0;">Einfach Lernen Pongau · Automatische Benachrichtigung</p>
    </div>
  </div>
</body>
</html>`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `Neue Buchung: ${buchung.name_kind} – ${slotTitel}`,
      html,
    });
  } catch (e) {
    console.error("Email senden fehlgeschlagen:", e);
  }
}
