"use client";

import { useState, useCallback } from "react";
import ModeToggle from "@/components/stack/ModeToggle";
import CharNode, { CharState } from "@/components/two-pointers/valid-palindrome/CharNode";
import PointerNode from "@/components/two-pointers/valid-palindrome/PointerNode";
import MicroscopeView from "@/components/two-pointers/valid-palindrome/MicroscopeView";
import InputPanel, { InputField, PresetExample } from "@/components/ui/InputPanel";
import OutputPanel from "@/components/ui/OutputPanel";
import BackButton from "@/components/ui/BackButton";
import { sounds } from "@/components/ui/SoundManager";

const inputFields: InputField[] = [
  { key: "str", label: "String to check", type: "text", placeholder: "e.g. A man, a plan, a canal: Panama", defaultValue: "A man, a plan, a canal: Panama" },
];

const presets: PresetExample[] = [
  { name: "Example 1: Panama", values: { str: "A man, a plan, a canal: Panama" } },
  { name: "Example 2: race a car", values: { str: "race a car" } },
];

export default function ValidPalindromePage() {
  const [raw, setRaw] = useState("A man, a plan, a canal: Panama");
  const cleaned = raw.toLowerCase().replace(/[^a-z0-9]/g, "");

  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(cleaned.length - 1);
  const [status, setStatus] = useState<"ready" | "processing" | "done">(
    "ready"
  );
  const [mode, setMode] = useState<"beginner" | "expert">("beginner");
  const [result, setResult] = useState<"palindrome" | "not" | null>(null);
  const [stepCount, setStepCount] = useState(0);

  const handleRun = useCallback((values: Record<string, string>) => {
    setRaw(values.str || "");
    const c = (values.str || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    setLeft(0);
    setRight(c.length - 1);
    setStatus("ready");
    setResult(null);
    setStepCount(0);
    sounds.click();
  }, []);

  function step() {
    if (status === "done") return;
    setStepCount((c) => c + 1);

    if (status === "ready") setStatus("processing");

    if (left >= right) {
      setStatus("done");
      setResult("palindrome");
      sounds.success();
      return;
    }

    if (cleaned[left] !== cleaned[right]) {
      setStatus("done");
      setResult("not");
      sounds.error();
      return;
    }

    setLeft(left + 1);
    setRight(right - 1);
    sounds.tick();
  }

  function reset() {
    setLeft(0);
    setRight(cleaned.length - 1);
    setStatus("ready");
    setResult(null);
    setStepCount(0);
    sounds.reset();
  }

  function explanation() {
    if (status === "ready") {
      return "We cleaned the string to remove punctuation and spaces. Now we will compare characters at left and right indices.";
    }

    if (status === "done") {
      return result === "palindrome"
        ? "Pointers crossed without mismatch → It's a palindrome!"
        : "Characters mismatched → Not a palindrome.";
    }

    if (cleaned[left] === cleaned[right]) {
      return `Characters match: '${cleaned[left]}' == '${cleaned[right]}'. Move both pointers inward.`;
    }

    return `Mismatch found: '${cleaned[left]}' != '${cleaned[right]}'. Stop → Not a palindrome.`;
  }

  const outputResult = result === "palindrome"
    ? `✅ "${raw}" is a valid palindrome`
    : result === "not"
    ? `❌ "${raw}" is NOT a palindrome`
    : null;

  return (
    <div className="min-h-screen grid-pattern text-slate-50 flex flex-col items-center py-10 px-4 gap-10">
      <div className="w-full max-w-3xl"><BackButton href="/two-pointers" label="Two Pointers" /></div>

      <header className="flex flex-col items-center gap-2">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
          Valid <span className="text-cyan-400 text-glow-cyan">Palindrome</span>
        </h1>
        <p className="text-sm text-slate-400">Two-pointer palindrome checker visualization</p>
      </header>

      <InputPanel fields={inputFields} presets={presets} onRun={handleRun} accentColor="#22d3ee" />

      <ModeToggle mode={mode} onChange={setMode} />

      {/* Cleaned string row */}
      <div className="flex flex-col items-center gap-2">
        <div className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-1">
          Cleaned String
        </div>

        <div className="flex items-center gap-2">
          {cleaned.split("").map((ch, idx) => {
            let state: CharState = "idle";

            if (idx === left && status !== "done") state = "active";
            if (idx === right && status !== "done") state = "active";

            if (status === "done" && result === "palindrome")
              state = "match";
            if (status === "done" && result === "not" && (idx === left || idx === right))
              state = "mismatch";

            return <CharNode key={idx} ch={ch} state={state} />;
          })}
        </div>

        {/* Pointers */}
        <div className="flex items-center gap-2 h-6">
          {cleaned.split("").map((_, idx) => (
            <div key={idx} className="w-10 flex justify-center">
              {idx === left && status !== "done" && <PointerNode type="L" />}
              {idx === right && status !== "done" && <PointerNode type="R" />}
            </div>
          ))}
        </div>
      </div>

      {/* Microscope */}
      <MicroscopeView left={left} right={right} cleaned={cleaned} />

      {/* Explanation */}
      <div className="bg-[#050816] border border-slate-800 rounded-2xl px-6 py-4 max-w-3xl text-center text-sm text-slate-200 shadow-[0_0_32px_rgba(15,23,42,0.9)]">
        {explanation()}
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <button onClick={step} disabled={status === "done"} className="btn-neon btn-neon-cyan px-7 py-2">
          {status === "done" ? "Done" : "Step →"}
        </button>
        <button onClick={reset} className="btn-neon btn-ghost px-7 py-2">Reset</button>
      </div>

      <OutputPanel result={outputResult} success={result === "palindrome" ? true : result === "not" ? false : null}
        stepCount={stepCount} complexity="O(n)" visible={status === "done"} />
    </div>
  );
}
