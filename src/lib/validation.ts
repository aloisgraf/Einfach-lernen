import { z } from "zod";

/**
 * Text-Eingabe, die mindestens einen Buchstaben enthalten muss.
 * Verhindert Platzhalter-Eingaben wie "..", "-" oder "123" in Namens- und Freitextfeldern.
 */
export function textMitBuchstabe(min: number) {
  return z
    .string()
    .min(min)
    .regex(/\p{L}/u, "Bitte eine gültige Eingabe machen.");
}
