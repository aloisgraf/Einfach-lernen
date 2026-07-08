import nodemailer from "nodemailer";
import { Buchung, Zeitslot } from "@/types/buchung";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

// ── SMTP (Webhost-Postfach) ───────────────────────────────────────────────────
// Versand erfolgt über das eigene Postfach des Webhosters per SMTP.
// Benötigte Env-Variablen:
//   SMTP_HOST   z.B. mail.einfachlernen-pongau.at
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
 * Versendet eine Mail an eine beliebige Adresse per SMTP (eigenes Postfach).
 * Gibt still zurück, wenn SMTP nicht konfiguriert ist.
 */
async function sendMail(to: string, subject: string, html: string): Promise<void> {
  if (!to || !smtpTransport) return;

  try {
    await smtpTransport.sendMail({ from: SMTP_FROM, to, subject, html });
    console.log("Email (SMTP) gesendet an", to);
  } catch (e) {
    console.error("SMTP senden fehlgeschlagen:", e);
  }
}

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] ?? c));
}

function formatSlotDatum(slot: Zeitslot): string {
  return new Date(slot.datum + "T12:00:00").toLocaleDateString("de-AT", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

/**
 * Baut die Buchungsbestätigung für den Kunden (an die im Formular angegebene
 * E-Mail-Adresse). Freundlicher Ton, listet die gebuchten Termine auf.
 */
function kundenBestaetigungHtml(vorname: string, kursName: string, termine: Zeitslot[]): string {
  const termineHtml = termine
    .map((slot) => `
      <li style="margin-bottom: 8px; padding: 10px 14px; background: #eaf4ef; border-radius: 8px; list-style: none;">
        <span style="font-weight: 700; color: #1a5c4a;">${esc(formatSlotDatum(slot))}</span><br/>
        <span style="color: #374151;">${slot.uhrzeit_von}–${slot.uhrzeit_bis} Uhr</span>
      </li>`)
    .join("");

  return `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; background: #f4f6f5; margin: 0; padding: 24px;">
  <div style="max-width: 560px; margin: 0 auto; background: #fff; border-radius: 12px; border: 1px solid #e8eceb; overflow: hidden;">

    <div style="background: #1a5c4a; padding: 24px 28px;">
      <p style="color: #fff; font-size: 20px; font-weight: 800; margin: 0;">Buchungsbestätigung</p>
      <p style="color: rgba(255,255,255,0.75); font-size: 13px; margin: 4px 0 0;">Einfach Lernen Pongau</p>
    </div>

    <div style="padding: 28px;">
      <p style="font-size: 15px; color: #111827; margin: 0 0 14px;">Liebe/r ${esc(vorname)},</p>
      <p style="font-size: 14px; color: #374151; line-height: 1.6; margin: 0 0 20px;">
        vielen Dank für deine Buchung! Ich habe deine Anmeldung für
        <strong>${esc(kursName)}</strong> erhalten. Hier deine Termine im Überblick:
      </p>

      <ul style="margin: 0 0 20px; padding: 0;">
        ${termineHtml}
      </ul>

      <p style="font-size: 14px; color: #374151; line-height: 1.6; margin: 0 0 20px;">
        Solltest du Fragen haben oder einen Termin ändern müssen, antworte einfach auf diese E-Mail.
      </p>

      <div style="font-size: 14px; color: #374151; line-height: 1.6; border-top: 1px solid #e8eceb; padding-top: 18px;">
        <p style="margin: 0 0 14px;">Liebe Grüße<br/>Anna Reichsöllner</p>
        <p style="margin: 0 0 2px; font-weight: 700; color: #1a5c4a;">Anna Reichsöllner, BEd MEd</p>
        <p style="margin: 0; font-weight: 700;">Einfach Lernen Pongau</p>
        <p style="margin: 0 0 12px; color: #6b7280;">Beratung | Förderung | Legasthenie &amp; Dyskalkulie</p>
        <p style="margin: 0;">📞 +43 670 190 26 04</p>
        <p style="margin: 0;">✉️ <a href="mailto:info@einfachlernen-pongau.at" style="color: #1a5c4a;">info@einfachlernen-pongau.at</a></p>
        <p style="margin: 0;">🌐 <a href="https://www.einfachlernen-pongau.at" style="color: #1a5c4a;">www.einfachlernen-pongau.at</a></p>
        <p style="margin: 0 0 12px;">📷 @einfachlernen_pongau</p>
        <p style="margin: 0; color: #6b7280;">Bauernschmiedgasse 380<br/>5531 Eben im Pongau</p>
      </div>
    </div>

    <div style="padding: 16px 28px; border-top: 1px solid #e8eceb; text-align: center;">
      <p style="font-size: 11px; color: #9ca3af; margin: 0;">Einfach Lernen Pongau · Automatische Bestätigung</p>
    </div>
  </div>
</body>
</html>`;
}

export async function sendBuchungEmail(buchung: Buchung, slot: Zeitslot | null) {
  if (!ADMIN_EMAIL || !smtpTransport) return;

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

  // Benachrichtigung an den Betreiber
  await sendMail(ADMIN_EMAIL, `Neue Buchung: ${buchung.name_kind} – ${slot?.titel ?? ""}`, html);

  // Bestätigung an den Kunden (E-Mail aus dem Formular)
  if (buchung.email) {
    const kundeHtml = kundenBestaetigungHtml(buchung.vorname, buchung.kurs_name, slot ? [slot] : []);
    await sendMail(buchung.email, `Buchungsbestätigung – ${buchung.kurs_name}`, kundeHtml);
  }
}

export async function sendBuchungEmailBatch(buchungen: Buchung[], slots: Zeitslot[], vorname: string, nachname: string) {
  if (!ADMIN_EMAIL || !smtpTransport) return;

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

  // Benachrichtigung an den Betreiber
  await sendMail(
    ADMIN_EMAIL,
    `Neue Buchung${buchungen.length > 1 ? "en" : ""}: ${buchungen.map((b) => b.name_kind).join(", ")} – ${slots[0]?.titel ?? ""}`,
    html
  );

  // Bestätigung an den Kunden (E-Mail aus dem Formular) – alle Termine der Buchung
  const kundenEmail = buchungen[0]?.email;
  if (kundenEmail) {
    const kundeHtml = kundenBestaetigungHtml(vorname, buchungen[0].kurs_name, slots);
    await sendMail(kundenEmail, `Buchungsbestätigung – ${buchungen[0].kurs_name}`, kundeHtml);
  }
}
