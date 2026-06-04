"use client";

import { useState, useEffect, useCallback } from "react";
import { SilbenWort } from "@/types/silbenspiel";
import { Trophy, RotateCcw } from "lucide-react";

interface Props { woerter: SilbenWort[] }

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
  state: "idle" | "correct" | "wrong" | "gone";
}

const LS_KEY = "silbenspiel_bestanden";

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function generateOptions(correct: string, pool: string[]): Option[] {
  const wrong = shuffle(pool.filter(s => s !== correct)).slice(0, 3);
  return shuffle([
    { id: crypto.randomUUID(), text: correct, isCorrect: true, state: "idle" as const },
    ...wrong.map(s => ({ id: crypto.randomUUID(), text: s, isCorrect: false, state: "idle" as const })),
  ]);
}

function pickWord(woerter: SilbenWort[], bestandene: Set<string>, fehlerhaft: Set<string>): SilbenWort | null {
  const available = woerter.filter(w => !bestandene.has(w.id));
  if (available.length === 0) return null;
  const clean = available.filter(w => !fehlerhaft.has(w.id));
  const pool = clean.length > 0 ? clean : available;
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function Spiel({ woerter }: Props) {
  const allSilben = woerter.flatMap(w => w.silben);

  const [bestandene, setBestandene] = useState<Set<string>>(new Set());
  const [fehlerhaft, setFehlerhaft] = useState<Set<string>>(new Set());
  const [currentWord, setCurrentWord] = useState<SilbenWort | null>(null);
  const [position, setPosition] = useState(0);
  const [built, setBuilt] = useState<string[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [score, setScore] = useState(0);
  const [wordScore, setWordScore] = useState(0);
  const [hatFehler, setHatFehler] = useState(false);
  const [phase, setPhase] = useState<"playing" | "wordWon" | "allDone">("playing");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_KEY) ?? "[]");
      setBestandene(new Set(saved));
    } catch { /* ignore */ }
  }, []);

  const startWord = useCallback((word: SilbenWort) => {
    setCurrentWord(word);
    setPosition(0);
    setBuilt([]);
    setHatFehler(false);
    setWordScore(0);
    setOptions(generateOptions(word.silben[0], allSilben));
    setPhase("playing");
  }, [allSilben]);

  useEffect(() => {
    if (woerter.length === 0) return;
    const word = pickWord(woerter, bestandene, fehlerhaft);
    if (!word) { setPhase("allDone"); return; }
    startWord(word);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleOption(opt: Option) {
    if (phase !== "playing" || !currentWord) return;
    if (opt.state !== "idle") return;

    if (opt.isCorrect) {
      setOptions(prev => prev.map(o => o.id === opt.id ? { ...o, state: "correct" } : o));
      const newBuilt = [...built, opt.text];
      const gained = 10;
      setScore(s => s + gained);
      setWordScore(ws => ws + gained);

      setTimeout(() => {
        const nextPos = position + 1;
        if (nextPos >= currentWord.silben.length) {
          // word complete
          setBuilt(newBuilt);
          setPhase("wordWon");
          if (!hatFehler) {
            const newBestandene = new Set(bestandene);
            newBestandene.add(currentWord.id);
            setBestandene(newBestandene);
            try { localStorage.setItem(LS_KEY, JSON.stringify([...newBestandene])); } catch { /* ignore */ }
          } else {
            setFehlerhaft(prev => new Set([...prev, currentWord.id]));
          }
        } else {
          setBuilt(newBuilt);
          setPosition(nextPos);
          setOptions(generateOptions(currentWord.silben[nextPos], allSilben));
        }
      }, 350);

    } else {
      setHatFehler(true);
      setScore(s => Math.max(0, s - 5));
      setOptions(prev => prev.map(o => o.id === opt.id ? { ...o, state: "wrong" } : o));

      setTimeout(() => {
        setOptions(prev => prev.map(o => o.id === opt.id ? { ...o, state: "gone" } : o));
        setTimeout(() => {
          if (currentWord) {
            setOptions(generateOptions(currentWord.silben[position], allSilben));
          }
        }, 100);
      }, 600);
    }
  }

  function handleWeiter() {
    if (!currentWord) return;
    const word = pickWord(woerter, bestandene, fehlerhaft);
    if (!word) { setPhase("allDone"); return; }
    startWord(word);
  }

  function handleReset() {
    try { localStorage.removeItem(LS_KEY); } catch { /* ignore */ }
    setBestandene(new Set());
    setFehlerhaft(new Set());
    setScore(0);
    const word = pickWord(woerter, new Set(), new Set());
    if (!word) return;
    startWord(word);
  }

  const card: React.CSSProperties = {
    background: "#fff", borderRadius: 16,
    border: "1px solid #e8eceb", boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
  };

  if (woerter.length === 0) return (
    <div style={{ ...card, padding: 48, textAlign: "center" }}>
      <p style={{ color: "#9ca3af", fontSize: 15 }}>Noch keine Wörter angelegt. Bitte im Admin-Bereich Wörter hinzufügen.</p>
    </div>
  );

  if (phase === "allDone") return (
    <div style={{ ...card, padding: 48, textAlign: "center" }}>
      <div style={{ width: 72, height: 72, background: "#eaf4ef", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", animation: "bounceIn 0.5s ease" }}>
        <Trophy style={{ width: 36, height: 36, color: "#1a5c4a" }} />
      </div>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: "0 0 10px" }}>Alle Wörter bestanden! 🎉</h2>
      <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 8 }}>Gesamtpunkte: <strong style={{ color: "#1a5c4a" }}>{score}</strong></p>
      <p style={{ color: "#9ca3af", fontSize: 13, marginBottom: 28 }}>Du hast alle Wörter perfekt gelernt.</p>
      <button onClick={handleReset} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", background: "#1a5c4a", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
        <RotateCcw style={{ width: 16, height: 16 }} /> Von vorne starten
      </button>
      <style>{`@keyframes bounceIn{0%{transform:scale(0.5);opacity:0}70%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}`}</style>
    </div>
  );

  if (!currentWord) return null;

  const bestandeneCount = bestandene.size;
  const totalCount = woerter.length;

  return (
    <div>
      {/* Score Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 16 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#1a5c4a" }}>⭐ {score} Punkte</span>
          <span style={{ fontSize: 13, color: "#9ca3af" }}>✓ {bestandeneCount}/{totalCount} bestanden</span>
        </div>
      </div>

      {phase === "wordWon" ? (
        <div style={{ ...card, padding: 40, textAlign: "center", animation: "bounceIn 0.4s ease" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>{hatFehler ? "✅" : "🏆"}</div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#1a5c4a", margin: "0 0 8px" }}>
            {currentWord.silben.join("")}
          </h2>
          <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 6 }}>
            {hatFehler ? "Geschafft – mit Fehlern" : "Perfekt! Kein Fehler"}
          </p>
          <p style={{ fontSize: 20, fontWeight: 800, color: "#111827", marginBottom: 28 }}>
            +{wordScore} Punkte
          </p>
          <button
            onClick={handleWeiter}
            style={{ padding: "13px 32px", background: "#1a5c4a", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
          >
            Weiter →
          </button>
        </div>
      ) : (
        <div style={card}>
          {/* Word display */}
          <div style={{ padding: "28px 28px 24px", borderBottom: "1px solid #f3f4f6", textAlign: "center" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16 }}>
              Baue das Wort zusammen
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: 6 }}>
              {built.map((s, i) => (
                <span key={i} style={{ padding: "8px 16px", borderRadius: 10, background: "#eaf4ef", color: "#1a5c4a", fontWeight: 800, fontSize: 18 }}>{s}</span>
              ))}
              <span style={{ padding: "8px 16px", borderRadius: 10, border: "2px dashed #1a5c4a", color: "#9ca3af", fontWeight: 700, fontSize: 18, minWidth: 60, animation: "pulse 1.5s ease infinite" }}>
                ?
              </span>
              {currentWord.silben.slice(position + 1).map((_, i) => (
                <span key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: "#e5e7eb", display: "inline-block", alignSelf: "center" }} />
              ))}
            </div>
          </div>

          {/* Options */}
          <div style={{ padding: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14, textAlign: "center" }}>
              Welche Silbe kommt als nächstes?
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {options.filter(o => o.state !== "gone").map(opt => {
                const isWrong = opt.state === "wrong";
                const isCorrectFlash = opt.state === "correct";
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleOption(opt)}
                    disabled={opt.state !== "idle"}
                    style={{
                      padding: "20px 16px",
                      borderRadius: 12,
                      border: isCorrectFlash ? "2px solid #1a5c4a" : isWrong ? "2px solid #ef4444" : "2px solid #e5e7eb",
                      background: isCorrectFlash ? "#eaf4ef" : isWrong ? "#fee2e2" : "#fff",
                      color: isCorrectFlash ? "#1a5c4a" : isWrong ? "#dc2626" : "#111827",
                      fontSize: 20,
                      fontWeight: 800,
                      cursor: opt.state === "idle" ? "pointer" : "default",
                      fontFamily: "inherit",
                      transition: "border-color 0.15s, background 0.15s",
                      animation: isWrong ? "fallDown 0.6s ease forwards" : isCorrectFlash ? "correctFlash 0.4s ease" : "none",
                    }}
                  >
                    {opt.text}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fallDown { 0%{transform:translateY(0);opacity:1} 100%{transform:translateY(80px);opacity:0} }
        @keyframes correctFlash { 0%,100%{background:#eaf4ef} 50%{background:#86efac} }
        @keyframes bounceIn { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.05)} 100%{transform:scale(1);opacity:1} }
        @keyframes pulse { 0%,100%{border-color:#1a5c4a} 50%{border-color:#9ca3af} }
      `}</style>
    </div>
  );
}
