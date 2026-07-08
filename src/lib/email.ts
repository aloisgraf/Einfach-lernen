import { Resend } from "resend";
import nodemailer from "nodemailer";
import { Buchung, Zeitslot } from "@/types/buchung";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const FROM_EMAIL = process.env.FROM_EMAIL ?? "onboarding@resend.dev";

// ── SMTP (Webhost-Postfach) ───────────────────────────────────────────────────
// Wenn SMTP_HOST gesetzt ist, wird das eigene Postfach des Webhosters per SMTP
// zum Versand genutzt (bevorzugt vor Resend). Benötigte Env-Variablen:
//   SMTP_HOST   z.B. smtp.deinanbieter.at
//   SMTP_PORT   465 (SSL) oder 587 (STARTTLS) – Standard 465
//   SMTP_USER   vollständige Mailadresse / Benutzername
//   SMTP_PASS   Passwort des Postfachs
//   SMTP_FROM   Absenderadresse (optional, sonst SMTP_USER)
//   SMTP_SECURE "true"/"false" (optional, sonst true bei Port 465)
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT ?? 465);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM ?? SMTP_USER;
const SMTP_SECURE = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : SMTP_PORT === 465;

const smtpTransport =
  SMTP_HOST && SMTP_USER && SMTP_PASS
    ? nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_SECURE,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      })
    : null;

/**
 * Versendet eine Mail an die Admin-Adresse – bevorzugt per SMTP (eigenes
 * Postfach), fällt sonst auf Resend zurück. Gibt still zurück, wenn nichts
 * konfiguriert ist.
 */
async function sendMail(subject: string, html: string): Promise<void> {
  if (!ADMIN_EMAIL) return;

  if (smtpTransport) {
    try {
      await smtpTransport.sendMail({ from: SMTP_FROM, to: ADMIN_EMAIL, subject, html });
      console.log("Email (SMTP) gesendet an", ADMIN_EMAIL);
      return;
    } catch (e) {
      console.error("SMTP senden fehlgeschlagen:", e);
      // Fällt danach ggf. auf Resend zurück
    }
  }

  if (resend) {
    try {
      const result = await resend.emails.send({ from: FROM_EMAIL, to: ADMIN_EMAIL, subject, html });
      if ("error" in result && result.error) {
        console.error("Resend Fehler:", result.error);
      } else {
        console.log("Email (Resend) gesendet an", ADMIN_EMAIL);
      }
    } catch (e) {
      console.error("Email senden fehlgeschlagen:", e);
    }
  }
}

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] ?? c));
}

export async function sendBuchungEmail(buchung: Buchung, slot: Zeitslot | null) {
  if (!ADMIN_EMAIL || (!smtpTransport && !resend)) return;

  const datum = slot
    ? new Date(slot.datum + "T12:00:00").toLocaleDateString("de-AT", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "–";
  const zeit = slot ? `${slot.uhrzeit_von}–${slot.uhrzeit_bis} Uhr` : "–";
  const slotTitel = esc(slot?.titel ?? "–");

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
        <p style="font-size: 13px; color: #374151; margin: 0;">${esc(datum)} · ${esc(zeit)}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <tr><td colspan="2" style="padding: 10px 0 6px; font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em;">Elternteil</td></tr>
        <tr>
          <td style="padding: 4px 0; color: #6b7280; width: 140px;">Name</td>
          <td style="padding: 4px 0; color: #111827; font-weight: 600;">${esc(buchung.vorname)} ${esc(buchung.nachname)}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #6b7280;">E-Mail</td>
          <td style="padding: 4px 0; color: #111827;"><a href="mailto:${esc(buchung.email)}" style="color: #1a5c4a;">${esc(buchung.email)}</a></td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #6b7280;">Telefon</td>
          <td style="padding: 4px 0; color: #111827;">${esc(buchung.telefon)}</td>
        </tr>
        <tr><td colspan="2" style="padding: 10px 0 6px; font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em;">Kurs</td></tr>
        <tr>
          <td style="padding: 4px 0; color: #6b7280;">Typ</td>
          <td style="padding: 4px 0; color: #111827; font-weight: 600;">${esc(buchung.kurs_name)}</td>
        </tr>

        <tr><td colspan="2" style="padding: 16px 0 6px; font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em;">Kind & Förderung</td></tr>
        <tr>
          <td style="padding: 4px 0; color: #6b7280; vertical-align: top; width: 140px;">Kind / Klasse</td>
          <td style="padding: 4px 0; color: #111827; font-weight: 600; white-space: pre-line;">${esc(buchung.name_kind)}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #6b7280;">Schwerpunkt</td>
          <td style="padding: 4px 0; color: #111827;">${esc(buchung.schulstufe)}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #6b7280; vertical-align: top;">Förderziel</td>
          <td style="padding: 4px 0; color: #111827; white-space: pre-line;">${esc(buchung.kind_lernen)}</td>
        </tr>
        ${buchung.kind_staerken ? `<tr>
          <td style="padding: 4px 0; color: #6b7280; vertical-align: top;">Details</td>
          <td style="padding: 4px 0; color: #111827; white-space: pre-line;">${esc(buchung.kind_staerken)}</td>
        </tr>` : ""}
      </table>

    </div>

    <div style="padding: 16px 28px; border-top: 1px solid #e8eceb; text-align: center;">
      <p style="font-size: 11px; color: #9ca3af; margin: 0;">Einfach Lernen Pongau · Automatische Benachrichtigung</p>
    </div>
  </div>
</body>
</html>`;

  await sendMail(`Neue Buchung: ${buchung.name_kind} – ${slot?.titel ?? ""}`, html);
}

export async function sendBuchungEmailBatch(buchungen: Buchung[], slots: Zeitslot[], vorname: string, nachname: string) {
  if (!ADMIN_EMAIL || (!smtpTransport && !resend)) return;

  const slotsByBuchung: Record<string, Zeitslot> = {};
  for (const slot of slots) {
    slotsByBuchung[slot.id] = slot;
  }

  const termineHtml = buchungen
    .map((b) => {
      const slot = slotsByBuchung[b.zeitslot_id];
      if (!slot) return "";
      const datum = new Date(slot.datum + "T12:00:00").toLocaleDateString("de-AT", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
      return `<li style="margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #f0f0f0;"><strong>${esc(slot.titel)}</strong><br/>${esc(datum)} · ${slot.uhrzeit_von}–${slot.uhrzeit_bis} Uhr<br/><span style="font-size: 12px; color: #6b7280;">${esc(b.name_kind)}</span></li>`;
    })
    .join("");

  const html = `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; background: #f4f6f5; margin: 0; padding: 24px;">
  <div style="max-width: 560px; margin: 0 auto; background: #fff; border-radius: 12px; border: 1px solid #e8eceb; overflow: hidden;">

    <div style="background: #1a5c4a; padding: 24px 28px;">
      <p style="color: #fff; font-size: 20px; font-weight: 800; margin: 0;">Neue Buchung${buchungen.length > 1 ? "en" : ""}</p>
      <p style="color: rgba(255,255,255,0.75); font-size: 13px; margin: 4px 0 0;">Einfach Lernen Pongau</p>
    </div>

    <div style="padding: 28px;">

      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <tr><td colspan="2" style="padding: 10px 0 6px; font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em;">Elternteil</td></tr>
        <tr>
          <td style="padding: 4px 0; color: #6b7280; width: 140px;">Name</td>
          <td style="padding: 4px 0; color: #111827; font-weight: 600;">${esc(vorname)} ${esc(nachname)}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #6b7280;">E-Mail</td>
          <td style="padding: 4px 0; color: #111827;"><a href="mailto:${esc(buchungen[0].email)}" style="color: #1a5c4a;">${esc(buchungen[0].email)}</a></td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #6b7280;">Telefon</td>
          <td style="padding: 4px 0; color: #111827;">${esc(buchungen[0].telefon)}</td>
        </tr>
        <tr><td colspan="2" style="padding: 10px 0 6px; font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em;">Kurs</td></tr>
        <tr>
          <td style="padding: 4px 0; color: #6b7280;">Typ</td>
          <td style="padding: 4px 0; color: #111827; font-weight: 600;">${esc(buchungen[0].kurs_name)}</td>
        </tr>
      </table>

      <div style="background: #eaf4ef; border-radius: 8px; padding: 14px 18px; margin: 20px 0;">
        <p style="font-size: 13px; font-weight: 700; color: #1a5c4a; margin: 0 0 8px;">${buchungen.length} Buchung${buchungen.length > 1 ? "en" : ""}</p>
        <ul style="margin: 0; padding: 0; list-style: none;">
          ${termineHtml}
        </ul>
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <tr><td colspan="2" style="padding: 10px 0 6px; font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em;">Kinder & Förderung</td></tr>
        ${buchungen
          .map(
            (b, idx) => `
        <tr><td colspan="2" style="padding: 10px 0 4px; font-weight: 700; color: #374151; font-size: 12px;">Kind ${buchungen.length > 1 ? idx + 1 : ""}</td></tr>
        <tr>
          <td style="padding: 4px 0; color: #6b7280; width: 140px; vertical-align: top;">Name / Klasse</td>
          <td style="padding: 4px 0; color: #111827; font-weight: 600; white-space: pre-line;">${esc(b.name_kind)}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #6b7280;">Bereich</td>
          <td style="padding: 4px 0; color: #111827;">${esc(b.schulstufe)}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #6b7280; vertical-align: top;">Förderziel</td>
          <td style="padding: 4px 0; color: #111827; white-space: pre-line;">${esc(b.kind_lernen)}</td>
        </tr>
        ${b.kind_staerken ? `<tr>
          <td style="padding: 4px 0; color: #6b7280; vertical-align: top;">Details</td>
          <td style="padding: 4px 0; color: #111827; white-space: pre-line;">${esc(b.kind_staerken)}</td>
        </tr>` : ""}
        `
          )
          .join("")}
      </table>

    </div>

    <div style="padding: 16px 28px; border-top: 1px solid #e8eceb; text-align: center;">
      <p style="font-size: 11px; color: #9ca3af; margin: 0;">Einfach Lernen Pongau · Automatische Benachrichtigung</p>
    </div>
  </div>
</body>
</html>`;

  await sendMail(
    `Neue Buchung${buchungen.length > 1 ? "en" : ""}: ${buchungen.map((b) => b.name_kind).join(", ")} – ${slots[0]?.titel ?? ""}`,
    html
  );
}
