"use client";

import { useState } from "react";
import ModeToggle from "@/components/stack/ModeToggle";

import CharNode, {
  CharState,
} from "@/components/two-pointers/is-subsequence/CharacterBox";
import MicroscopeView from "@/components/two-pointers/is-subsequence/MicroscopeView";
import PointerNode from "@/components/two-pointers/is-subsequence/PointerNode";
import OutputPanel from "@/components/ui/OutputPanel";
import BackButton from "@/components/ui/BackButton";

const S = "abc";
const T = "ahbgdc";

type Mode = "beginner" | "expert";
type Status = "ready" | "processing" | "done";

type LastAction =
  | {
      kind: "compare";
      i: number;
      j: number;
      sChar: string;
      tChar: string;
    }
  | {
      kind: "match";
      i: number;
      j: number;
      char: string;
    }
  | {
      kind: "skip";
      i: number;
      j: number;
      sChar: string;
      tChar: string;
    }
  | { kind: "done-true" }
  | { kind: "done-false" }
  | null;

export default function IsSubsequencePage() {
  const [i, setI] = useState(0);
  const [j, setJ] = useState(0);
  const [matched, setMatched] = useState<boolean[]>(Array(S.length).fill(false));
  const [status, setStatus] = useState<Status>("ready");
  const [mode, setMode] = useState<Mode>("beginner");
  const [lastAction, setLastAction] = useState<LastAction>(null);

  const matchedCount = matched.filter(Boolean).length;

  function step() {
    if (status === "done") return;

    if (status === "ready") {
      setStatus("processing");
    }

    // End condition
    if (i >= S.length || j >= T.length) {
      const ok = i >= S.length;
      setStatus("done");
      setLastAction({ kind: ok ? "done-true" : "done-false" });
      return;
    }

    const sChar = S[i];
    const tChar = T[j];

    setLastAction({
      kind: "compare",
      i,
      j,
      sChar,
      tChar,
    });

    if (sChar === tChar) {
      // match → move both
      setMatched((prev) => {
        const copy = [...prev];
        copy[i] = true;
        return copy;
      });
      setI((prev) => prev + 1);
      setJ((prev) => prev + 1);
      setLastAction({
        kind: "match",
        i,
        j,
        char: sChar,
      });
    } else {
      // mismatch → move j only
      setJ((prev) => prev + 1);
      setLastAction({
        kind: "skip",
        i,
        j,
        sChar,
        tChar,
      });
    }
  }

  function reset() {
    setI(0);
    setJ(0);
    setMatched(Array(S.length).fill(false));
    setStatus("ready");
    setLastAction(null);
  }

  function statusLabel() {
    if (status === "ready") return "Ready";
    if (status === "processing") return "Scanning…";
    if (lastAction?.kind === "done-true") return "Subsequence ✅";
    if (lastAction?.kind === "done-false") return "Not subsequence ❌";
    return "Done";
  }

  function explanation(): string {
    if (status === "ready") {
      return mode === "beginner"
        ? "We will walk through t from left to right with pointer j, and try to match the characters of s with pointer i. When s[i] == t[j], we move both; otherwise we move only j."
        : "Maintain two indices i and j. Invariant: s[0..i) is already matched as a subsequence inside t[0..j).";
    }

    if (!lastAction) {
      return "Click Step to start moving the two pointers.";
    }

    if (lastAction.kind === "match") {
      const { char } = lastAction;
      return mode === "beginner"
        ? `We compare s[i] and t[j] and they are equal ('${char}'). So this character of s is matched. We advance BOTH pointers.`
        : `Since s[i] == t[j] ('${char}'), we extend the matched prefix of s and move i++, j++. The invariant still holds.`;
    }

    if (lastAction.kind === "skip") {
      const { sChar, tChar } = lastAction;
      return mode === "beginner"
        ? `We compare s[i] = '${sChar}' with t[j] = '${tChar}'. They do NOT match, so this t[j] is useless for matching s. We skip it by moving only j.`
        : `Because s[i] != t[j] ('${sChar}' vs '${tChar}'), we discard this position in t and move j++ while keeping i fixed.`;
    }

    if (lastAction.kind === "done-true") {
      return mode === "beginner"
        ? "We consumed all characters in s. Every character of s found a match in order inside t → s IS a subsequence."
        : "i reached s.length, so the entire string s has been matched as a subsequence of t.";
    }

    if (lastAction.kind === "done-false") {
      return mode === "beginner"
        ? "We reached the end of t but some characters in s are still unmatched → s is NOT a subsequence of t."
        : "j reached t.length while i < s.length, so there are unmatched characters in s. The subsequence check fails.";
    }

    if (lastAction.kind === "compare") {
      const { sChar, tChar } = lastAction;
      return `We are comparing s[i] = '${sChar}' with t[j] = '${tChar}'.`;
    }

    return "We are stepping through the two-pointer process.";
  }

  function activeCodeLine(): number {
    if (!lastAction) return 1;

    switch (lastAction.kind) {
      case "match":
        return 3; // if (s[i] == t[j]) { ... }
      case "skip":
        return 5; // else { j++; }
      case "done-true":
      case "done-false":
        return 9; // return i == s.length;
      case "compare":
        return 2; // inside while loop
      default:
        return 2;
    }
  }

  return (
    <div className="min-h-screen grid-pattern text-slate-50 flex flex-col items-center py-10 px-4 gap-10">
      <div className="w-full max-w-3xl"><BackButton href="/two-pointers" label="Two Pointers" /></div>
      {/* Title */}
      <header className="flex flex-col items-center gap-3">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
          <span className="text-cyan-400">Is Subsequence</span>
        </h1>
        <p className="text-sm text-slate-400">
          Two-pointer visualization for checking whether s is a subsequence of t
        </p>
      </header>

      {/* View mode toggle */}
      <ModeToggle mode={mode} onChange={setMode} />

      {/* Info pills */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs mt-2">
        <div className="px-4 py-1 rounded-full border border-slate-700 bg-slate-900/70">
          s: <span className="font-mono text-cyan-300 ml-1">"{S}"</span>
        </div>
        <div className="px-4 py-1 rounded-full border border-slate-700 bg-slate-900/70">
          t: <span className="font-mono text-cyan-300 ml-1">"{T}"</span>
        </div>
        <div className="px-4 py-1 rounded-full border border-slate-700 bg-slate-900/70">
          i:{" "}
          <span className="font-mono ml-1">{i < S.length ? i : "end"}</span>
        </div>
        <div className="px-4 py-1 rounded-full border border-slate-700 bg-slate-900/70">
          j:{" "}
          <span className="font-mono ml-1">{j < T.length ? j : "end"}</span>
        </div>
        <div className="px-4 py-1 rounded-full border border-slate-700 bg-slate-900/70">
          Matched in s:{" "}
          <span className="font-mono ml-1">
            {matchedCount}/{S.length}
          </span>
        </div>
        <div
          className={`px-4 py-1 rounded-full border text-xs ${
            lastAction?.kind === "done-false"
              ? "border-rose-500/60 text-rose-400 bg-rose-500/10"
              : lastAction?.kind === "done-true"
              ? "border-emerald-500/60 text-emerald-400 bg-emerald-500/10"
              : "border-slate-600 text-slate-300 bg-slate-900/60"
          }`}
        >
          Status: {statusLabel()}
        </div>
      </div>

      {/* Main visual: rows + pointers */}
      <section className="flex flex-col items-center gap-8 mt-4">
        {/* string s row */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-1">
            String s
          </div>
          <div className="flex items-center gap-2">
            {S.split("").map((ch, idx) => {
              let state: CharState = "idle";
              if (matched[idx]) state = "matched";
              if (idx === i && status !== "done" && i < S.length) {
                state = "active";
              }

              return <CharNode key={idx} ch={ch} state={state} />;
            })}
          </div>
          {/* i pointer row */}
          <div className="flex items-center gap-2 h-5 mt-1">
            {S.split("").map((_, idx) => (
              <div key={idx} className="w-10 flex justify-center">
                <PointerNode label="i" active={idx === i && i < S.length && status !== "done"} />
              </div>
            ))}
          </div>
        </div>

        {/* string t row */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-1">
            String t
          </div>
          <div className="flex items-center gap-2">
            {T.split("").map((ch, idx) => {
              let state: CharState = "idle";

              const isCurrent = idx === j && status !== "done" && j < T.length;

              if (isCurrent) {
                state = "active";
              } else if (
                lastAction?.kind === "skip" &&
                lastAction.j === idx
              ) {
                state = "skipped";
              }

              return <CharNode key={idx} ch={ch} state={state} />;
            })}
          </div>
          {/* j pointer row */}
          <div className="flex items-center gap-2 h-5 mt-1">
            {T.split("").map((_, idx) => (
              <div key={idx} className="w-10 flex justify-center">
                <PointerNode label="j" active={idx === j && j < T.length && status !== "done"} />
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-500">
          We move through t with j, trying to match the characters of s with i in order.
        </p>
      </section>

      {/* Explanation banner */}
      <div className="bg-[#050816] border border-slate-800/80 rounded-2xl px-6 py-4 max-w-3xl text-center text-sm text-slate-200 shadow-[0_0_32px_rgba(15,23,42,0.9)]">
        {explanation()}
      </div>

      {/* Bottom 3-panel explanation */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-6xl mt-2">
        {/* Pointer intuition (already covered above) is first card again */}
        <div className="bg-[#050816] border border-slate-800/80 rounded-2xl p-4 text-sm flex flex-col gap-2">
          <h2 className="font-semibold text-slate-100 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-emerald-400" />
            Pointer intuition
          </h2>
          <div className="mt-1 space-y-1 text-xs text-slate-300">
            <p>
              <span className="text-slate-500">Current i:</span>{" "}
              <span className="font-mono text-cyan-300">
                {i < S.length ? i : "end"}
              </span>{" "}
              {i < S.length && (
                <>
                  <span className="text-slate-500"> · s[i] =</span>{" "}
                  <span className="font-mono text-cyan-300">
                    '{S[i]}'
                  </span>
                </>
              )}
            </p>
            <p>
              <span className="text-slate-500">Current j:</span>{" "}
              <span className="font-mono text-cyan-300">
                {j < T.length ? j : "end"}
              </span>{" "}
              {j < T.length && (
                <>
                  <span className="text-slate-500"> · t[j] =</span>{" "}
                  <span className="font-mono text-cyan-300">
                    '{T[j]}'
                  </span>
                </>
              )}
            </p>
            <p>
              <span className="text-slate-500">Idea:</span>{" "}
              {mode === "beginner"
                ? "We only move i forward when we successfully match s[i] inside t. Otherwise we keep i and slide j."
                : "Invariant: the first i characters of s form a subsequence of t[0..j). We never move i backwards."}
            </p>
          </div>
        </div>

        {/* Microscope view card */}
        <MicroscopeView
          matchedPrefix={S.slice(0, matchedCount)}
          remaining={S.slice(matchedCount)}
          mode={mode}
        />

        {/* Code mapping card */}
        <div className="bg-[#050816] border border-slate-800/80 rounded-2xl p-4 text-sm flex flex-col gap-2 font-mono">
          <h2 className="font-semibold text-slate-100 flex items-center gap-2 font-sans">
            <span className="w-1.5 h-4 rounded-full bg-indigo-400" />
            What this step is in code
          </h2>
          <pre className="mt-1 text-[11px] leading-relaxed text-slate-300">
            {[
              "1  int i = 0, j = 0;",
              "2  while (j < t.length && i < s.length) {",
              "3      if (s[i] == t[j]) {",
              "4          i++; j++;",
              "5      } else {",
              "6          j++;",
              "7      }",
              "8  }",
              "9  return i == s.length;",
            ].map((line, idx) => {
              const lineNumber = idx + 1;
              const active = activeCodeLine() === lineNumber;

              return (
                <div
                  key={idx}
                  className={
                    active
                      ? "bg-cyan-500/10 border-l-2 border-cyan-400 px-2 -mx-2"
                      : ""
                  }
                >
                  {line}
                </div>
              );
            })}
          </pre>
        </div>
      </section>

      {/* Controls */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={step}
          disabled={status === "done"}
          className="px-7 py-2 rounded-xl text-sm font-medium
                     bg-cyan-500 text-slate-950
                     hover:bg-cyan-400 disabled:bg-slate-700 disabled:text-slate-400
                     shadow-[0_0_30px_rgba(34,211,238,0.6)]
                     transition-all"
        >
          {status === "done" ? "Done" : "Step →"}
        </button>
        <button
          onClick={reset}
          className="px-7 py-2 rounded-xl text-sm font-medium
                     bg-slate-900 border border-slate-700
                     hover:bg-slate-800 transition-all"
        >
          Reset
        </button>
      </div>

      <OutputPanel result={lastAction?.kind === "done-true" ? `\u2705 "${S}" is a subsequence of "${T}"` : lastAction?.kind === "done-false" ? `\u274c "${S}" is NOT a subsequence of "${T}"` : null}
        success={lastAction?.kind === "done-true" ? true : lastAction?.kind === "done-false" ? false : null}
        stepCount={0} complexity="O(n)" visible={status === "done"} />
    </div>
  );
}
