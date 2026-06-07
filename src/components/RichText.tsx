import { Fragment } from "react";

export function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((zeile, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {zeile.split(/(\*\*[^*]+\*\*)/g).map((teil, j) =>
            teil.startsWith("**") && teil.endsWith("**") ? (
              <strong key={j}>{teil.slice(2, -2)}</strong>
            ) : (
              <Fragment key={j}>{teil}</Fragment>
            )
          )}
        </Fragment>
      ))}
    </>
  );
}

export function RichParagraphs({ text, className }: { text: string; className?: string }) {
  return (
    <>
      {text.split(/\n\s*\n/).map((absatz, i) => (
        <p key={i} className={className}>
          <RichText text={absatz} />
        </p>
      ))}
    </>
  );
}

/**
 * Rendert strukturierten Inhalt aus einer Textarea.
 * Konventionen:
 *  - Absätze durch Leerzeile trennen
 *  - `## Überschrift` → <h3>
 *  - `- Punkt` (alle Zeilen im Block) → <ul><li>
 *  - `[PREIS] text` → <div class="price-box">
 *  - `[*] text` → <p class="fussnote">
 *  - `**fett**` → <strong>
 */
export function ContentSection({ text }: { text: string }) {
  if (!text?.trim()) return null;

  const blocks = text.split(/\n\s*\n/).filter((s) => s.trim());

  return (
    <>
      {blocks.map((block, i) => {
        const trimmed = block.trim();

        if (trimmed.startsWith("## ")) {
          return <h3 key={i}><RichText text={trimmed.slice(3)} /></h3>;
        }

        if (trimmed.startsWith("[PREIS]")) {
          return <div key={i} className="price-box">{trimmed.slice(7).trim()}</div>;
        }

        if (trimmed.startsWith("[*]")) {
          return <p key={i} className="fussnote"><RichText text={trimmed.slice(3).trim()} /></p>;
        }

        const lines = trimmed.split("\n");
        if (lines.length > 0 && lines.every((l) => l.trim().startsWith("- "))) {
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}><RichText text={l.trim().slice(2)} /></li>
              ))}
            </ul>
          );
        }

        return <p key={i}><RichText text={trimmed} /></p>;
      })}
    </>
  );
}

/**
 * Rendert FAQ-Einträge aus einer Textarea.
 * Format: Frage als erste Zeile, dann Antwort-Absätze. Paare durch --- getrennt.
 */
export function FaqSection({ text }: { text: string }) {
  if (!text?.trim()) return null;

  const entries = text.split(/\n---\n/).filter((s) => s.trim());

  return (
    <>
      {entries.map((entry, i) => {
        const paragraphs = entry.trim().split(/\n\s*\n/).filter((s) => s.trim());
        const frage = paragraphs[0];
        const antwort = paragraphs.slice(1);

        return (
          <details className="faq-item" key={i} {...(i === 0 ? { open: true } : {})}>
            <summary>{frage}</summary>
            <div className="faq-a">
              {antwort.map((p, j) => (
                <p key={j}><RichText text={p} /></p>
              ))}
            </div>
          </details>
        );
      })}
    </>
  );
}

export function splitItems(text: string): string[] {
  return text.split("\n").filter((s) => s.trim());
}

export function splitBlocks(text: string): string[] {
  return text.split(/\n\s*\n/).filter((s) => s.trim());
}

/** Parst eine header-Textarea (Zeilen: Kicker, Titel, Untertitel) */
export function parseHeader(text: string): { kicker: string; titel: string; subtitel: string } {
  const lines = text.split("\n");
  return {
    kicker: lines[0] || "",
    titel: lines[1] || "",
    subtitel: lines.slice(2).join("\n") || "",
  };
}

/** Parst eine CTA-Textarea (erste Zeile = Überschrift, letzte = Button, Mitte = Text) */
export function parseCta(text: string): { heading: string; text: string; button: string } {
  const lines = text.split("\n");
  if (lines.length <= 1) return { heading: lines[0] || "", text: "", button: "" };
  if (lines.length === 2) return { heading: lines[0], text: "", button: lines[1] };
  return {
    heading: lines[0],
    text: lines.slice(1, -1).join("\n"),
    button: lines[lines.length - 1],
  };
}
