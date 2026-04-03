"use client";

import { useState, useCallback } from "react";
import ModeToggle from "../../../components/stack/ModeToggle";
import BracketNode from "../../../components/stack/BracketNode";
import StackBox from "../../../components/stack/StackBox";
import InputPanel, { InputField, PresetExample } from "@/components/ui/InputPanel";
import OutputPanel from "@/components/ui/OutputPanel";
import BackButton from "@/components/ui/BackButton";
import { sounds } from "@/components/ui/SoundManager";

type Status = "ready" | "processing" | "valid" | "invalid";
type Mode = "beginner" | "expert";

type LastAction =
  | { kind: "push"; char: string; index: number }
  | { kind: "pop"; char: string; index: number; expected: string }
  | { kind: "mismatch"; char: string; index: number; expected: string; actualTop: string | null }
  | { kind: "emptyPop"; char: string; index: number }
  | { kind: "done-valid" }
  | { kind: "done-invalid-unclosed" }
  | null;

const OPEN = "([{";
const CLOSE = ")]}";
const MATCH: Record<string, string> = { ")": "(", "]": "[", "}": "{" };

const inputFields: InputField[] = [
  {
    key: "expression",
    label: "Expression",
    type: "text",
    placeholder: "e.g. ({[]})",
    defaultValue: "({[]})",
  },
];

const presets: PresetExample[] = [
  { name: "Example 1: ({[]})", values: { expression: "({[]})" } },
  { name: "Example 2: ({])", values: { expression: "({])" } },
];

export default function ValidParenthesesVisualizer() {
  const [expression, setExpression] = useState("({[]})");
  const [idx, setIdx] = useState(0);
  const [stack, setStack] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>("ready");
  const [mode, setMode] = useState<Mode>("beginner");
  const [lastAction, setLastAction] = useState<LastAction>(null);
  const [stepCount, setStepCount] = useState(0);

  const handleRun = useCallback((values: Record<string, string>) => {
    const expr = values.expression || "";
    setExpression(expr);
    setIdx(0);
    setStack([]);
    setStatus("ready");
    setLastAction(null);
    setStepCount(0);
    sounds.click();
  }, []);

  function step() {
    if (status === "valid" || status === "invalid") return;

    if (status === "ready") {
      setStatus("processing");
    }

    setStepCount((c) => c + 1);

    if (idx >= expression.length) {
      if (stack.length === 0) {
        setStatus("valid");
        setLastAction({ kind: "done-valid" });
        sounds.success();
      } else {
        setStatus("invalid");
        setLastAction({ kind: "done-invalid-unclosed" });
        sounds.error();
      }
      return;
    }

    const ch = expression[idx];

    if (OPEN.includes(ch)) {
      setStack((prev) => [...prev, ch]);
      setLastAction({ kind: "push", char: ch, index: idx });
      setIdx((prev) => prev + 1);
      sounds.push();
      return;
    }

    if (CLOSE.includes(ch)) {
      if (stack.length === 0) {
        setStatus("invalid");
        setLastAction({ kind: "emptyPop", char: ch, index: idx });
        sounds.error();
        return;
      }

      const top = stack[stack.length - 1];
      const expected = MATCH[ch];

      if (top !== expected) {
        setStatus("invalid");
        setLastAction({ kind: "mismatch", char: ch, index: idx, expected, actualTop: top });
        sounds.error();
        return;
      }

      setStack((prev) => prev.slice(0, prev.length - 1));
      setLastAction({ kind: "pop", char: ch, index: idx, expected });
      setIdx((prev) => prev + 1);
      sounds.pop();
      return;
    }

    // Non-bracket chars — skip
    setIdx((prev) => prev + 1);
    sounds.tick();
  }

  function reset() {
    setIdx(0);
    setStack([]);
    setStatus("ready");
    setLastAction(null);
    setStepCount(0);
    sounds.reset();
  }

  function statusLabel() {
    if (status === "ready") return "Ready";
    if (status === "processing") return "Processing…";
    if (status === "valid") return "Valid ✅";
    return "Invalid ❌";
  }

  function explanationText() {
    if (lastAction?.kind === "push") {
      return `We see '${lastAction.char}', an opening bracket. We DROP it into the stack so it can be matched later.`;
    }
    if (lastAction?.kind === "pop") {
      return `We see '${lastAction.char}', a closing bracket. It matches the top of the stack, so we POP that opening bracket.`;
    }
    if (lastAction?.kind === "emptyPop") {
      return `We see '${lastAction.char}', but the stack is already empty. There is no opening bracket to match → the string is invalid.`;
    }
    if (lastAction?.kind === "mismatch") {
      return `The closing bracket '${lastAction.char}' expected '${lastAction.expected}' on top of the stack, but found '${lastAction.actualTop ?? "nothing"}' → mismatch, so the string is invalid.`;
    }
    if (lastAction?.kind === "done-valid") {
      return `All characters have been processed and the stack is empty. Every opening bracket found its partner → the string is VALID.`;
    }
    if (lastAction?.kind === "done-invalid-unclosed") {
      return `We reached the end of the string, but the stack is not empty. Some opening brackets never got a closing partner → the string is INVALID.`;
    }
    if (status === "ready") {
      return "Click Step to start reading the string from left to right. We'll push opening brackets into the stack and pop them when we see matching closing brackets.";
    }
    return "We are reading the string from left to right, using the stack to remember which opening brackets still need to be closed.";
  }

  function activeCodeLine(): number {
    if (!lastAction) return 1;
    switch (lastAction.kind) {
      case "push": return 3;
      case "emptyPop": return 4;
      case "mismatch": return 5;
      case "pop": return 6;
      case "done-valid":
      case "done-invalid-unclosed": return 7;
      default: return 2;
    }
  }

  const currentChar = idx < expression.length ? expression[idx] : "—";
  const outputResult =
    status === "valid"
      ? `✅ Valid — all brackets are balanced in "${expression}"`
      : status === "invalid"
      ? `❌ Invalid — brackets are NOT balanced in "${expression}"`
      : null;

  return (
    <div className="min-h-screen grid-pattern text-slate-50 flex flex-col items-center py-10 px-4 gap-8">
      {/* Back + Title */}
      <div className="w-full max-w-3xl">
        <BackButton href="/stack" label="Stack" />
      </div>

      <header className="flex flex-col items-center gap-3">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
          Valid <span className="text-cyan-400 text-glow-cyan">Parentheses</span>
        </h1>
        <p className="text-sm text-slate-400">
          Visual + stack intuition for checking balanced brackets
        </p>
      </header>

      {/* Input Panel */}
      <InputPanel
        fields={inputFields}
        presets={presets}
        onRun={handleRun}
        accentColor="#22d3ee"
      />

      {/* View mode toggle */}
      <ModeToggle mode={mode} onChange={setMode} />

      {/* Info pills */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs mt-2">
        <div className="px-4 py-1 rounded-full border border-slate-700 bg-slate-900/70">
          Expression: <span className="font-mono text-cyan-300 ml-1">{expression}</span>
        </div>
        <div className="px-4 py-1 rounded-full border border-slate-700 bg-slate-900/70">
          Index: <span className="font-mono ml-1">{idx < expression.length ? idx : "end"}</span>
        </div>
        <div className="px-4 py-1 rounded-full border border-slate-700 bg-slate-900/70">
          Stack size: <span className="font-mono ml-1">{stack.length}</span>
        </div>
        <div
          className={`px-4 py-1 rounded-full border text-xs ${
            status === "invalid"
              ? "border-red-500/60 text-red-400 bg-red-500/10"
              : status === "valid"
              ? "border-emerald-500/60 text-emerald-400 bg-emerald-500/10"
              : "border-slate-600 text-slate-300 bg-slate-900/60"
          }`}
        >
          Status: {statusLabel()}
        </div>
      </div>

      {/* Main visual: stream + stack */}
      <section className="flex flex-col items-center gap-6 mt-4">
        {/* Bracket stream */}
        <div className="flex items-center gap-4 flex-wrap justify-center">
          {expression.split("").map((ch, i) => {
            let state: "default" | "active" | "processed" | "error" = "default";
            if (i < idx) state = "processed";
            if (i === idx && status !== "valid" && status !== "invalid") state = "active";
            if (
              lastAction &&
              (lastAction.kind === "mismatch" || lastAction.kind === "emptyPop") &&
              lastAction.index === i
            ) {
              state = "error";
            }
            return <BracketNode key={i} symbol={ch} variant="stream" state={state} />;
          })}
        </div>

        <p className="text-xs text-slate-500">
          We scan the string from left to right, one character per step.
        </p>

        {/* Stack visual */}
        <StackBox stack={stack} lastAction={lastAction} />
      </section>

      {/* Explanation banner */}
      <div className="glass-card px-6 py-4 max-w-3xl text-center text-sm text-slate-200">
        {explanationText()}
      </div>

      {/* Bottom 3-panel explanation */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-6xl mt-2">
        {/* Pointer intuition */}
        <div className="glass-card p-4 text-sm flex flex-col gap-2">
          <h2 className="font-semibold text-slate-100 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-emerald-400" />
            Pointer intuition
          </h2>
          <div className="mt-1 space-y-1 text-xs text-slate-300">
            <p>
              <span className="text-slate-500">Current char:</span>{" "}
              <span className="font-mono text-cyan-300">{currentChar}</span>
            </p>
            <p>
              <span className="text-slate-500">Stack top:</span>{" "}
              <span className="font-mono text-emerald-300">
                {stack.length === 0 ? "∅ (empty)" : stack[stack.length - 1]}
              </span>
            </p>
            <p>
              <span className="text-slate-500">Idea:</span>{" "}
              {mode === "beginner"
                ? "Use the stack like a memory of open brackets we still need to close."
                : "Stack top must always be the matching opening bracket for the next closing bracket we see."}
            </p>
          </div>
        </div>

        {/* Microscope */}
        <div className="glass-card p-4 text-sm flex flex-col gap-2">
          <h2 className="font-semibold text-slate-100 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-cyan-400" />
            Microscope: inside the stack
          </h2>
          <div className="mt-1 text-xs text-slate-300 space-y-1">
            <p className="text-slate-400">From bottom to top (oldest → newest):</p>
            <p className="font-mono">
              {stack.length === 0 ? (
                <span className="text-slate-500">[ empty ]</span>
              ) : (
                stack.map((c, i) => (
                  <span
                    key={i}
                    className={
                      i === stack.length - 1
                        ? "inline-block px-2 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/40 mr-1"
                        : "inline-block px-2 py-1 rounded-lg bg-slate-900/80 border border-slate-700 mr-1"
                    }
                  >
                    {c}
                  </span>
                ))
              )}
            </p>
            {mode === "beginner" ? (
              <p>The top cell is the one we compare with the next closing bracket.</p>
            ) : (
              <p>The stack behaves like LIFO. Contains exactly the unmatched opening brackets seen so far.</p>
            )}
          </div>
        </div>

        {/* Code mapping */}
        <div className="glass-card p-4 text-sm flex flex-col gap-2 font-mono">
          <h2 className="font-semibold text-slate-100 flex items-center gap-2 font-sans">
            <span className="w-1.5 h-4 rounded-full bg-indigo-400" />
            What this step is in code
          </h2>
          <pre className="mt-1 text-[11px] leading-relaxed text-slate-300">
            {[
              "1  stack<char> st;",
              "2  for (char c : s) {",
              "3      if (c is '(', '[', '{') st.push(c);",
              "4      else if (st.empty()) return false;",
              "5      else if (top and c do not match) return false;",
              "6      else st.pop();",
              "7  }",
              "8  return st.empty();",
            ].map((line, i) => {
              const lineNumber = i + 1;
              const active = activeCodeLine() === lineNumber;
              return (
                <div
                  key={i}
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
          disabled={status === "valid" || status === "invalid"}
          className="btn-neon btn-neon-cyan px-7 py-2"
        >
          {status === "valid" || status === "invalid" ? "Done" : "Step →"}
        </button>
        <button onClick={reset} className="btn-neon btn-ghost px-7 py-2">
          Reset
        </button>
      </div>

      {/* Output Panel */}
      <OutputPanel
        result={outputResult}
        success={status === "valid" ? true : status === "invalid" ? false : null}
        stepCount={stepCount}
        complexity="O(n)"
        visible={status === "valid" || status === "invalid"}
      />
    </div>
  );
}
