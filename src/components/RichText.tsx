import { Fragment } from "react";

/**
 * Rendert einen Text und wandelt **so markierte** Abschnitte in <strong> um.
 * Zeilenumbrüche (\n) werden als <br /> dargestellt.
 */
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

/** Rendert mehrere durch Leerzeile getrennte Absätze als eigene <p>-Elemente. */
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
